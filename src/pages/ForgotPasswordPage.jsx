import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setIsSubmitted(true);
    showToast("Password reset link sent to your email!", "success");
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
              background: "var(--primary-light)",
              color: "var(--primary)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}
          >
            <KeyRound size={26} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--secondary)" }}>
            Forgot Password?
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "4px" }}>
            Enter your registered email address and we'll send you recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#dcfce7", color: "#15803d", padding: "16px", borderRadius: "12px", fontSize: "0.9375rem", lineHeight: 1.5, marginBottom: "24px" }}>
              <CheckCircle2 size={24} style={{ margin: "0 auto 8px" }} />
              <strong>Reset link sent!</strong> Check your inbox at <em>{email}</em> to reset your credentials.
            </div>
            <Link to="/login" className="btn btn-primary btn-block">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="nani@example.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "16px" }}>
              Send Reset Instructions
            </button>

            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", color: "var(--primary)", fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
