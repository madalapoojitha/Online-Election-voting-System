
# 🗳️ Online Voting System

This is a secure and user-friendly **Online Voting System** built with React.js. It facilitates electronic voting through OTP verification, face recognition, and document validation to ensure a fair and secure process.

## 📁 Project Structure

voting-system/
│
├── src/
│ ├── assets/ # Images used in the frontend
│ ├── components/ # Reusable components like Footer, NavBar
│ ├── Pages/ # Main pages of the app
│ │ ├── AuthForms.* # Login/Signup forms
│ │ ├── Ballot.* # Voting page
│ │ ├── Confirmation.js # Confirmation page after voting
│ │ ├── Contact.* # Contact page
│ │ ├── DistanceMeasure.* # Location-based checks
│ │ ├── DocumentVerification.* # Document verification page
│ │ ├── FaceVerification.* # Facial recognition for validation
│ │ ├── Home.* # Landing page
│ │ ├── Instructions.* # Voting instructions
│ │ ├── LocationCheck.* # User location validation
│ │ ├── OTPVerification.* # OTP verification logic and UI
│ ├── App.js # Root component
│ ├── App.css # Global styles
│ ├── index.js # App entry point
│ ├── reportWebVitals.js
│ ├── setupTests.js
│
├── .env # Environment variables
├── .gitignore # Files to ignore in Git
├── package-lock.json
├── package.json
├── README.md # You're here!

## 🚀 Features

- 🧾 **User Authentication:** Secure login/signup with OTP.
  
- 🛰️ **Location Verification:** Validates user location using coordinates.
  
- 📸 **Face Verification:** Ensures user identity via webcam.
  
- 🗂️ **Document Upload:** Verifies official documents for identity.
  
- 🗳️ **Voting Mechanism:** Simple and intuitive ballot page.
  
- 📧 **Contact Page:** For reaching support or reporting issues.

## 🛠️ Tech Stack

- **Frontend:** React.js, CSS
  
- **Backend (planned or external):** SQL (not shown in the current repo)
- **Libraries Used:**

  - `react-router-dom` for routing
    
  - Web APIs for geolocation and camera access
    
  - `dotenv` for managing sensitive config

## 📷 Screenshots

_(Add screenshots here if available, e.g. Home page, OTP verification, Ballot page, etc.)_

## 🔧 Installation

1. Clone the repository:
2. 
   git clone https://github.com/yourusername/voting-system.git
   
   cd voting-system
Install dependencies:

npm install

Start the app:

npm start

App will be available at: http://localhost:3000

📌 To Do

Add backend APIs for OTP, document, and face verification

Store voting data securely

Improve accessibility and mobile responsiveness

