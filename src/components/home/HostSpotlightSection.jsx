import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Phone,
  PhoneCall,
  MessageCircle,
  Copy,
  Check,
  ShieldCheck,
  Star,
  ExternalLink,
  Award,
  Heart,
  Maximize2
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const InstagramIcon = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const HostSpotlightSection = () => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const hostPhone = "+97470284220";
  const hostPhoneDisplay = "+974 7028 4220";
  const instagramUrl =
    "https://www.instagram.com/nani_sarees_andhra?stkn=MTh4OXhrb2p4ZGwwbw==";
  const instagramHandle = "@nani_sarees_andhra";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(hostPhone);
    setCopied(true);
    showToast(`Host contact number ${hostPhoneDisplay} copied!`, "success");

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="host-spotlight-section" id="host-spotlight">
      <div className="container">
        {/* Section Heading */}
        <div className="host-section-header">
          <div className="host-pill-badge">
            <Sparkles size={16} />
            <span>MEET THE HOST & FOUNDER • నాని (NANI)</span>
            <Sparkles size={16} />
          </div>
          <h2 className="host-heading">The Man Behind Nani Collections</h2>
          <p className="host-subheading">
            Dedicated to 100% authentic quality, timeless Andhra heritage, pure organic hair care, and handcrafted jewellery.
          </p>
        </div>

        {/* Master Host Card */}
        <div className="host-master-card">
          {/* Top: Highlighted Host Photo Container */}
          <div className="host-image-showcase-wrap">
            <div
              className="host-image-frame"
              onClick={() => setShowImageModal(true)}
              title="Click to view full photo in HD"
            >
              <img
                src="/images/host/nani-host.jpg"
                alt="Nani - Host and Founder"
                className="host-portrait-img"
              />

              {/* Shimmer Light Reflection */}
              <div className="host-shimmer-sweep" />

              {/* Overlay Badge */}
              <div className="host-photo-badge">
                <Star size={14} fill="#fef08a" color="#fef08a" />
                <span>THE HOST • NANI</span>
              </div>

              {/* Artwork Tag */}
              <div className="host-motto-tag">
                <span>"DREAM BIGGER, STAY REAL"</span>
              </div>

              {/* Zoom Trigger Pill */}
              <div className="host-zoom-btn">
                <Maximize2 size={16} />
                <span>Click to Expand</span>
              </div>
            </div>
          </div>

          {/* DOWN of the Picture: All Host Information */}
          <div className="host-info-down">
            {/* Host Name & Identity */}
            <div className="host-title-block">
              <div className="host-telugu-name">శ్రీ నాని (NANI)</div>
              <h3 className="host-name">NANI — Host & Founder</h3>
              <p className="host-role">
                Curator of 100% Original Nani Organic Hair Oil, Authentic Andhra & Japanese Sarees, Dresses & Fine Jewellery
              </p>
              <div className="host-namaste-badge">
                <ShieldCheck size={16} color="#15803d" />
                <span>100% Original Products Guaranteed & Verified Personally ..... 🙏🏻🙏🏻</span>
              </div>
            </div>

            {/* Direct Contact & Social Links Grid */}
            <div className="host-contacts-grid">
              {/* 1. Phone & Call Card */}
              <div className="host-contact-card card-phone">
                <div className="host-card-icon-wrap phone-icon-wrap">
                  <PhoneCall size={26} />
                </div>
                <div className="host-card-details">
                  <span className="host-card-label">Direct Contact Number</span>
                  <a href={`tel:${hostPhone}`} className="host-card-value phone-number-link">
                    {hostPhoneDisplay}
                  </a>
                  <span className="host-card-sub">Available for Calls & Direct Queries</span>
                </div>
                <div className="host-card-actions">
                  <a
                    href={`tel:${hostPhone}`}
                    className="btn btn-sm btn-primary host-call-btn"
                  >
                    <Phone size={14} />
                    <span>Call Now</span>
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline host-copy-btn"
                    onClick={handleCopyPhone}
                    title="Copy phone number"
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* 2. WhatsApp Direct Card */}
              <div className="host-contact-card card-whatsapp">
                <div className="host-card-icon-wrap whatsapp-icon-wrap">
                  <MessageCircle size={26} />
                </div>
                <div className="host-card-details">
                  <span className="host-card-label">WhatsApp Direct Concierge</span>
                  <a
                    href={`https://wa.me/97470284220?text=${encodeURIComponent(
                      "Hello Nani! I am reaching out from your website to inquire about your 100% Original Hair Oil, Sarees, and Jewellery collection."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="host-card-value whatsapp-number-link"
                  >
                    {hostPhoneDisplay}
                  </a>
                  <span className="host-card-sub">Instant Replies & Custom Video Orders</span>
                </div>
                <div className="host-card-actions">
                  <a
                    href={`https://wa.me/97470284220?text=${encodeURIComponent(
                      "Hello Nani! I am reaching out from your website to inquire about your 100% Original Hair Oil, Sarees, and Jewellery collection."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-whatsapp"
                  >
                    <MessageCircle size={15} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* 3. Instagram Card */}
              <div className="host-contact-card card-instagram">
                <div className="host-card-icon-wrap instagram-icon-wrap">
                  <InstagramIcon size={26} />
                </div>
                <div className="host-card-details">
                  <span className="host-card-label">Official Instagram Handle</span>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="host-card-value instagram-handle-link"
                  >
                    {instagramHandle}
                  </a>
                  <span className="host-card-sub">Daily Live Saree Drapes, Customer Reviews & Catalog</span>
                </div>
                <div className="host-card-actions">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-instagram"
                  >
                    <InstagramIcon size={15} />
                    <span>Follow on Instagram</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Host Personal Message Strip */}
            <div className="host-message-strip">
              <div className="host-message-content">
                <p>
                  "Namaste and Welcome! Every single saree, bottle of <strong>100% Original Nani Organic Hair Oil</strong>, and piece of jewellery you see here is handpicked and certified by me. If you need assistance with custom draping, gemstone astrology, or express international delivery, please reach out to me directly on WhatsApp at <strong>{hostPhoneDisplay}</strong> or Instagram <strong>{instagramHandle}</strong>. Looking forward to serving you! 🙏🏻🙏🏻"
                </p>
                <div className="host-signature-row">
                  <span className="host-sign">— Nani, Host & Founder</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Host Photo */}
      {showImageModal && (
        <div className="festive-modal-backdrop" onClick={() => setShowImageModal(false)}>
          <div
            className="festive-modal-container"
            style={{ maxWidth: "600px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="festive-modal-topbar">
              <h4 className="festive-modal-heading">Nani — Host & Founder</h4>
              <button
                type="button"
                className="festive-modal-close"
                onClick={() => setShowImageModal(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "20px", background: "#090d16", textAlign: "center" }}>
              <img
                src="/images/host/nani-host.jpg"
                alt="Nani Host Full"
                style={{ maxHeight: "75vh", maxWidth: "100%", borderRadius: "14px", objectFit: "contain" }}
              />
              <div style={{ marginTop: "14px", color: "#fef08a", fontWeight: 700, fontSize: "1rem" }}>
                "DREAM BIGGER, STAY REAL"
              </div>
              <div style={{ color: "#cbd5e1", fontSize: "0.875rem", marginTop: "4px" }}>
                Contact: {hostPhoneDisplay} | Instagram: {instagramHandle}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
