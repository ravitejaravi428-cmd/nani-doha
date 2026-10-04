import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Store, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useCreator, DEMO_CREATOR_CREDENTIALS } from "../../context/CreatorContext";
import { useToast } from "../../context/ToastContext";

export const CreatorLoginPage = () => {
  const navigate = useNavigate();
  const { loginCreator, quickDemoCreatorLogin, isCreatorAuthenticated } = useCreator();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isCreatorAuthenticated) {
      navigate("/creator", { replace: true });
    }
  }, [isCreatorAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast("Please enter your username and password", "error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = loginCreator(username, password);
      setIsLoading(false);
      if (success) {
        navigate("/creator");
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setUsername(DEMO_CREATOR_CREDENTIALS.username);
    setPassword(DEMO_CREATOR_CREDENTIALS.password);
    showToast("Demo credentials filled! Click 'Sign In' or use Instant Login.", "info");
  };

  const handleInstantDemoLogin = () => {
    quickDemoCreatorLogin();
    navigate("/creator");
  };

  return (
    <div style={{
      background: "#080c14",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px 20px",
      color: "#f8fafc"
    }}>
      {/* Return to Customer shopping */}
      <div style={{ width: "100%", maxWidth: "460px", marginBottom: "20px" }}>
        <Link
          to="/"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: "0.875rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            transition: "color 0.2s"
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Customer Shopping</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div style={{
        width: "100%",
        maxWidth: "460px",
        background: "#0f172a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "24px",
        padding: "36px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
      }}>
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "16px",
            boxShadow: "0 10px 20px -5px rgba(16, 185, 129, 0.5)"
          }}>
            <Store size={28} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 6px", color: "#ffffff" }}>
            Creator & Seller Login
          </h1>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#94a3b8" }}>
            Sign in to manage catalog, fulfillment, and payouts
          </p>
        </div>

        {/* Credentials Callout Card */}
        <div style={{
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          borderRadius: "12px",
          padding: "14px 16px",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "5px" }}>
              <ShieldCheck size={14} /> Demo Creator Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: "none",
                border: "none",
                color: "#6ee7b7",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0
              }}
            >
              Auto Fill
            </button>
          </div>
          <div style={{ fontSize: "0.8125rem", color: "#cbd5e1", lineHeight: 1.5 }}>
            <div><strong>Username:</strong> <code style={{ color: "#ffffff", background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: "4px" }}>creator@nanidoha.com</code></div>
            <div style={{ marginTop: "3px" }}><strong>Password:</strong> <code style={{ color: "#ffffff", background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: "4px" }}>creator123</code></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Username / Email Input */}
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
              Creator Username or Email
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type="text"
                required
                placeholder="creator@nanidoha.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  background: "#080c14",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  padding: "12px 14px 12px 42px",
                  color: "#ffffff",
                  fontSize: "0.9375rem"
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1" }}>
                Password
              </label>
            </div>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  background: "#080c14",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  padding: "12px 42px 12px 42px",
                  color: "#ffffff",
                  fontSize: "0.9375rem"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              border: "none",
              padding: "13px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.9375rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
              transition: "transform 0.1s"
            }}
          >
            <span>{isLoading ? "Verifying..." : "Sign In to Creator Studio"}</span>
            <ArrowRight size={16} />
          </button>

          {/* Quick 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleInstantDemoLogin}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              color: "#a5b4fc",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              padding: "11px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
          >
            <Sparkles size={15} />
            <span>⚡ Instant Demo Creator Login</span>
          </button>
        </form>

        {/* Footer Link to Register */}
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center", fontSize: "0.8125rem", color: "#94a3b8" }}>
          New artisan or seller?{" "}
          <Link to="/creator/register" style={{ color: "#34d399", fontWeight: 700, textDecoration: "none" }}>
            Apply to Sell on Nani Doha →
          </Link>
        </div>
      </div>
    </div>
  );
};
