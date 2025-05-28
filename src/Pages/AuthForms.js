import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

const AuthForms = () => {
  const [formType, setFormType] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // 🛡️ Form Validation
  const validateForm = () => {
    const { username, email, password } = formData;

    if (formType === "register") {
      if (!username.trim()) return "❌ Username is required.";
      if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username))
        return "❌ Username must be 3-20 characters (letters, numbers, _, ., or -).";
    }

    if (!email) return "❌ Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "❌ Invalid email format.";

    if (!password) return "❌ Password is required.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password))
      return "❌ Password must contain:\n🔹 8+ characters\n🔹 1 uppercase letter\n🔹 1 lowercase letter\n🔹 1 number\n🔹 1 special character.";

    return null;
  };

  // 🔄 Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🚀 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setMessage({ text: validationError, type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const url = `http://localhost:5000/${formType}`;
      const payload =
        formType === "login"
          ? { email: formData.email, password: formData.password }
          : formData;

      await axios.post(url, payload);
      localStorage.setItem("userEmail", formData.email);

      // Navigate to OTP verification page
      navigate("/auth/otp-verification", {
        state: {
          email: formData.email,
          action: formType === "login" ? "login" : "registration",
        },
      });
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          "❌ An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {formType === "login" ? "🔑 Login" : "📝 Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username Field (For Registration) */}
          {formType === "register" && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. john_doe123"
                autoComplete="username"
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {formType === "register" && (
              <div className="password-requirements">
                Must contain: Uppercase, lowercase, number, special character
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading
              ? "⏳ Processing..."
              : formType === "login"
              ? "🔑 Login"
              : "📝 Sign Up"}
          </button>
        </form>

        {/* Display Messages */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        {/* Switch Form Type */}
        <div className="auth-switch">
          {formType === "login" ? (
            <>
              New user?{" "}
              <button
                onClick={() => setFormType("register")}
                className="switch-button"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setFormType("login")}
                className="switch-button"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForms;
