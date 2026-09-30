import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const PromoBanners = () => {
  return (
    <section className="section" style={{ padding: "16px 0" }}>
      <div className="container">
        <div className="promo-banners-grid">
          {/* Banner 1: Audio / Tech */}
          <div className="promo-card promo-card-1">
            <span className="promo-tag">Special Edition Sound</span>
            <h3 className="promo-title">Immersive Spatial Audio & Active Noise Cancelling</h3>
            <p className="promo-desc">
              Upgrade your everyday listening with flagship wireless headphones from Sony and Apple.
            </p>
            <div>
              <Link to="/products?category=electronics" className="btn btn-light btn-sm">
                <span>Shop Audio Range</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Banner 2: Luxury Fashion & Footwear */}
          <div className="promo-card promo-card-2">
            <span className="promo-tag">Contemporary Wardrobe</span>
            <h3 className="promo-title">Heavyweight Cottons & Italian Leather Jackets</h3>
            <p className="promo-desc">
              Timeless streetwear silhouettes crafted with luxury European craftsmanship.
            </p>
            <div>
              <Link to="/products?category=fashion" className="btn btn-light btn-sm">
                <span>Explore Fashion</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
