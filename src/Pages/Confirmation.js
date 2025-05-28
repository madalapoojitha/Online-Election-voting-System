import React from "react";
import { useNavigate } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation-container">
      <h2>Thank You for Voting!</h2>
      <p>Your vote has been recorded successfully.</p>
      <button className="back-home-btn" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
};

export default Confirmation;
