import React from "react";
import { Container } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import "./Home.css";

// Import decorative images




const Home = () => {
  return (
    <Container className="home-container">
      {/* Fixed Side Decorations */}
     
      <div className="content-box">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="home-title">Welcome to VoteSecure</h1>
          <p className="home-subtitle">
            A secure and transparent online voting platform designed for fair
            and accessible elections.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="section">
          <h2 className="section-title">How It Works</h2>
          <p className="section-text">
            VoteSecure ensures a seamless and secure voting process through a
            user-friendly online system. Our advanced authentication system
            verifies your identity before allowing you to cast your vote.
          </p>
          <ul className="feature-list">
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Verified Registration</b>
                <span>Secure signup with government-issued credentials</span>
              </div>
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Multi-Factor Authentication</b>
                <span>OTP verification for secure access</span>
              </div>
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Remote Voting</b>
                <span>Cast your vote from any authorized location</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Why Choose VoteSecure Section */}
        <div className="section">
          <h2 className="section-title">Why Choose VoteSecure?</h2>
          <p className="section-text">
            Our platform guarantees fairness, security, and accessibility for
            all voters.
          </p>
          <ul className="feature-list">
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Military-Grade Security</b>
                <span>End-to-end encryption</span>
              </div>
            </li>
            <li>
              
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Transparent Audit Trail</b>
                <span>Real-time vote tracking with verifiable results</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Voter Eligibility Section */}
        <div className="section">
          <h2 className="section-title">Voter Eligibility</h2>
          <p className="section-text">
            Secure location verification ensures fair voting access while
            maintaining electoral integrity.
          </p>
          <ul className="feature-list">
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Geographical Verification</b>
                <span>90km radius restriction from polling centers</span>
              </div>
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Remote Authorization</b>
                <span>Cross-state and international voting enabled</span>
              </div>
            </li>
            <li>
              <FaCheckCircle className="check-icon" />
              <div>
                <b>Automated Validation</b>
                <span>Real-time GPS and document verification system</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Home;
