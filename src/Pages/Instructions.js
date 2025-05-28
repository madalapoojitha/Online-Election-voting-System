// Pages/Instructions.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css"; // Create this CSS file

const Instructions = () => {
  const navigate = useNavigate();

  const handleStartVoting = () => {
    navigate("/ballot");
  };

  return (
    <div className="instruction-container">
      <h2 className="instruction-title">Voting Instructions</h2>
      <ol className="instruction-list">
        <li>Ensure you have a stable internet connection</li>
        <li>Verify your identity through all security checks</li>
        <li>Read all candidate information carefully</li>
        <li>Select your preferred candidate</li>
        <li>Review your selection before submitting</li>
        <li>Click 'Submit' to finalize your vote</li>
        <li>Do not refresh or close the browser during voting</li>
      </ol>
      <button className="start-voting-btn" onClick={handleStartVoting}>
        Proceed to Ballot
      </button>
    </div>
  );
};

export default Instructions;
