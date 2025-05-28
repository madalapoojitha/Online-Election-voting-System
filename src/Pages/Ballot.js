// Ballot.js (Client)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Ballot.css";

const Ballot = () => {
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const navigate = useNavigate();

  const candidates = [
    {
      id: 1,
      name: "Narra Chandra Babu Naidu",
      party: "Telugu Desam Party(TDP)",
    },
    {
      id: 2,
      name: "Jagan Mohan Reddy",
      party: "Yuvajana Shramika Rythu Congress Party(YSRCP)",
    },
    { id: 3, name: "Konidela Pawan Kalyan", party: "Janasena Party(JSP)" },
    { id: 4, name: "Pandu Ranga Yadav Siddapu", party: "Samajvadi Party(SP)" },
    { id: 5, name: "Y. S. Sharmila", party: "Indian National Congress(INC)" },
    {
      id: 6,
      name: "Daggubati Purandeswari",
      party: "Bharatiya Janata Party(BJP)",
    },
    { id: 7, name: "NOTA", party: "None Of The Above" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCandidate) {
      alert("Please select a candidate before submitting.");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/vote", {
        candidate: selectedCandidate,
        userEmail: userEmail,
      });

      if (response.data.success) {
        alert("Vote submitted successfully!");
        navigate("/confirmation");
      } else {
        alert("Failed to submit vote. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Duplicate vote detected. You have already voted.");
      navigate("/");
    }
  };

  return (
    <div className="ballot-container">
      <h2>2024 Presidential Election</h2>
      <form onSubmit={handleSubmit}>
        <div className="candidate-list">
          {candidates.map((candidate) => (
            <div className="candidate-item" key={candidate.id}>
              <input
                type="radio"
                id={`candidate-${candidate.id}`}
                name="candidate"
                value={candidate.name}
                onChange={(e) => setSelectedCandidate(e.target.value)}
              />
              <label htmlFor={`candidate-${candidate.id}`}>
                {candidate.name} - {candidate.party}
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="submit-vote-btn">
          Submit Vote
        </button>
      </form>
    </div>
  );
};

export default Ballot;
