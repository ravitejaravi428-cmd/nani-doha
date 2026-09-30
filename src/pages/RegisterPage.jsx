import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = register(name, email, password, phone);
    if (success) {
      navigate("/account");
    }
  };

  return (
    <div className="page-wrapper container" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
      <div
        style={{
          maxWidth: "460px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "20px",
          border: "1px solid var(--border-light)",
          padding: "40px",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "var(--accent-gradient)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}
          >
            <ShoppingBag size={28} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--secondary)" }}>
            Create Your Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Join NANI DOHA for personalized luxury shopping, orders, and rewards.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Tariq Mansoor"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              placeholder="tariq@example.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              placeholder="+974 5512 3456"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "16px" }}>
            <span>Register Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
