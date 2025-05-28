import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import AuthForms from "./Pages/AuthForms";
import Contact from "./Pages/Contact";
import Home from "./Pages/Home";
import OTPVerification from "./Pages/OTPVerification";
import LocationCheck from "./Pages/LocationCheck";
import FaceVerification from "./Pages/FaceVerification";
import DocumentVerification from "./Pages/DocumentVerification";
import DistanceMeasure from "./Pages/DistanceMeasure";
import Instructions from "./Pages/Instructions";
import Ballot from "./Pages/Ballot";
import "./App.css";


function App() {
  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Authentication Routes */}
            <Route path="/auth">
              <Route
                path="login"
                element={<AuthForms key="login" isSignUp={false} />}
              />
              <Route
                path="signup"
                element={<AuthForms key="signup" isSignUp={true} />}
              />
              <Route path="otp-verification" element={<OTPVerification />} />
            </Route>

            {/* Verification Flow */}
            <Route path="/verification">
              <Route path="location" element={<LocationCheck />} />
              <Route path="face" element={<FaceVerification />} />
              <Route path="document" element={<DocumentVerification />} />
              <Route path="distance" element={<DistanceMeasure />} />
            </Route>

            {/* Main Features */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/ballot" element={<Ballot />} />

            {/* Redirects */}
            <Route
              path="/login"
              element={<Navigate to="/auth/login" replace />}
            />
            <Route
              path="/signup"
              element={<Navigate to="/auth/signup" replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
