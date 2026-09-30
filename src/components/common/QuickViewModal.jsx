import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const currentColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : "Standard");
  const currentSize = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);

  const images = product.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"];

  const handleAddToCart = () => {
    addToCart(product, quantity, currentColor, currentSize);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", padding: "32px" }}>
          {/* Gallery Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingTop: "100%",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#f8fafc",
                border: "1px solid var(--border-light)"
              }}
            >
              <img
                src={images[activeImageIndex] || images[0]}
                alt={product.name}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px" }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: idx === activeImageIndex ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                      padding: "2px",
                      background: "#fff"
                    }}
                  >
                    <img src={img} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Side */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <span className="card-brand">{product.brand}</span>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, marginTop: "4px", color: "var(--secondary)" }}>
                {product.name}
              </h2>
            </div>

            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--secondary)" }}>
                QAR {product.price}
              </span>
              {product.originalPrice && (
                <span className="price-original" style={{ fontSize: "1.1rem" }}>
                  QAR {product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="price-discount-pill">-{product.discount}%</span>
              )}
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="swatch-group">
                <span className="swatch-label">
                  Color: <span>{currentColor}</span>
                </span>
                <div className="color-swatches">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      className={`color-swatch-btn ${currentColor === c.name ? "active" : ""}`}
                      style={{ backgroundColor: c.hex }}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="swatch-group">
                <span className="swatch-label">
                  Size: <span>{currentSize}</span>
                </span>
                <div className="size-swatches">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`size-swatch-btn ${currentSize === s ? "active" : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stepper & Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
              <div className="quantity-stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="text"
                  readOnly
                  value={quantity}
                  className="stepper-input"
                  aria-label="Quantity"
                />
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                Add to Cart
              </button>

              <button
                type="button"
                className={`card-icon-action ${isInWishlist(product.id) ? "active" : ""}`}
                style={{ width: "48px", height: "48px" }}
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={isInWishlist(product.id) ? "#ef4444" : "none"} />
              </button>
            </div>

            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "14px", marginTop: "4px" }}>
              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--primary)"
                }}
              >
                View Full Product Details <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
