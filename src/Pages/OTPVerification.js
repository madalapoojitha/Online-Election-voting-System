import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OTPVerification.css";

const countryCodes = [
  { code: "+1", country: "USA" },
  { code: "+91", country: "India" },
  { code: "+44", country: "UK" },
];
const TWILIO_ACCOUNT_SID = "";
const TWILIO_AUTH_TOKEN = "";
const TWILIO_PHONE_NUMBER = "";
const OTPVerification = () => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendOTP = async () => {
    const fullNumber = `${countryCode}${phoneNumber}`;
    if (!phoneNumber || phoneNumber.length < 6) {
      setMessage("⚠️ Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: fullNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsOtpSent(true);
        setMessage("📲 OTP sent successfully!");
      } else {
        setMessage(data.message || "❌ Failed to send OTP");
      }
    } catch (error) {
      setMessage("❌ Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setMessage("⚠️ Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          otp,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ OTP Verified Successfully!");
        setTimeout(() => {
          navigate("/verification/location");
        }, 2000);
      } else {
        setMessage(data.message || "❌ Verification failed");
      }
    } catch (error) {
      setMessage("❌ Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Mobile Number Verification</h2>

      {!isOtpSent ? (
        <>
          <div className="input-group">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="country-select"
            >
              {countryCodes.map(({ code, country }) => (
                <option key={code} value={code}>
                  {country} ({code})
                </option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, ""))
              }
              className="phone-input"
              maxLength="15"
            />
          </div>
          <button
            onClick={sendOTP}
            disabled={isLoading}
            className="send-otp-btn"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <p>
            Enter OTP sent to {countryCode} {phoneNumber}
          </p>
          <input
            type="text"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="otp-input"
            maxLength="6"
          />
          <button
            onClick={verifyOTP}
            disabled={isLoading}
            className="verify-btn"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
          <button onClick={sendOTP} className="resend-btn" disabled={isLoading}>
            Resend OTP
          </button>
        </>
      )}

      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
