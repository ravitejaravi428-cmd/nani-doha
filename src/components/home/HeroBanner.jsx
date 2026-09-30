import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Star,
  CheckCircle2,
  Zap
} from "lucide-react";

export const HeroBanner = () => {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Main Banner */}
        <div className="hero-banner">
          <div className="hero-glow-circle" />

          {/* Left Content */}
          <div className="hero-content">
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <div className="hero-pill">
                <Sparkles size={14} color="#f59e0b" />
                <span>Nani Qatar Official Store</span>
              </div>
              <a href="#saree-festive-offers" className="hero-festive-pill">
                <Flame size={14} color="#dc2626" />
                <span>నాని ఆంధ్ర చీరలు • Up to 10% OFF</span>
              </a>
            </div>

            <h1 className="hero-heading">
              DREAM BIGGER, <br />
              <span style={{ color: "#10b981", textShadow: "0 0 25px rgba(16, 185, 129, 0.4)" }}>STAY REAL.</span>
            </h1>

            <p className="hero-description">
              Welcome to NANI Qatar: Discover <strong>100% Original Nani Organic Hair Oil 🙏🏻</strong>, authentic Andhra & Japanese festive sarees, royal designer dresses, and certified gold & 925 silver jewellery. Direct personal delivery across Doha.
            </p>

            <div className="hero-btn-group">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-now-btn">
                <span>Shop All Products</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="#saree-festive-offers"
                className="btn btn-outline btn-lg"
                style={{ borderColor: "#dc2626", color: "#b91c1c", fontWeight: 700 }}
              >
                <Sparkles size={18} color="#dc2626" />
                <span>Festive Saree Offers</span>
              </a>
              <a
                href="https://wa.me/97470284220?text=Hello%20Nani!%20I%20would%20like%20to%20inquire%20about%20your%20products"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-lg"
                id="hero-whatsapp-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <MessageCircle size={18} color="#16a34a" />
                <span>WhatsApp: +974 7028 4220</span>
              </a>
            </div>
          </div>

          {/* Right Showcase: Animated "దూకుడు DARING & DASHING" GIF-like Container */}
          <div className="hero-image-wrap">
            <div className="dookudu-gif-container">
              {/* Pulsing Emerald Neon Glow Background */}
              <div className="dookudu-neon-glow" />

              {/* Laser Scanline Beam Animation */}
              <div className="dookudu-laser-beam" />

              {/* Shimmer Light Reflection */}
              <div className="dookudu-shimmer-sweep" />

              {/* Main Dookudu Daring & Dashing Image */}
              <img
                src="/images/hero/dookudu-hero.jpg"
                alt="దూకుడు DARING & DASHING"
                className="dookudu-main-img"
              />

              {/* Floating Top Badge */}
              <div className="dookudu-badge-top">
                <Zap size={14} color="#fef08a" />
                <span>DARING & DASHING • DOOKUDU</span>
              </div>

              {/* Floating Verification Seal */}
              <div className="hero-floating-card dookudu-floating-badge">
                <div style={{ background: "#064e3b", color: "#34d399", padding: "10px", borderRadius: "12px", border: "1px solid #059669" }}>
                  <Star size={20} fill="#34d399" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#f8fafc" }}>Rated 5.0 in Qatar</div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>100% Original Nani Brand Seal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Features Bar */}
        <div className="trust-bar">
          <div className="trust-item">
            <div className="trust-icon-box">
              <Truck size={24} />
            </div>
            <div className="trust-info">
              <h4>Free Express Delivery</h4>
              <p>On all Doha orders above QAR 100</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <RotateCcw size={24} />
            </div>
            <div className="trust-info">
              <h4>Instant Customer Care</h4>
              <p>Direct WhatsApp with Host Nani</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div className="trust-info">
              <h4>100% Genuine Guarantee</h4>
              <p>Verified authentic original items</p>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <Sparkles size={24} />
            </div>
            <div className="trust-info">
              <h4>Direct from Andhra Weavers</h4>
              <p>Purity & royal craftsmanship</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
