import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { RatingStars } from "../components/common/RatingStars";

export const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "60px" }}>
        <div className="empty-state-box">
          <div className="empty-icon-circle" style={{ background: "#fee2e2", color: "#ef4444" }}>
            <Heart size={40} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Your Wishlist is Empty</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            You haven't saved any items to your wishlist yet. Tap the heart icon on any product to save your favorite picks for later.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" id="wishlist-empty-shop-btn">
            <span>Explore Products</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" id="wishlist-page" style={{ paddingTop: "32px" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary)" }}>
              My Wishlist ({wishlist.length} items)
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Items you have favorited are saved here for easy access.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={clearWishlist}
            style={{ color: "var(--danger)" }}
          >
            Clear Wishlist
          </button>
        </div>

        <div className="product-grid">
          {wishlist.map((product) => {
            const img = product.images && product.images.length > 0
              ? product.images[0]
              : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

            return (
              <div key={product.id} className="product-card">
                <button
                  type="button"
                  className="card-icon-action active"
                  style={{ position: "absolute", top: "12px", right: "12px", zIndex: 3 }}
                  onClick={() => removeFromWishlist(product.id)}
                  title="Remove from Wishlist"
                  aria-label="Remove from Wishlist"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/product/${product.id}`} className="product-card-image-box">
                  <img src={img} alt={product.name} className="product-card-img" />
                </Link>

                <div className="product-card-content">
                  <div className="card-brand">{product.brand}</div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="card-title">{product.name}</h3>
                  </Link>

                  <RatingStars rating={product.rating} reviewCount={product.reviewCount} />

                  <div className="card-price-row">
                    <span className="price-current">QAR {product.price}</span>
                    {product.originalPrice && (
                      <span className="price-original">QAR {product.originalPrice}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-block"
                    onClick={() => handleMoveToCart(product)}
                    style={{ marginTop: "auto" }}
                  >
                    <ShoppingBag size={16} />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
