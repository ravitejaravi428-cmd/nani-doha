import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { RatingStars } from "./RatingStars";
import { QuickViewModal } from "./QuickViewModal";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  if (!product) return null;

  const isLiked = isInWishlist(product.id);
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

  return (
    <>
      <div className="product-card" id={`product-${product.id}`}>
        {/* Top Badges */}
        {product.badge && (
          <div className={`card-badge ${product.badge.toLowerCase().includes("hot") ? "badge-hot" : "badge-sale"}`}>
            {product.badge}
          </div>
        )}

        {/* Floating Actions */}
        <div className="card-actions-floating">
          <button
            type="button"
            className={`card-icon-action ${isLiked ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isLiked ? "#ef4444" : "none"} />
          </button>

          <button
            type="button"
            className="card-icon-action"
            onClick={(e) => {
              e.preventDefault();
              setIsQuickViewOpen(true);
            }}
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>

        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="product-card-image-box">
          <img
            src={mainImage}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        </Link>

        {/* Product Details */}
        <div className="product-card-content">
          <div className="card-brand">{product.brand}</div>
          <Link to={`/product/${product.id}`}>
            <h3 className="card-title" title={product.name}>
              {product.name}
            </h3>
          </Link>

          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

          <div className="card-price-row">
            <span className="price-current">QAR {product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="price-original">QAR {product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="price-discount-pill">-{product.discount}%</span>
            )}
          </div>

          <button
            type="button"
            className="card-add-cart-btn"
            onClick={() => addToCart(product, 1)}
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};
