import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Store, 
  Save, 
  ExternalLink, 
  CheckCircle2, 
  Building2, 
  MapPin
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

export const CreatorProfilePage = () => {
  const { creator, updateCreatorProfile } = useCreator();

  const [form, setForm] = useState({
    storeName: creator.storeName || "",
    creatorName: creator.creatorName || "",
    tagline: creator.tagline || "",
    bio: creator.bio || "",
    category: creator.category || "Fashion & Handlooms",
    email: creator.email || "",
    phone: creator.phone || "",
    location: creator.location || "",
    instagram: creator.instagram || "",
    upiId: creator.upiId || "",
    bankName: creator.bankName || "",
    bankAccount: creator.bankAccount || "",
    avatar: creator.avatar || "",
    banner: creator.banner || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCreatorProfile(form);
  };

  return (
    <div style={{ background: "#0b0f19", minHeight: "calc(100vh - 120px)", color: "#f8fafc", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
              Store Profile & Brand Settings
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#94a3b8" }}>
              Customize your brand identity, contact information, and payout destination accounts
            </p>
          </div>

          <Link
            to="/creator-store"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>View Public Storefront</span>
            <ExternalLink size={14} />
          </Link>
        </div>

        {/* Store Preview Banner Card */}
        <div style={{
          background: "#131b2e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          overflow: "hidden",
          marginBottom: "32px"
        }}>
          <div style={{ height: "180px", position: "relative", overflow: "hidden" }}>
            <img
              src={form.banner || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"}
              alt="Store Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(19, 27, 46, 0.9) 0%, transparent 60%)" }} />
          </div>

          <div style={{ padding: "0 28px 24px", position: "relative", marginTop: "-48px", display: "flex", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
            <img
              src={form.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
              alt="Store Logo"
              style={{ width: "96px", height: "96px", borderRadius: "20px", objectFit: "cover", border: "4px solid #131b2e", background: "#0b0f19" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  {form.storeName || "My Artisan Store"}
                </h2>
                <span style={{ background: "#10b981", color: "#ffffff", fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <CheckCircle2 size={11} /> Verified Seller
                </span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#94a3b8", marginTop: "4px" }}>
                {form.tagline}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Section 1: Store Brand Info */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <Store size={18} color="#818cf8" /> Brand & Business Profile
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Store / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.storeName}
                  onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Creator / Owner Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.creatorName}
                  onChange={(e) => setForm({ ...form, creatorName: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                Store Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                Brand Story & Bio (Visible on Public Storefront)
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Store Logo URL
                </label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Store Banner URL
                </label>
                <input
                  type="url"
                  value={form.banner}
                  onChange={(e) => setForm({ ...form, banner: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Official Verification */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={18} color="#34d399" /> Contact & Location
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Official Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Phone / WhatsApp Support
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Operational Location
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payout Banking Information */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={18} color="#fbbf24" /> Payout Banking & Settlement Details
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Instant UPI VPA
                </label>
                <input
                  type="text"
                  value={form.upiId}
                  onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                  Bank Name & Account No
                </label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  style={{ width: "100%", background: "#0b0f19", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "8px", padding: "10px 14px", color: "#ffffff", fontSize: "0.875rem" }}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#ffffff",
                border: "none",
                padding: "12px 32px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9375rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
              }}
            >
              <Save size={18} />
              <span>Save Store Profile</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
