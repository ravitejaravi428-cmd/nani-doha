import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, quickDemoLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/account");
    }
  };

  const handleDemoLogin = () => {
    quickDemoLogin();
    navigate("/account");
  };

  return (
    <div className="page-wrapper container" style={{ paddingTop: "60px", paddingBottom: "80px" }}>
      <div
        style={{
          maxWidth: "440px",
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
            Welcome to NANI DOHA
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Sign in to access your orders, wishlist, and VIP perks.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div style={{ marginBottom: "24px" }}>
          <button
            type="button"
            className="btn btn-block"
            style={{
              background: "var(--primary-light)",
              color: "var(--primary)",
              border: "1.5px dashed var(--primary)",
              fontWeight: 700
            }}
            onClick={handleDemoLogin}
          >
            <Sparkles size={16} />
            <span>⚡ One-Click Instant Demo Login</span>
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 600 }}>
            or sign in with email
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-light)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="e.g. nani@nanidoha.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "16px" }}>
            <span>Sign In to Account</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
