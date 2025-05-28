import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import "./DocumentVerification.css";

const DocumentVerification = () => {
  const [image, setImage] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [extractedAddress, setExtractedAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVerified) {
      const timer = setTimeout(() => {
        navigate("/verification/distance", { state: { extractedAddress } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVerified, navigate, extractedAddress]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        processOCR(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVerificationStatus("❌ Please upload a valid image file");
    }
  };

  const processOCR = async (imageData) => {
    setIsProcessing(true);
    setVerificationStatus("🔄 Processing document, please wait...");
    setAadhaarNumber("");
    setExtractedAddress("");
    setIsVerified(false);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log(m),
      });

      const aadhaarValid = extractAadhaarNumber(text);
      const addressValid = extractAddress(text);

      if (aadhaarValid && addressValid) {
        setIsVerified(true);
        setVerificationStatus("✅ Document Verified Successfully!");
      } else {
        setVerificationStatus("❌ Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("OCR Extraction Error:", error);
      setVerificationStatus("❌ Error processing the document.");
    } finally {
      setIsProcessing(false);
    }
  };

  const extractAadhaarNumber = (text) => {
    const aadhaarRegex = /(\b\d{4}\s\d{4}\s\d{4}\b)|(\b\d{12}\b)/;
    const match = text.match(aadhaarRegex);
    if (match) {
      const formattedAadhaar = match[0].replace(/(\d{4})(?=\d)/g, "$1 ");
      setAadhaarNumber(formattedAadhaar);
      return true;
    }
    setAadhaarNumber("");
    return false;
  };

  const extractAddress = (text) => {
    const addressPatterns = {
      village: /(village|vtc):?\s*([^\n\d,]+)/i,
      district: /(district):?\s*([^\n\d,]+)/i,
      state: /(state):?\s*([^\n\d,]+)/i,
      pincode: /(\b\d{6}\b)/,
    };

    const addressParts = {};
    Object.entries(addressPatterns).forEach(([key, regex]) => {
      const match = text.match(regex);
      if (match) addressParts[key] = match[2] || match[1];
    });

    const finalAddress = [
      addressParts.village,
      addressParts.district,
      addressParts.state,
      addressParts.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const isValidAddress = Boolean(
      addressParts.village && addressParts.district && addressParts.state
    );

    if (isValidAddress) {
      setExtractedAddress(finalAddress);
      return true;
    }

    setExtractedAddress("Address not detected");
    return false;
  };

  return (
    <div className="document-verification-container">
      <div className="verification-card">
        <h2>Document Verification</h2>

        <label className="file-upload-label">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isProcessing}
          />
          <div className="upload-content">
            <span className="upload-icon">📄</span>
            {image ? "Change Document" : "Upload Aadhaar Card"}
            {isProcessing && <div className="processing-spinner"></div>}
          </div>
        </label>

        {image && (
          <div className="image-preview-container">
            <img
              src={image}
              alt="Uploaded Document"
              className="document-preview"
            />
            <div className="preview-overlay">Document Preview</div>
          </div>
        )}

        <div
          className={`status-message ${
            verificationStatus.includes("✅") ? "success" : "error"
          }`}
        >
          {verificationStatus}
        </div>

        <div className="results-container">
          {aadhaarNumber && (
            <div className="info-card">
              <h3>Aadhaar Number</h3>
              <p className="aadhaar-number">{aadhaarNumber}</p>
            </div>
          )}

          {extractedAddress && (
            <div className="info-card">
              <h3>Registered Address</h3>
              <p className="address-text">
                {extractedAddress.split(", ").map((part, index) => (
                  <span key={index}>
                    {part}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;
