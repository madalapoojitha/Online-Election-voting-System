import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaUserPlus, FaEnvelope, FaBars } from "react-icons/fa";
import "./Navbar.css";

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <h1 className="logo">Online Election Voting System</h1>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <FaHome className="icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/auth/login" onClick={() => setMenuOpen(false)}>
            <FaUser className="icon" /> Login
          </Link>
        </li>
        <li>
          <Link to="/auth/signup" onClick={() => setMenuOpen(false)}>
            <FaUserPlus className="icon" /> SignUp
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            <FaEnvelope className="icon" /> ContactUs
          </Link>
        </li>
      </ul>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FaBars />
      </div>
    </nav>
  );
};

export default NavigationBar;
