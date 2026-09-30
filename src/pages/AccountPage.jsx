import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShieldCheck,
  Trash2,
  Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export const AccountPage = () => {
  const { user, isAuthenticated, logout, updateProfile, savedAddresses, addAddress, removeAddress, setDefaultAddress, quickDemoLogin } = useAuth();
  const { orders } = useOrders();
  const { wishlistCount } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "addresses" | "security"

  // Edit Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "Nani Doha",
    email: user?.email || "nani@nanidoha.com",
    phone: user?.phone || "+974 5512 3456"
  });

  // Add Address Modal / Form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    area: "",
    city: "Doha",
    country: "Qatar",
    type: "Home"
  });

  if (!isAuthenticated) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "60px", textAlign: "center" }}>
        <div className="empty-state-box">
          <div className="empty-icon-circle">
            <User size={36} />
          </div>
          <h2>Sign In to Access Your Account</h2>
          <p style={{ color: "var(--text-muted)" }}>
            Sign in to view your orders, saved addresses, and VIP membership privileges.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <button type="button" className="btn btn-outline" onClick={quickDemoLogin}>
              Instant Demo Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city) {
      showToast("Please provide street address and city.", "error");
      return;
    }
    addAddress(newAddr);
    setShowAddressForm(false);
    setNewAddr({
      fullName: user?.name || "",
      phone: user?.phone || "",
      street: "",
      area: "",
      city: "Doha",
      country: "Qatar",
      type: "Home"
    });
  };

  return (
    <div className="page-wrapper" id="account-page" style={{ paddingTop: "32px" }}>
      <div className="container">
        {/* Profile Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
            borderRadius: "20px",
            padding: "32px",
            color: "#fff",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(255, 255, 255, 0.4)"
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fff" }}>{user.name}</h1>
                <span
                  style={{
                    background: "var(--accent-gradient)",
                    color: "#fff",
                    fontSize: "0.6875rem",
                    padding: "3px 10px",
                    borderRadius: "999px",
                    fontWeight: 700
                  }}
                >
                  {user.tier || "VIP Gold"}
                </span>
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "0.875rem", marginTop: "4px" }}>
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link to="/orders" className="btn btn-light btn-sm">
              <Package size={16} /> My Orders ({orders.length})
            </Link>
            <Link to="/wishlist" className="btn btn-light btn-sm">
              <Heart size={16} /> Wishlist ({wishlistCount})
            </Link>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.4)" }}
              onClick={logout}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Account Tabs & Content */}
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "32px", alignItems: "start" }}>
          {/* Navigation Sidebar */}
          <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid var(--border-light)", padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <button
              type="button"
              className={`drawer-nav-link ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={18} /> Personal Info
              </span>
            </button>

            <button
              type="button"
              className={`drawer-nav-link ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <MapPin size={18} /> Saved Addresses ({savedAddresses.length})
              </span>
            </button>

            <button
              type="button"
              className={`drawer-nav-link ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldCheck size={18} /> Security & Passwords
              </span>
            </button>
          </div>

          {/* Tab Content Box */}
          <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid var(--border-light)", padding: "32px" }}>
            {activeTab === "profile" && (
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "20px" }}>
                  Account Profile Information
                </h2>
                <form onSubmit={handleSaveProfile} style={{ maxWidth: "540px" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: "12px" }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Manage Delivery Addresses</h2>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAddressForm((prev) => !prev)}
                  >
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddNewAddress} style={{ background: "var(--bg-main)", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "14px" }}>Add New Address</h3>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Contact Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                          type="text"
                          className="form-input"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Street Address & Villa / Apartment</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Lusail Marina Tower 3, Apt 1402"
                        value={newAddr.street}
                        onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Address Tag</label>
                        <select
                          className="form-input"
                          value={newAddr.type}
                          onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value })}
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Villa">Villa</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save Address
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowAddressForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      style={{
                        padding: "16px",
                        border: "1.5px solid var(--border-light)",
                        borderRadius: "12px",
                        background: addr.isDefault ? "var(--primary-light)" : "#fff",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700 }}>{addr.fullName}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.6875rem", background: "var(--bg-input)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                            {addr.type || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span style={{ fontSize: "0.6875rem", background: "#dcfce7", color: "#15803d", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {addr.street}
                        <br />
                        {addr.city}, {addr.country}
                        <br />
                        Phone: {addr.phone}
                      </div>

                      <div style={{ display: "flex", gap: "12px", marginTop: "8px", borderTop: "1px solid var(--border-subtle)", paddingTop: "8px" }}>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            className="cart-action-link"
                            onClick={() => setDefaultAddress(addr.id)}
                            style={{ fontSize: "0.75rem" }}
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          type="button"
                          className="cart-action-link danger"
                          onClick={() => removeAddress(addr.id)}
                          style={{ fontSize: "0.75rem", marginLeft: "auto" }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div style={{ maxWidth: "500px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "16px" }}>
                  Account Password & Security
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "20px" }}>
                  Protect your NANI DOHA profile with a strong password.
                </p>

                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" placeholder="••••••••" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" placeholder="Minimum 8 characters" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" placeholder="Repeat new password" className="form-input" />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => showToast("Password updated successfully!", "success")}
                >
                  Update Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
