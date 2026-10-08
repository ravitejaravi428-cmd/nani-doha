import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        {/* Footer Top Grid */}
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo" style={{ marginBottom: "16px" }}>
              <div className="brand-icon-box">
                <ShoppingBag size={22} />
              </div>
              <div className="brand-text">
                <span className="brand-name" style={{ color: "#fff" }}>
                  NANI <span>DOHA</span>
                </span>
                <span className="brand-sub" style={{ color: "#10b981", fontWeight: 700, letterSpacing: "0.05em" }}>
                  OFFICIAL WEB STORE
                </span>
              </div>
            </Link>
            <p>
              NANI DOHA Official Web Store is the verified premier destination for authentic Andhra Pradesh handloom silk sarees, bridal collections, pure organic herbal hair oil, and luxury lifestyle, delivering directly with white-glove concierge across Qatar and GCC.
            </p>
            <div className="social-links">
              <a
                href="https://www.instagram.com/nani_sarees_andhra?stkn=MTh4OXhrb2p4ZGwwbw=="
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Official Instagram @nani_sarees_andhra"
                title="Follow @nani_sarees_andhra on Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#facebook" className="social-icon-btn" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#twitter" className="social-icon-btn" aria-label="X Twitter">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#youtube" className="social-icon-btn" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
                  <polygon points="10 15 15 12 10 9 10 15"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="footer-column">
            <h4>Popular Categories</h4>
            <ul className="footer-nav">
              <li>
                <Link to="/products?category=electronics">Flagship Smartphones</Link>
              </li>
              <li>
                <Link to="/products?category=electronics">Noise Cancelling Audio</Link>
              </li>
              <li>
                <Link to="/products?category=fashion">Contemporary Fashion</Link>
              </li>
              <li>
                <Link to="/products?category=shoes">Performance Footwear</Link>
              </li>
              <li>
                <Link to="/products?category=home">Barista Espresso & Home</Link>
              </li>
              <li>
                <Link to="/products?category=beauty">Haute Parfumerie</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul className="footer-nav">
              <li>
                <Link to="/orders">Track Your Shipment</Link>
              </li>
              <li>
                <Link to="/cart">Cart & Saved Bag</Link>
              </li>
              <li>
                <Link to="/wishlist">Wishlist</Link>
              </li>
              <li>
                <Link to="/account">My Account Settings</Link>
              </li>
              <li>
                <a href="#returns" onClick={(e) => { e.preventDefault(); alert("NANI DOHA 30-day hassle-free return policy. Contact support for instant pick up."); }}>
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); alert("NANI DOHA Terms of Service: Genuine warranty on all tech & luxury items."); }}>
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); alert("NANI DOHA Privacy: Your payment and credentials are fully encrypted."); }}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link to="/creator/login" style={{ color: "#94a3b8" }}>
                  Seller & Creator Studio Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-column">
            <h4>Flagship Concierge</h4>
            <ul className="footer-nav" style={{ gap: "16px" }}>
              <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", color: "#cbd5e1" }}>
                <MapPin size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
                <span>Lusail Marina Tower 3, Zone 69, Doha, State of Qatar</span>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "center", color: "#cbd5e1" }}>
                <Phone size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
                <a href="tel:+97470284220" style={{ color: "#f8fafc", fontWeight: 700 }}>
                  +974 7028 4220 (Host Direct & WhatsApp)
                </a>
              </li>
              <li style={{ display: "flex", gap: "12px", alignItems: "center", color: "#cbd5e1" }}>
                <span style={{ fontSize: "16px" }}>📸</span>
                <a
                  href="https://www.instagram.com/nani_sarees_andhra?stkn=MTh4OXhrb2p4ZGwwbw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#fef08a", fontWeight: 700 }}
                >
                  @nani_sarees_andhra (Official Instagram)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © 2026 NANI DOHA Ecommerce LLC. All rights reserved. Registered in Qatar & Worldwide.
          </div>
          <div className="payment-badges">
            <span>Secure Checkout:</span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>Apple Pay</span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>Visa</span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>Mastercard</span>
            <span style={{ background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>UPI / COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
