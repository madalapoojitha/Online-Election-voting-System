const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createPool({
  host: "",
  user: "",
  password: "", // Change this to your actual password
  database: "",
  connectionLimit: 10,
});

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database Connection Failed:", err);
    return;
  }
  console.log("MySQL Database Connected...");
  connection.release();
});

// Twilio Credentials (Hardcoded)
const TWILIO_ACCOUNT_SID = "";
const TWILIO_AUTH_TOKEN = "";
const TWILIO_PHONE_NUMBER = "";

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Register User
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
          [username, email, hashedPassword],
          (err, result) => {
            if (err) throw err;
            res
              .status(201)
              .json({ success: true, message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      db.query(
        "INSERT INTO login_history (user_id, email, password) VALUES (?, ?, ?)",
        [user.id, user.email, user.password],
        (err) => {
          if (err) {
            console.error("Login history error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Error storing login history" });
          }
        }
      );

      res.json({ success: true, message: "Login successful" });
    }
  );
});

// Create Tables
const CREATE_OTP_TABLE = `
  CREATE TABLE IF NOT EXISTS otp_storage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    phone_number VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE)
  )`;

db.query(CREATE_OTP_TABLE, (err) => {
  if (err) throw err;
  console.log("OTP table created or exists");
});

// Define CREATE_VOTES_TABLE before its usage
const CREATE_VOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    candidate_name VARCHAR(255) NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

// Ensure the votes table is created
db.query(CREATE_VOTES_TABLE, (err) => {
  if (err) throw err;
  console.log("Votes table ready");
});

// Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await twilioClient.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    db.query(
      "INSERT INTO otp_storage (phone_number, otp) VALUES (?, ?)",
      [phoneNumber, otp],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error storing OTP" });
        }
        res.json({ success: true, message: "OTP sent successfully" });
      }
    );
  } catch (error) {
    console.error("Twilio error:", error);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { phoneNumber, otp } = req.body;

  db.query(
    "SELECT * FROM otp_storage WHERE phone_number = ? AND otp = ? AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
    [phoneNumber, otp],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Verification failed" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      res.json({ success: true, message: "OTP verified" });
    }
  );
});

app.post("/api/vote", (req, res) => {
  const { candidate, userEmail } = req.body;

  if (!candidate || !userEmail) {
    return res.status(400).json({
      success: false,
      message: "Candidate and user email are required.",
    });
  }

  db.query(
    "SELECT id FROM users WHERE email = ?",
    [userEmail],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(500).json({
          success: false,
          message: "User not found.",
        });
      }

      const userId = results[0].id;

      // Check if the user has already voted
      db.query(
        "SELECT * FROM votes WHERE user_id = ?",
        [userId],
        (err, voteResults) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error checking previous votes.",
            });
          }

          if (voteResults.length > 0) {
            return res.status(403).json({
              success: false,
              message: "You have already voted.",
            });
          }

          // If the user hasn't voted, proceed to insert the vote
          db.query(
            "INSERT INTO votes (user_id, candidate_name) VALUES (?, ?)",
            [userId, candidate],
            (err) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: "Failed to store vote.",
                });
              }
              res.json({
                success: true,
                message: "Vote submitted successfully.",
              });
            }
          );
        }
      );
    }
  );
});
// 1. Update the aadhaar table schema
const CREATE_AADHAAR_TABLE = `
CREATE TABLE IF NOT EXISTS aadhar (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  aadhaar_number VARCHAR(14) UNIQUE NOT NULL,
  stored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;

// 2. Modified save-aadhaar endpoint
app.post("/api/save-aadhaar", (req, res) => {
  const { aadhaarNumber, userId } = req.body; // Changed from userEmail to userId

  // Allow both formatted and unformatted Aadhaar numbers
  const cleanAadhaar = aadhaarNumber.replace(/\s/g, "");
  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Aadhaar number (12 digits required)",
    });
  }

  const formattedAadhaar = cleanAadhaar.replace(/(\d{4})(?=\d)/g, "$1 ");

  db.query(
    `INSERT INTO aadhar (user_id, aadhaar_number)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
     aadhaar_number = VALUES(aadhaar_number)`,
    [userId, formattedAadhaar],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        const message =
          err.code === "ER_DUP_ENTRY"
            ? "Aadhaar number already exists"
            : "Database operation failed";
        return res.status(500).json({ success: false, message });
      }
      res.json({
        success: true,
        message: "Aadhaar stored successfully",
      });
    }
  );
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
