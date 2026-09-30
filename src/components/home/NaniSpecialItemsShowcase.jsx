import React, { useState } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Check,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Award,
  Flame,
  ArrowRight,
  Droplet,
  Feather,
  Gem,
  ExternalLink,
  MessageCircle,
  Eye,
  CheckCircle2,
  ChevronRight,
  Zap,
  Info
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../common/ProductCard";

export const NaniSpecialItemsShowcase = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeCategoryTab, setActiveCategoryTab] = useState("all");
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const handleQuickAdd = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.colors?.[0]?.name, product.sizes?.[0]);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleWhatsAppInquiry = (itemName) => {
    const text = encodeURIComponent(
      `Hello Nani Store! I am interested in inquiring about "${itemName}" and more available items. Please share the full catalog and pricing.`
    );
    window.open(`https://wa.me/97470284220?text=${text}`, "_blank");
  };

  // 9 Distinct Sections Data
  const sectionsData = [
    {
      num: 1,
      id: "sec-hair-oil",
      title: "Nani Organic Hair Oil (100% Original 🙏🏻)",
      telugu: "నాని ఆర్గానిక్ హెయిర్ ఆయిల్ - 100% అసలైనది",
      badge: "100% ORIGINAL GUARANTEE 🙏🏻",
      badgeColor: "#b45309",
      tagline: "Pure Ayurvedic Elixir Infused with 18 Hand-Picked Medicinal Herbs",
      bgClass: "bg-theme-hair-oil",
      heroImg: "/images/products/nani-organic-hair-oil.jpg",
      description:
        "Our flagship Nani Organic Hair Oil is prepared according to authentic ancestral Ayurvedic wisdom. Cold-infused with 18 miraculous herbs including Amla, Bhringraj, Rosemary, Fenugreek, and Hibiscus. Actively stimulates dormant follicles, stops hair fall within 14 days, clears stubborn dandruff, and gives thick, lustrous, healthy hair.",
      bullets: [
        "100% Original & Certified Organic — Zero Chemicals, Zero Mineral Oils",
        "Formulated with 18 Rare Ayurvedic Herbs & Pure Almond / Sesame Oil Base",
        "Clinical Results: Rapid Hair Growth, Root Thickening & Anti-Dandruff Action",
        "Suitable for All Hair Types — Loved by Over 15,000 Happy Families"
      ],
      products: products.filter((p) => p.id === "prod-hair-oil-1" || p.id === "prod-hair-oil-2")
    },
    {
      num: 2,
      id: "sec-black-oil",
      title: "Therapeutic Herbal Black Oil",
      telugu: "హెర్బల్ బ్లాక్ ఆయిల్ - సహజమైన నల్లటి మెరుపు కోసం",
      badge: "DEEP SCALP NOURISHMENT",
      badgeColor: "#1e293b",
      tagline: "Kalonji (Black Seed), Black Sesame & Bhringraj for Rich Mirror-Black Shine",
      bgClass: "bg-theme-black-oil",
      heroImg: "/images/products/nani-black-oil.jpg",
      description:
        "Nani Herbal Black Oil is a time-tested deep conditioning treatment crafted from raw cold-pressed Black Sesame, potent Kalonji (Nigella Sativa), and pure Bhringraj extracts. Helps maintain natural black pigmentation, prevents premature greying, restores scalp moisture, and provides an unmatched glossy sheen.",
      bullets: [
        "Prevents Premature Greying & Deepens Natural Hair Pigmentation",
        "Cold-pressed Black Sesame & Organic Kalonji (Black Seed) Extracts",
        "Intense Scalp Hydration — Eliminates Itchiness and Flakiness",
        "Ultra-Nourishing Formula for Long-Lasting Mirror-Like Shine"
      ],
      products: products.filter((p) => p.id === "prod-black-oil-1")
    },
    {
      num: 3,
      id: "sec-hair-shampoo",
      title: "Organic Herbal Hair Shampoo",
      telugu: "ఆర్గానిక్ హెయిర్ షాంపూ - సల్ఫేట్ రహితం",
      badge: "SULFATE & PARABEN FREE",
      badgeColor: "#047857",
      tagline: "Gentle Botanical Cleansing with Amla, Shikakai, Reetha & Curry Leaf",
      bgClass: "bg-theme-shampoo",
      heroImg: "/images/products/nani-hair-shampoo.jpg",
      description:
        "Say goodbye to harsh chemical detergents! Nani Organic Herbal Shampoo cleanses your scalp gently using nature's own saponins from Reetha, Shikakai, and Amla. It preserves your hair's natural oils, restores natural pH balance, and leaves strands remarkably silky, bouncy, and revitalized.",
      bullets: [
        "100% Free from Sulfates, Parabens, Silicones & Artificial Dyes",
        "Enriched with Pure Amla, Shikakai, Reetha & Fresh Curry Leaves",
        "Maintains Scalp pH & Delivers Salon-Grade Softness Without Stripping Moisture",
        "Perfect companion to Nani Organic Hair Oil & Black Oil"
      ],
      products: products.filter((p) => p.id === "prod-shampoo-1")
    },
    {
      num: 4,
      id: "sec-japanese-sarees",
      title: "Exclusive Japanese Sarees",
      telugu: "ప్రత్యేకమైన జపనీస్ చీరలు - అద్భుతమైన ఫాబ్రిక్",
      badge: "FEATHERLIGHT JAPANESE FABRIC",
      badgeColor: "#be185d",
      tagline: "Imported Japanese Silk Crepe & Georgette with Delicate Sakura Prints",
      bgClass: "bg-theme-japanese",
      heroImg: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      description:
        "World-renowned for their weightless feel and sublime fluid drape, our Japanese Crepe and Georgette Sarees are imported directly for supreme comfort. Wrinkle-resistant, non-transparent, and printed with ethereal Japanese sakura and botanical motifs, they are ideal for daytime elegance and festive evenings.",
      bullets: [
        "Ultralight Featherweight Weave (Only ~380g per Saree)",
        "Zero-Wrinkle Easy-Care Fabric — Drapes Like Liquid Silk",
        "Subtle Japanese Foil & Cherry Blossom Gold Border Detailing",
        "Breathable & Extremely Comfortable for All-Day Wear"
      ],
      products: products.filter((p) => p.id === "prod-japanese-saree-1" || p.id === "prod-japanese-saree-2")
    },
    {
      num: 5,
      id: "sec-fancy-sarees",
      title: "Designer Fancy Sarees",
      telugu: "ఫ్యాన్సీ చీరలు - పార్టీ వేర్ & పండగ డిజైన్స్",
      badge: "PARTYWEAR GLAMOUR",
      badgeColor: "#7e22ce",
      tagline: "Hand-Embroidered Micro-Sequins, Shimmer Organza & Scalloped Borders",
      bgClass: "bg-theme-fancy",
      heroImg: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      description:
        "Turn heads at every wedding, cocktail event, and festive celebration. Our Fancy Saree collection features cutting-edge contemporary designs adorned with glittering micro-sequins, rich cutwork hems, and metallic shimmer threads woven into royal pastel and jewel tones.",
      bullets: [
        "Intricate Hand-Embellished Sequin & Zardozi Scallop Hemlines",
        "High-Shine Metallic Shimmer Organza & Tissue Georgette Drapes",
        "Complimentary Heavy Designer Embroidered Blouse Piece Included",
        "Vibrant Color Palette: Rose Gold, Midnight Navy, Plum, and Wine"
      ],
      products: products.filter((p) => p.id === "prod-fancy-saree-1")
    },
    {
      num: 6,
      id: "sec-dresses",
      title: "Festive Dresses & Designer Gowns",
      telugu: "రాయల్ అనార్కలి & ఫెస్టివ్ డ్రెసెస్",
      badge: "ROYAL ETHNIC SILHOUETTES",
      badgeColor: "#0369a1",
      tagline: "Full-Flared Anarkalis, Kalidar Festive Gowns & Contemporary Maxis",
      bgClass: "bg-theme-dresses",
      heroImg: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80",
      description:
        "Experience grandeur and graceful movement with our Royal Festive Dress collection. Featuring floor-sweeping kalidar Anarkalis stitched from premium chanderi silk with rich zardozi necklines, alongside modern tiered floral maxi dresses for effortlessly glamorous occasions.",
      bullets: [
        "Grand 3-Piece Festive Ensemble: Flared Gown + Bottom + Designer Dupatta",
        "Breathable Pure Chanderi Silk & Viscose Lining for Maximum Comfort",
        "Intricate Hand-Embroidered Zardozi & Gota Patti Neckline Work",
        "Available in Sizes S to XXL with Tailored Fitting Support"
      ],
      products: products.filter((p) => p.id === "prod-dress-1" || p.id === "prod-dress-2")
    },
    {
      num: 7,
      id: "sec-gungora-emerald",
      title: "Traditional Gungora & Natural Emeralds",
      telugu: "గుంగోరా & పచ్చలు / ఎమరాల్డ్ రత్నాభరణాలు",
      badge: "TEMPLE CRAFT & VEDIC GEMSTONES",
      badgeColor: "#15803d",
      tagline: "Handcrafted Ghungroo Melodious Jewels & Certified Zambian Emeralds",
      bgClass: "bg-theme-emerald",
      heroImg: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      description:
        "A sacred blend of classical tradition and regal prestige. Discover our handcrafted antique Gungora (Ghungroo musical bell) anklets crafted for weddings and classical celebrations, alongside certified 100% natural deep-green Zambian Emerald (Panna) gemstone jewels set in 18K gold-plated sterling silver.",
      bullets: [
        "Authentic Antique Gungora (Ghungroo) Temple Payal Anklet Pair with Melodious Chime",
        "100% Natural Certified Zambian Emerald (Panna) Gemstones",
        "Government Lab Authenticity Certification Card Included",
        "Vedic Astrology Approved for Wisdom, Prosperity, and Royal Charm"
      ],
      products: products.filter((p) => p.id === "prod-gungora-1" || p.id === "prod-emerald-1")
    },
    {
      num: 8,
      id: "sec-silver-jewellery",
      title: "Pure 925 Silver Bracelets & Silver Wraps",
      telugu: "స్వచ్ఛమైన 925 సిల్వర్ బ్రాస్లెట్స్ & ర్యాప్స్",
      badge: "925 STERLING SILVER HALLMARKED",
      badgeColor: "#475569",
      tagline: "Handcrafted Tribal Kadas & Flexible Multi-Strand Spiral Wrist Wraps",
      bgClass: "bg-theme-silver",
      heroImg: "https://images.unsplash.com/photo-1611591475155-4264627d8227?auto=format&fit=crop&w=800&q=80",
      description:
        "Masterfully carved from solid 92.5% pure sterling silver. Our silver jewellery line includes heavyweight tribal floral Kadas with antique patina finishes, as well as ultra-modern flexible multi-strand spiral wrist wraps that coil comfortably around the wrist.",
      bullets: [
        "Guaranteed 92.5% Pure Sterling Silver with Official 925 Hallmark Stamp",
        "Protective Anti-Tarnish Rhodium Coating for Long-Lasting Mirror Lustre",
        "Hand-Carved Traditional & Modern Flexible Memory-Wire Wrist Wraps",
        "Hypoallergenic & Nickel-Free — Safe for Sensitive Skin"
      ],
      products: products.filter((p) => p.id === "prod-silver-bracelet-1" || p.id === "prod-silver-wrap-1")
    },
    {
      num: 9,
      id: "sec-gold-nose-rings",
      title: "Authentic Gold Nose Rings & Mukkupudakalu",
      telugu: "గోల్డ్ ముక్కుపుడకలు & నోస్ రింగ్స్ - 22K హాల్మార్క్",
      badge: "22K BIS HALLMARKED GOLD",
      badgeColor: "#d97706",
      tagline: "Traditional South Indian Mukkupudaka & 18K Sparkling Diamond Floral Pins",
      bgClass: "bg-theme-gold",
      heroImg: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      description:
        "Adorn your visage with timeless grace. Our authentic Gold Nose Ring collection features certified 22K (916 BIS Hallmarked) traditional South Indian Mukkupudakalu with vibrant ruby crystal centers, plus 18K diamond-studded floral blossom nose studs crafted for unmatched brilliance.",
      bullets: [
        "100% Certified 22K (916 BIS Hallmarked) Pure Yellow Gold",
        "Traditional South Indian Mukkupudaka Styling with Ruby Gemstones",
        "Ultra-Smooth Hypoallergenic Piercing Wire / Screw-Back Posts",
        "Dainty, Lightweight & Comfortable for Daily Wear or Festive Auspicious Occasions"
      ],
      products: products.filter((p) => p.id === "prod-gold-nose-1" || p.id === "prod-gold-nose-2")
    }
  ];

  return (
    <div className="nani-signature-container" id="nani-all-items-section">
      {/* Grand Top Banner for All Items */}
      <div className="container">
        <div className="nani-items-master-header">
          <div className="nani-master-badge">
            <Sparkles size={16} />
            <span>NANI EXCLUSIVE COLLECTION • 100% ORIGINAL & AUTHENTIC 🙏🏻</span>
            <Sparkles size={16} />
          </div>

          <h2 className="nani-master-title">
            Our Complete Range of Authentic Products
          </h2>
          <p className="nani-master-subtitle">
            From our celebrated <strong>Nani Organic Hair Oil (100% Original 🙏🏻)</strong> and Ayurvedic therapeutic elixirs, to Japanese silk sarees, designer partywear, traditional gungora emerald jewels, 925 silver wraps, and 22K gold nose rings. Explore each dedicated section below.
          </p>

          {/* Quick Jump Bar for the 9 Categories */}
          <div className="nani-quick-nav-bar">
            <span className="nani-quick-nav-title">Quick Jump to Section:</span>
            <div className="nani-nav-chips-wrap">
              {sectionsData.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="nani-nav-chip"
                >
                  <span className="nani-chip-num">{sec.num}</span>
                  <span>{sec.title.split("(")[0].trim()}</span>
                </a>
              ))}
              <a href="#sec-more-items" className="nani-nav-chip nani-chip-highlight">
                <Sparkles size={13} />
                <span>+ Many More Items</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Render the 9 Separate Sections One by One */}
      {sectionsData.map((sec, idx) => (
        <section
          key={sec.id}
          id={sec.id}
          className={`nani-individual-section ${sec.bgClass} ${
            idx % 2 === 0 ? "section-tint-a" : "section-tint-b"
          }`}
        >
          <div className="container">
            {/* Section Header Row */}
            <div className="nani-sec-header">
              <div className="nani-sec-num-badge">
                <span>ITEM #{sec.num}</span>
              </div>
              <div className="nani-sec-badge" style={{ backgroundColor: sec.badgeColor }}>
                <Sparkles size={14} />
                <span>{sec.badge}</span>
              </div>
              <div className="nani-sec-telugu">{sec.telugu}</div>
              <h2 className="nani-sec-title">{sec.title}</h2>
              <p className="nani-sec-tagline">{sec.tagline}</p>
            </div>

            {/* Spotlight Banner + Product Grid */}
            <div className="nani-sec-spotlight-card">
              <div className="nani-sec-spotlight-grid">
                {/* Left: Featured Showcase Image */}
                <div className="nani-spotlight-media">
                  <div
                    className="nani-spotlight-img-frame"
                    onClick={() => setSelectedImageModal(sec.heroImg)}
                    title="Click to view full image"
                  >
                    <img
                      src={sec.heroImg}
                      alt={sec.title}
                      className="nani-spotlight-img"
                      loading="lazy"
                    />
                    <div className="nani-img-hover-hint">
                      <Eye size={18} />
                      <span>Inspect Details</span>
                    </div>
                    <div className="nani-spotlight-guarantee-pill">
                      <CheckCircle2 size={14} color="#10b981" />
                      <span>100% Genuine Guaranteed</span>
                    </div>
                  </div>
                </div>

                {/* Right: Rich Story & Bullet Points */}
                <div className="nani-spotlight-content">
                  <h3 className="nani-spotlight-heading">
                    {sec.title}
                  </h3>
                  <p className="nani-spotlight-desc">{sec.description}</p>

                  <div className="nani-spotlight-bullets">
                    {sec.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="nani-bullet-row">
                        <Check size={16} className="nani-bullet-icon" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="nani-spotlight-cta-row">
                    <button
                      type="button"
                      className="btn btn-primary btn-md nani-inquire-btn"
                      onClick={() => handleWhatsAppInquiry(sec.title)}
                    >
                      <MessageCircle size={16} />
                      <span>Inquire / Order on WhatsApp</span>
                    </button>
                    <a
                      href={`/products?search=${encodeURIComponent(sec.title.split("(")[0].trim())}`}
                      className="btn btn-outline btn-md"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid For This Specific Section */}
            {sec.products && sec.products.length > 0 && (
              <div className="nani-sec-products-area">
                <div className="nani-sec-shelf-title-wrap">
                  <h4 className="nani-sec-shelf-title">
                    Available {sec.title.split("(")[0].trim()} Products
                  </h4>
                  <span className="nani-sec-shelf-count">
                    {sec.products.length} Items In Stock
                  </span>
                </div>

                <div className="product-grid">
                  {sec.products.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* 10. "And Many More Items Are Available..." Section */}
      <section className="nani-more-items-section" id="sec-more-items">
        <div className="container">
          <div className="nani-more-card">
            <div className="nani-more-badge">
              <Sparkles size={16} />
              <span>CUSTOM ORDERS & SPECIAL INQUIRIES</span>
            </div>

            <h2 className="nani-more-title">
              And Many More Items Are Available!
            </h2>
            <div className="nani-more-telugu">
              మరెన్నో ప్రత్యేక ఉత్పత్తులు మా స్టోర్‌లో అందుబాటులో ఉన్నాయి ……. 🙏🏻🙏🏻
            </div>

            <p className="nani-more-desc">
              Looking for bespoke saree tailoring, pure silk dhotis, matching jewellery sets, bridal trousseau collections, or specialized ayurvedic formulations? We provide direct custom sourcing, certified hallmark guarantees, and express doorstep delivery.
            </p>

            {/* More Items Quick Grid Tags */}
            <div className="nani-more-tags-grid">
              {[
                "Pure Silk Dhotis & Kanduvas",
                "Temple Jewellery Sets",
                "Bridal Chokers & Necklaces",
                "Gold Plated Mangalsutras",
                "Cotton & Handloom Sarees",
                "Bespoke Saree Fall & Pico",
                "Custom Blouse Tailoring",
                "Herbal Face Packs & Ubtan",
                "Pure Castor & Coconut Oils",
                "Silver Anklets & Rings",
                "Astrological Gemstone Rings",
                "Festive Gift Hampers"
              ].map((item, idx) => (
                <div key={idx} className="nani-more-tag-item">
                  <Check size={14} color="#f59e0b" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="nani-more-actions">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => handleWhatsAppInquiry("Full Product Catalog & Custom Orders")}
              >
                <MessageCircle size={20} />
                <span>Contact Nani on WhatsApp For Full Catalog</span>
              </button>

              <Link to="/products" className="btn btn-outline btn-lg" style={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.4)" }}>
                <span>Browse All Available Products</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Image Zoom Modal */}
      {selectedImageModal && (
        <div className="festive-modal-backdrop" onClick={() => setSelectedImageModal(null)}>
          <div className="festive-modal-container" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div className="festive-modal-topbar">
              <h4 className="festive-modal-heading">High Resolution Product Showcase</h4>
              <button
                type="button"
                className="festive-modal-close"
                onClick={() => setSelectedImageModal(null)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "24px", background: "#090d16", textAlign: "center" }}>
              <img
                src={selectedImageModal}
                alt="Product High Res"
                style={{ maxHeight: "70vh", maxWidth: "100%", borderRadius: "14px", objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
