import React, { useState } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Tag,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  ShoppingBag,
  Eye,
  Flame,
  ShieldCheck,
  Award,
  ArrowRight,
  Info
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../common/ProductCard";

export const FestiveSareeShowcase = () => {
  const { products } = useProducts();
  const { showToast } = useToast();

  // Active poster modal state
  const [modalPoster, setModalPoster] = useState(null); // null | 0 | 1
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const posters = [
    {
      id: "poster-10",
      title: "All Sarees 10% OFF",
      teluguTitle: "అన్ని చీరల పై 10% తగ్గింపు",
      subtitle: "Elegance in Every Drape • Limited Time Offer",
      tagline: "Special Festival Gift Blouse Piece Included with Every Saree",
      image: "/images/offers/saree-offer-10-percent.jpg",
      badgeText: "10% OFF LIMITED TIME",
      badgeColor: "#dc2626",
      couponCode: "SAREE10",
      discountPercent: 10,
      description:
        "Celebrate this festive season with exclusive 10% savings on our entire luxury saree collection. Featuring rich royal blue, lavender shimmer, mauve georgette, and crimson maroon silk drapes with handcrafted crystal scallop borders and free designer festival gift blouse pieces.",
      highlights: [
        "10% Instant Discount on All Saree orders",
        "Complimentary heavy-embroidered designer blouse piece (Festival Gift Tag)",
        "Premium scalloped borders with crystal stone & zari embroidery",
        "Curated festive color palettes: Royal Blue, Lavender, Mauve, Crimson"
      ],
      hotspots: [
        {
          id: "h1-1",
          x: 27,
          y: 26,
          title: "10% OFF Offer Seal",
          desc: "Limited-time festive discount applied instantly with code SAREE10."
        },
        {
          id: "h1-2",
          x: 90,
          y: 16,
          title: "Festival Gift Designer Blouse",
          desc: "Complimentary heavy zardozi embroidered blouse piece with each drape."
        },
        {
          id: "h1-3",
          x: 88,
          y: 40,
          title: "Black & Gold Embroidery Blouse",
          desc: "Intricate antique gold zardozi craftsmanship with authentic gift tag."
        },
        {
          id: "h1-4",
          x: 68,
          y: 84,
          title: "Handcrafted Scallop Borders",
          desc: "Exquisite crystal stone lace & paisley scalloped zari detailing."
        },
        {
          id: "h1-5",
          x: 26,
          y: 65,
          title: "Curated by Nani",
          desc: "Premium handpicked festive silhouettes for weddings & special occasions."
        }
      ]
    },
    {
      id: "poster-5",
      title: "నాని ఆంధ్ర చీరలు - 5% OFF Bumper Offer",
      teluguTitle: "అన్ని చీరల మీద బంపర్ ఆఫర్",
      subtitle: "నాణ్యతలో నెంబర్ 1... మీ సొగసుకు సరైన ఎంపిక!",
      tagline: "ఉత్తమ నాణ్యత • సాంప్రదాయం & అందం • పెళ్లి, పండగలకి బెస్ట్ ఛాయిస్",
      image: "/images/offers/nani-andhra-sarees-5-percent.jpg",
      badgeText: "5% OFF BUMPER OFFER",
      badgeColor: "#991b1b",
      couponCode: "NANI5",
      discountPercent: 5,
      description:
        "నాని ఆంధ్ర చీరలు (Nani Andhra Sarees) presents the Grand Bumper Offer: Flat 5% OFF on authentic Andhra Pradesh heritage sarees. Hand-selected across 9 vibrant festival colors, representing certified pure weaving tradition, unmatched quality, and regal elegance for weddings and celebrations.",
      highlights: [
        "Flat 5% OFF Bumper Offer with Coupon Code NANI5",
        "9 Festive Colors: Royal Purple, Wine Peacock, Tangerine Orange, Mint Green, Ivory, Rose Pink, Lime, Maroon, Peacock Blue",
        "ఉత్తమ నాణ్యత (Certified Best Quality Handloom Weaving)",
        "ఆంధ్ర సంప్రదాయానికి ప్రతీక (True Symbol of Andhra Heritage & Elegance)",
        "పెళ్లి, పండగలకి బెస్ట్ ఛాయిస్ (Ideal choice for weddings & celebrations)"
      ],
      hotspots: [
        {
          id: "h2-1",
          x: 66,
          y: 12,
          title: "5% OFF Festive Crest",
          desc: "Special bumper offer discount on all authentic Andhra sarees."
        },
        {
          id: "h2-2",
          x: 64,
          y: 47,
          title: "నాని ఆంధ్ర చీరలు Brand Seal",
          desc: "Direct from master weavers of Andhra Pradesh with quality assurance."
        },
        {
          id: "h2-3",
          x: 43,
          y: 63,
          title: "Royal Purple & Wine Peacock Silk",
          desc: "Handcrafted floral scalloped gold borders and heritage peacock motifs."
        },
        {
          id: "h2-4",
          x: 84,
          y: 63,
          title: "Tangerine Orange Festive Silk",
          desc: "Vibrant festive shade with silver and white floral embroidered border."
        },
        {
          id: "h2-5",
          x: 50,
          y: 89,
          title: "4 Pillars of Andhra Tradition",
          desc: "Best Quality • Tradition & Beauty • Wedding & Festival Choice • Andhra Heritage."
        }
      ]
    }
  ];

  const handleCopyCoupon = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, "success");

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      setCopiedCode("");
    }, 3000);
  };

  const openModal = (index) => {
    setModalPoster(index);
    setZoomLevel(1);
    setActiveHotspot(null);
  };

  const closeModal = () => {
    setModalPoster(null);
    setZoomLevel(1);
    setActiveHotspot(null);
  };

  const nextPoster = () => {
    setModalPoster((prev) => (prev === 0 ? 1 : 0));
    setZoomLevel(1);
    setActiveHotspot(null);
  };

  const prevPoster = () => {
    setModalPoster((prev) => (prev === 1 ? 0 : 1));
    setZoomLevel(1);
    setActiveHotspot(null);
  };

  // Sarees for the product shelf
  const sareeProducts = products.filter((p) => p.category === "sarees");
  const filteredSarees = sareeProducts.filter((p) => {
    if (activeFilter === "10") return p.discount === 10;
    if (activeFilter === "5") return p.discount === 5;
    return true;
  });

  return (
    <section className="festive-saree-section" id="saree-festive-offers">
      <div className="container">
        {/* Festive Header */}
        <div className="festive-section-header">
          <div className="festive-pill-badge">
            <Sparkles size={16} className="sparkle-anim" />
            <span>నాని ఆంధ్ర చీరలు • GRAND FESTIVE BUMPER OFFER</span>
            <Sparkles size={16} className="sparkle-anim" />
          </div>

          <h2 className="festive-heading">
            Exclusive Festive Saree Offers
          </h2>
          <p className="festive-subheading">
            Drape yourself in royal heritage. Explore our limited-time bumper offers on authentic handloom silks, crystal scalloped designer sarees, and bridal festive drapes.
          </p>

          <div className="festive-quick-stats">
            <div className="festive-stat-chip">
              <Flame size={16} color="#ef4444" />
              <span>Flat 10% OFF on All Sarees (Code: <strong>SAREE10</strong>)</span>
            </div>
            <div className="festive-stat-chip">
              <Award size={16} color="#f59e0b" />
              <span>5% Bumper Offer on నాని ఆంధ్ర చీరలు (Code: <strong>NANI5</strong>)</span>
            </div>
            <div className="festive-stat-chip">
              <ShieldCheck size={16} color="#10b981" />
              <span>Certified Handloom & Free Festive Gift Blouse Included</span>
            </div>
          </div>
        </div>

        {/* Highlight Control Bar */}
        <div className="festive-controls-bar">
          <div className="festive-controls-left">
            <span className="festive-controls-label">Interactive Mode:</span>
            <button
              type="button"
              className={`festive-toggle-btn ${showHotspots ? "active" : ""}`}
              onClick={() => setShowHotspots(!showHotspots)}
              id="toggle-saree-hotspots"
            >
              <Eye size={15} />
              <span>{showHotspots ? "Highlight Pins: ON" : "Highlight Pins: OFF"}</span>
            </button>
            <span className="festive-tip">
              <Info size={14} />
              Hover or click on the posters to zoom and inspect intricate zari details
            </span>
          </div>

          <div className="festive-controls-right">
            <span className="festive-coupon-label">Active Coupons:</span>
            <button
              type="button"
              className="festive-coupon-pill"
              onClick={(e) => handleCopyCoupon("SAREE10", e)}
              title="Click to copy 10% coupon"
            >
              <Tag size={13} />
              <span>SAREE10 (10% OFF)</span>
              {copiedCode === "SAREE10" ? <Check size={14} color="#10b981" /> : <Copy size={13} />}
            </button>
            <button
              type="button"
              className="festive-coupon-pill"
              onClick={(e) => handleCopyCoupon("NANI5", e)}
              title="Click to copy 5% coupon"
            >
              <Tag size={13} />
              <span>NANI5 (5% OFF)</span>
              {copiedCode === "NANI5" ? <Check size={14} color="#10b981" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        {/* The Two Highlighted Poster Cards */}
        <div className="festive-posters-grid">
          {posters.map((poster, idx) => (
            <div
              key={poster.id}
              className={`festive-poster-card ${idx === 0 ? "card-offer-10" : "card-offer-5"}`}
              id={`saree-poster-card-${idx}`}
            >
              {/* Highlight Aura Glow */}
              <div className="festive-poster-glow" />

              {/* Poster Image Container with Interactive Zoom Trigger */}
              <div className="festive-image-wrapper">
                <div
                  className="festive-image-container"
                  onClick={() => openModal(idx)}
                  title="Click to highlight & zoom in full resolution"
                >
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="festive-poster-img"
                    loading="eager"
                  />

                  {/* Shimmer Light Reflection Effect */}
                  <div className="festive-shimmer-sweep" />

                  {/* Corner Badge */}
                  <div
                    className="festive-poster-badge"
                    style={{ backgroundColor: poster.badgeColor }}
                  >
                    <Sparkles size={13} />
                    <span>{poster.badgeText}</span>
                  </div>

                  {/* Floating Zoom / Highlight Trigger Pill */}
                  <div className="festive-zoom-indicator">
                    <Maximize2 size={16} />
                    <span>Click to Zoom & Highlight</span>
                  </div>

                  {/* Interactive Hotspot Pins */}
                  {showHotspots &&
                    poster.hotspots.map((spot) => (
                      <div
                        key={spot.id}
                        className={`festive-hotspot-pin ${
                          activeHotspot === spot.id ? "is-active" : ""
                        }`}
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                        }}
                      >
                        <span className="festive-pin-dot" />
                        <span className="festive-pin-pulse" />

                        {/* Tooltip Card */}
                        <div className="festive-pin-tooltip">
                          <strong>{spot.title}</strong>
                          <p>{spot.desc}</p>
                          <div className="festive-pin-zoom-hint">Click image to inspect in HD</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Poster Info & Action Details */}
              <div className="festive-poster-info">
                <div className="festive-info-header">
                  <div className="festive-telugu-badge">{poster.teluguTitle}</div>
                  <h3 className="festive-poster-title">{poster.title}</h3>
                  <div className="festive-poster-subtitle">{poster.subtitle}</div>
                </div>

                <p className="festive-poster-desc">{poster.description}</p>

                {/* Key Highlight Bullets */}
                <div className="festive-highlights-list">
                  {poster.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="festive-highlight-item">
                      <Check size={15} className="festive-check-icon" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Strip */}
                <div className="festive-coupon-box">
                  <div className="festive-coupon-content">
                    <span className="festive-coupon-title">Use Promo Code:</span>
                    <span className="festive-coupon-code">{poster.couponCode}</span>
                    <span className="festive-coupon-save">Save {poster.discountPercent}% Instantly</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-gold"
                    onClick={(e) => handleCopyCoupon(poster.couponCode, e)}
                  >
                    {copiedCode === poster.couponCode ? (
                      <>
                        <Check size={14} color="#10b981" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="festive-action-row">
                  <button
                    type="button"
                    className="btn btn-primary festive-highlight-btn"
                    onClick={() => openModal(idx)}
                  >
                    <Eye size={16} />
                    <span>Highlight & Inspect Poster</span>
                  </button>
                  <Link
                    to={`/products?category=sarees`}
                    className="btn btn-secondary festive-shop-btn"
                  >
                    <ShoppingBag size={16} />
                    <span>Shop Sarees</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Matching Saree Products Shelf */}
        <div className="festive-products-shelf">
          <div className="section-header" style={{ marginBottom: "20px" }}>
            <div className="section-title-wrap">
              <span className="section-subtitle">Featured In Promotional Offers</span>
              <h3 className="section-title">Shop Highlighted Saree Styles</h3>
            </div>
            <div className="festive-filter-pills">
              <button
                type="button"
                className={`btn btn-sm ${activeFilter === "all" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveFilter("all")}
              >
                All Offers ({sareeProducts.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeFilter === "10" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveFilter("10")}
              >
                10% OFF Sarees (4)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeFilter === "5" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setActiveFilter("5")}
              >
                నాని ఆంధ్ర చీరలు 5% OFF (2)
              </button>
            </div>
          </div>

          <div className="product-grid">
            {filteredSarees.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link to="/products?category=sarees" className="btn btn-outline btn-lg">
              <span>View Complete Festive Saree Collection</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* High-Definition Interactive Lightbox / Highlight Modal */}
      {modalPoster !== null && (
        <div className="festive-modal-backdrop" onClick={closeModal}>
          <div
            className="festive-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Top Bar */}
            <div className="festive-modal-topbar">
              <div className="festive-modal-title-group">
                <span className="festive-modal-badge">
                  {posters[modalPoster].badgeText}
                </span>
                <h4 className="festive-modal-heading">{posters[modalPoster].title}</h4>
              </div>

              {/* Modal Zoom & Navigation Controls */}
              <div className="festive-modal-actions">
                <div className="festive-zoom-toolbar">
                  <button
                    type="button"
                    className="festive-tool-btn"
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.25))}
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="festive-zoom-percent">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    type="button"
                    className="festive-tool-btn"
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    type="button"
                    className="festive-tool-btn"
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                </div>

                <button
                  type="button"
                  className="festive-modal-close"
                  onClick={closeModal}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body: Image Viewport + Info Sidebar */}
            <div className="festive-modal-body">
              {/* Prev / Next Nav Buttons */}
              <button
                type="button"
                className="festive-nav-btn festive-nav-prev"
                onClick={prevPoster}
                title="Previous Poster"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                className="festive-nav-btn festive-nav-next"
                onClick={nextPoster}
                title="Next Poster"
              >
                <ChevronRight size={24} />
              </button>

              {/* Main Image Viewport with Pan & Zoom */}
              <div className="festive-modal-viewport">
                <div
                  className="festive-modal-img-wrap"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={posters[modalPoster].image}
                    alt={posters[modalPoster].title}
                    className="festive-modal-img"
                  />

                  {/* Hotspots in Modal */}
                  {showHotspots &&
                    posters[modalPoster].hotspots.map((spot) => (
                      <div
                        key={spot.id}
                        className={`festive-hotspot-pin ${
                          activeHotspot === spot.id ? "is-active" : ""
                        }`}
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                        }}
                      >
                        <span className="festive-pin-dot" />
                        <span className="festive-pin-pulse" />

                        <div className="festive-pin-tooltip">
                          <strong>{spot.title}</strong>
                          <p>{spot.desc}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Sidebar with Highlights & Actions */}
              <div className="festive-modal-sidebar">
                <div className="festive-sidebar-header">
                  <div className="festive-telugu-badge">
                    {posters[modalPoster].teluguTitle}
                  </div>
                  <h3>{posters[modalPoster].title}</h3>
                  <p className="festive-sidebar-tagline">{posters[modalPoster].tagline}</p>
                </div>

                <div className="festive-sidebar-coupon">
                  <div className="festive-coupon-label">Promotional Coupon:</div>
                  <div className="festive-sidebar-coupon-row">
                    <span className="festive-code-display">{posters[modalPoster].couponCode}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={(e) => handleCopyCoupon(posters[modalPoster].couponCode, e)}
                    >
                      {copiedCode === posters[modalPoster].couponCode ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                </div>

                <div className="festive-sidebar-section">
                  <h4>Key Poster Highlights</h4>
                  <ul className="festive-sidebar-list">
                    {posters[modalPoster].highlights.map((h, i) => (
                      <li key={i}>
                        <Check size={14} color="#10b981" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="festive-sidebar-section">
                  <h4>Interactive Hotspots ({posters[modalPoster].hotspots.length})</h4>
                  <div className="festive-hotspots-pills">
                    {posters[modalPoster].hotspots.map((spot) => (
                      <button
                        key={spot.id}
                        type="button"
                        className={`festive-hotspot-pill ${
                          activeHotspot === spot.id ? "active" : ""
                        }`}
                        onClick={() => setActiveHotspot(spot.id)}
                      >
                        <Sparkles size={12} />
                        <span>{spot.title}</span>
                      </button>
                    ))}
                  </div>
                  {activeHotspot && (
                    <div className="festive-active-hotspot-box">
                      <p>
                        {
                          posters[modalPoster].hotspots.find((h) => h.id === activeHotspot)
                            ?.desc
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="festive-sidebar-footer">
                  <Link
                    to="/products?category=sarees"
                    className="btn btn-primary btn-block"
                    onClick={closeModal}
                  >
                    <ShoppingBag size={18} />
                    <span>Shop Saree Collection</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
