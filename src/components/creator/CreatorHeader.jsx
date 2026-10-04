import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  Store, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  User, 
  ExternalLink, 
  ArrowLeftRight, 
  CheckCircle2, 
  LogOut, 
  ChevronDown,
  Sparkles,
  BarChart3,
  Layers,
  HelpCircle
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";

export const CreatorHeader = () => {
  const navigate = useNavigate();
  const { creator, isCreatorAuthenticated, logoutCreator, quickDemoCreatorLogin } = useCreator();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header style={{
      background: "#0f172a",
      color: "#ffffff",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Top Notice Bar */}
      <div style={{
        background: "linear-gradient(90deg, #1e1b4b 0%, #311042 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "6px 20px",
        fontSize: "0.8125rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            background: "#4f46e5",
            color: "#ffffff",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase"
          }}>
            Creator Portal
          </span>
          <span style={{ color: "#cbd5e1" }}>
            You are managing: <strong style={{ color: "#f8fafc" }}>{creator.storeName}</strong>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#10b981", fontSize: "0.75rem", fontWeight: 600, marginLeft: "4px" }}>
            <CheckCircle2 size={13} /> Verified Seller
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            to="/creator-store"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
              fontSize: "0.75rem"
            }}
          >
            <span>Preview Public Storefront</span>
            <ExternalLink size={12} />
          </Link>
          <span style={{ opacity: 0.3 }}>|</span>
          <Link
            to="/"
            style={{
              color: "#fef08a",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 700,
              fontSize: "0.8125rem",
              background: "rgba(255, 255, 255, 0.08)",
              padding: "3px 10px",
              borderRadius: "20px",
              transition: "all 0.2s"
            }}
          >
            <ArrowLeftRight size={13} />
            <span>Switch to Customer View 🛍️</span>
          </Link>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Brand / Portal Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link to="/creator" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
            }}>
              <Store size={22} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" }}>
                  NANI <span style={{ color: "#a855f7" }}>CREATOR</span>
                </span>
                <span style={{
                  fontSize: "0.6875rem",
                  background: "rgba(168, 85, 247, 0.2)",
                  color: "#d8b4fe",
                  border: "1px solid rgba(168, 85, 247, 0.4)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontWeight: 700
                }}>
                  STUDIO
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Seller & Artisan Management Hub
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "16px" }}>
            <NavLink
              to="/creator"
              end
              style={({ isActive }) => ({
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive ? "rgba(99, 102, 241, 0.25)" : "transparent",
                border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                transition: "all 0.15s"
              })}
            >
              <BarChart3 size={16} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/creator/products"
              style={({ isActive }) => ({
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive ? "rgba(99, 102, 241, 0.25)" : "transparent",
                border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                transition: "all 0.15s"
              })}
            >
              <Layers size={16} />
              <span>Products & Catalog</span>
            </NavLink>

            <NavLink
              to="/creator/orders"
              style={({ isActive }) => ({
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive ? "rgba(99, 102, 241, 0.25)" : "transparent",
                border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                transition: "all 0.15s"
              })}
            >
              <ShoppingBag size={16} />
              <span>Orders Received</span>
            </NavLink>

            <NavLink
              to="/creator/earnings"
              style={({ isActive }) => ({
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive ? "rgba(99, 102, 241, 0.25)" : "transparent",
                border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                transition: "all 0.15s"
              })}
            >
              <DollarSign size={16} />
              <span>Earnings & Payouts</span>
            </NavLink>

            <NavLink
              to="/creator/profile"
              style={({ isActive }) => ({
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive ? "rgba(99, 102, 241, 0.25)" : "transparent",
                border: isActive ? "1px solid rgba(99, 102, 241, 0.4)" : "1px solid transparent",
                transition: "all 0.15s"
              })}
            >
              <Store size={16} />
              <span>Store Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* Right side controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Quick Add Product button */}
          <Link
            to="/creator/products?action=add"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 2px 8px rgba(79, 70, 229, 0.35)"
            }}
          >
            <span>+ Add Product</span>
          </Link>

          {/* Creator Profile Menu */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "6px 12px 6px 6px",
                borderRadius: "30px",
                color: "#ffffff",
                cursor: "pointer"
              }}
            >
              <img
                src={creator.avatar}
                alt={creator.storeName}
                style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
              />
              <div style={{ textAlign: "left", lineHeight: "1.2" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700 }}>{creator.creatorName}</div>
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Creator Mode</div>
              </div>
              <ChevronDown size={14} style={{ color: "#94a3b8" }} />
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "240px",
                  background: "#1e293b",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                  padding: "8px",
                  zIndex: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div style={{ padding: "8px 12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", marginBottom: "4px" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>{creator.storeName}</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{creator.email}</div>
                  <div style={{ marginTop: "4px", fontSize: "0.7rem", color: "#a5b4fc", fontWeight: 600 }}>
                    ★ {creator.rating} Rating ({creator.reviewCount} reviews)
                  </div>
                </div>

                <Link
                  to="/creator/profile"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "#cbd5e1",
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Store size={15} /> Store Settings
                </Link>

                <Link
                  to="/creator-store"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "#cbd5e1",
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <ExternalLink size={15} /> View Public Storefront
                </Link>

                <Link
                  to="/"
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "#fef08a",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <ArrowLeftRight size={15} /> Switch to Customer View
                </Link>

                <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "4px 0" }} />

                <button
                  type="button"
                  onClick={() => {
                    quickDemoCreatorLogin();
                    setIsDropdownOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "#93c5fd",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}
                >
                  <Sparkles size={15} /> Reset Demo Seller Data
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logoutCreator();
                    setIsDropdownOpen(false);
                    navigate("/creator/login");
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "#f87171",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "0.8125rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer"
                  }}
                >
                  <LogOut size={15} /> Sign Out of Creator Studio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
