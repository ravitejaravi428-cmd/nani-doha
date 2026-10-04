import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Store, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Package
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";
import { useToast } from "../../context/ToastContext";

export const CreatorRegisterPage = () => {
  const navigate = useNavigate();
  const { registerCreator, quickDemoCreatorLogin } = useCreator();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    storeName: "",
    creatorName: "",
    category: "Fashion & Handlooms",
    email: "",
    phone: "",
    upiId: "",
    bankName: "State Bank of India",
    bankAccount: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = registerCreator(formData);
    if (success) {
      navigate("/creator");
    }
  };

  const handleDemoLogin = () => {
    quickDemoCreatorLogin();
    navigate("/creator");
  };

  return (
    <div style={{ background: "#0b0f19", minHeight: "calc(100vh - 80px)", color: "#f8fafc", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: "24px" }}>
          <Link to="/" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ← Back to Customer Shopping
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px", alignItems: "start" }}>
          
          {/* Left Column: Value Proposition & Demo Access */}
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(99, 102, 241, 0.15)",
              color: "#a5b4fc",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              marginBottom: "16px",
              textTransform: "uppercase"
            }}>
              <Sparkles size={14} /> Join Nani Doha Seller Studio
            </div>

            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", color: "#ffffff" }}>
              Start Selling Handlooms & Creations on <span style={{ color: "#818cf8" }}>NANI DOHA</span>
            </h1>

            <p style={{ fontSize: "1rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "32px" }}>
              Connect with luxury shoppers across Qatar, UAE, and India. Sell authentic sarees, bridal collections, cold-pressed oils, and artisanal goods with seamless checkout and daily payouts.
            </p>

            {/* 3 Pillars */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "0.9375rem", color: "#ffffff" }}>Instant Daily Payouts</h4>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "#94a3b8" }}>Withdraw sales earnings directly to your UPI or Bank Account at only 5% platform fee.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(99, 102, 241, 0.15)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "0.9375rem", color: "#ffffff" }}>Zero Listing Fee</h4>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "#94a3b8" }}>Add unlimited product variants, high-res galleries, and color swatches without upfront costs.</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "0.9375rem", color: "#ffffff" }}>Dedicated Creator Storefront</h4>
                  <p style={{ margin: 0, fontSize: "0.8125rem", color: "#94a3b8" }}>Get a personalized brand link with your logo, banner, and verified artisan badge.</p>
                </div>
              </div>
            </div>

            {/* Instant Demo Login Button */}
            <div style={{
              background: "#131b2e",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px"
            }}>
              <div>
                <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9375rem" }}>
                  Auditing or Testing the Platform?
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                  Instant 1-Click Access as verified seller <em>Nani Andhra Collections</em>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>⚡ Instant Demo Creator Login</span>
              </button>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "32px",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
          }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 6px", color: "#ffffff" }}>
              Register Your Creator Store
            </h2>
            <p style={{ margin: "0 0 24px", fontSize: "0.8125rem", color: "#94a3b8" }}>
              Enter your brand details to open your seller studio
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Store / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Silk Handlooms"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Owner / Creator Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nani Doha"
                  value={formData.creatorName}
                  onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Primary Craft Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                >
                  <option value="Fashion & Handlooms">Fashion, Sarees & Handlooms</option>
                  <option value="Beauty & Organic Care">Beauty & Herbal Hair Care</option>
                  <option value="Jewellery & Accessories">Jewellery & Accessories</option>
                  <option value="Home Living & Decor">Home Living & Decor</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seller@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+974 5512 3456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Payout UPI ID (for instant earnings)
                </label>
                <input
                  type="text"
                  placeholder="yourname@oksbi"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)"
                }}
              >
                <span>Launch Creator Studio</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
