import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setIsSubscribed(true);
    showToast("Subscribed! Check your inbox for your 15% VIP welcome voucher.", "success");
    setEmail("");
  };

  return (
    <section className="section" id="newsletter-section">
      <div className="container">
        <div className="newsletter-card">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "16px" }}>
            <Sparkles size={14} color="#f59e0b" />
            <span>Exclusive VIP Club</span>
          </div>

          <h2 className="newsletter-title">Subscribe & Receive 15% Off Your Next Order</h2>
          <p className="newsletter-desc">
            Join over 40,000 members who enjoy private invitations to limited flash sales, new luxury drops, and members-only concierge events.
          </p>

          {isSubscribed ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(16, 185, 129, 0.2)", border: "1px solid #10b981", padding: "12px 24px", borderRadius: "999px", color: "#6ee7b7", fontWeight: 600 }}>
              <Check size={18} />
              <span>Thank you! Your VIP welcome gift has been emailed.</span>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email address..."
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-lg" style={{ flexShrink: 0 }}>
                <span>Join VIP Club</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
