import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./LocationCheck.css";

const LocationCheck = () => {
  const [message, setMessage] = useState("Checking your location...");
  const navigate = useNavigate();

  const storeLocationData = (lat, lon) => {
    const coords = `${lon},${lat}`;
    sessionStorage.setItem("userLocation", coords);
    sessionStorage.setItem("displayLocation", "Your current location");
  };

  const checkUserLocation = useCallback(() => {
    const handleSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      storeLocationData(latitude, longitude);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();

        if (data.address) {
          const displayText = [
            data.address.city || data.address.town || data.address.village,
            data.address.state,
          ]
            .filter(Boolean)
            .join(", ");

          sessionStorage.setItem("displayLocation", displayText);
        }

        // Only navigate if everything succeeded
        setMessage("✅ Location verified. Redirecting...");
        setTimeout(() => navigate("/verification/face"), 2000);
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        setMessage("❌ Location verification failed. Please try again.");
        sessionStorage.removeItem("userLocation");
      }
    };

    const handleError = (error) => {
      console.error("Geolocation error:", error);
      sessionStorage.removeItem("userLocation");
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setMessage("❌ Location access denied. Please enable permissions.");
          break;
        case error.POSITION_UNAVAILABLE:
          setMessage("❌ Location information unavailable.");
          break;
        case error.TIMEOUT:
          setMessage("❌ Location request timed out. Please try again.");
          break;
        default:
          setMessage("❌ Error getting location.");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        { timeout: 10000 } // 10 seconds timeout
      );
    } else {
      setMessage("❌ Browser doesn't support geolocation");
    }
  }, [navigate]);

  useEffect(() => {
    checkUserLocation();
  }, [checkUserLocation]);

  return (
    <div className="location-check-container">
      <h2>Location Verification</h2>
      <p>{message}</p>
      {message.startsWith("❌") && (
        <button onClick={checkUserLocation} className="retry-btn">
          Retry Location Check
        </button>
      )}
    </div>
  );
};

export default LocationCheck;
