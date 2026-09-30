import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="page-wrapper container" style={{ paddingTop: "80px", paddingBottom: "80px", textAlign: "center" }}>
      <div className="empty-state-box">
        <div className="empty-icon-circle">
          <Compass size={44} />
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--secondary)" }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Page Not Found</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "400px" }}>
          The page or product you were seeking has been moved, renamed, or is currently unavailable.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <span>Return to Homepage</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
