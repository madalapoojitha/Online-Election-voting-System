import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DistanceMeasure.css";

const fixedDistances = {
  "Kotta Kanchela": "67 km",
  Eluru: "90 km",
  Mangalagiri: "10 km",
  Elury: "90 km",
  "Dyvala Ravury": "142 km",
  "Dyvala Ravuru": "142 km",
};

const DistanceMeasure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { extractedAddress } = location.state || {};
  const userLocation = "Amaravati, Andhra Pradesh";

  const [distance, setDistance] = useState("Fetching...");
  const [showAlert, setShowAlert] = useState(false);
  const [showRedirectMessage, setShowRedirectMessage] = useState(true);

  useEffect(() => {
    let timer;

    if (extractedAddress) {
      const formattedAddress = extractedAddress.split(",")[0].trim();
      const distanceText =
        fixedDistances[formattedAddress] || "Unknown Distance";
      setDistance(distanceText);

      if (distanceText === "Unknown Distance") {
        setShowRedirectMessage(false);
        // Redirect to document verification after 2 seconds
        timer = setTimeout(() => {
          navigate("/verification/document");
        }, 2000);
        return; // exit early
      }

      const numericDistance = parseFloat(distanceText);

      if (!isNaN(numericDistance) && numericDistance < 90) {
        setShowAlert(true);
        setShowRedirectMessage(false);
      } else {
        sessionStorage.setItem(
          "distanceFromPollingStation",
          numericDistance.toString()
        );

        // Redirect to instructions after 3 seconds
        timer = setTimeout(() => {
          navigate("/instructions");
        }, 3000);
      }
    } else {
      setDistance("Unknown Distance");
      // Redirect to document verification if address not found
      timer = setTimeout(() => {
        navigate("/verification/document");
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [extractedAddress, navigate]);

  const handleOkClick = () => {
    navigate("/"); // Redirect to home
  };

  return (
    <div className="wrapper">
      <div className="dist-container">
        <h2>Distance Measurement</h2>
        <p>
          <strong>Your Location:</strong> {userLocation}
        </p>
        <p>
          <strong>Destination:</strong> {extractedAddress || "Not Found"}
        </p>
        <p>
          <strong>Approximate Distance:</strong> {distance}
        </p>

        {showAlert ? (
          <>
            <p style={{ color: "red" }}>
              ❌ You can't vote remotely because your distance from the polling
              station is less than 90 km. Please go to the polling station and
              cast your vote.
            </p>
            <button onClick={handleOkClick} className="retry-btn">
              OK
            </button>
          </>
        ) : (
          showRedirectMessage && (
            <p>Redirecting to voting instructions in 3 seconds...</p>
          )
        )}
      </div>
    </div>
  );
};

export default DistanceMeasure;
