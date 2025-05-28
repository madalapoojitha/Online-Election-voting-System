import React, { useRef, useState } from "react";
import axios from "axios";
import "./FaceVerification.css";
import DocumentVerification from "./DocumentVerification";

const FaceDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("Click 'Start Camera'");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  const API_KEY = "";
  const API_SECRET = "";
  const API_URL = "";

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      setMessage("❌ Camera access denied.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const detectFace = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/jpeg");

    const blob = await fetch(imageDataURL).then((res) => res.blob());
    const formData = new FormData();
    formData.append("api_key", API_KEY);
    formData.append("api_secret", API_SECRET);
    formData.append("image_file", blob);

    setMessage("🔄 Detecting face...");

    try {
      const response = await axios.post(API_URL, formData);
      if (response.data.faces.length > 0) {
        setMessage("✅ Face detected! Proceeding to Document Verification...");
        stopCamera(); // Stop the camera
        setTimeout(() => setFaceDetected(true), 2000);
      } else {
        setMessage("❌ No face detected. Try again.");
      }
    } catch (error) {
      setMessage("❌ Error detecting face.");
    }
  };

  return (
    <div className="container">
      {!faceDetected ? (
        <>
          <h2>Face Detection</h2>
          <video ref={videoRef} autoPlay playsInline width="400" height="300" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div>
            {!isCameraOn ? (
              <button onClick={startCamera}>Start Camera</button>
            ) : (
              <button onClick={detectFace}>Capture & Detect</button>
            )}
          </div>
          <p>{message}</p>
        </>
      ) : (
        <DocumentVerification />
      )}
    </div>
  );
};

export default FaceDetection;
