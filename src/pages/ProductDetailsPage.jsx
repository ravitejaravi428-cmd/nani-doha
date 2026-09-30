import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Share2,
  Clock,
  ArrowRight
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { RatingStars } from "../components/common/RatingStars";
import { ProductCard } from "../components/common/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

// Inner details component to isolate state cleanly per product
const ProductDetailsContent = ({ product }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : "Standard"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      author: "Fahad Al-Kuwari",
      rating: 5,
      date: "3 days ago",
      verified: true,
      comment: "Spectacular quality! Build feels ultra premium and shipment to Lusail was delivered within 24 hours."
    },
    {
      id: 2,
      author: "Jessica M.",
      rating: 5,
      date: "1 week ago",
      verified: true,
      comment: "Exceeded my expectations. Packaging was luxurious and product is 100% genuine with official serial registration."
    }
  ]);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");

  const images = product.images || ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"];
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate("/checkout");
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard!", "success");
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) {
      showToast("Please provide your name and review message.", "error");
      return;
    }
    const reviewObj = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: "Just now",
      verified: true,
      comment: newReviewText.trim()
    };
    setReviewsList((prev) => [reviewObj, ...prev]);
    setNewReviewAuthor("");
    setNewReviewText("");
    showToast("Review submitted successfully! Thank you for your feedback.", "success");
  };

  // Related products from same category or brand
  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);

  return (
    <div className="container">
      {/* Breadcrumbs */}
      <div className="product-breadcrumbs" style={{ marginBottom: "24px" }}>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Link>
        <span>/</span>
        <span style={{ color: "var(--secondary)", fontWeight: 600 }}>{product.name}</span>
      </div>

      {/* Product Details Hero Grid: Gallery & Info */}
      <div className="product-details-grid">
        {/* Gallery Sticky Column */}
        <div className="product-gallery">
          <div className="gallery-main-wrap">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="gallery-main-img"
              id="details-main-img"
            />
            {product.badge && (
              <div
                className="card-badge"
                style={{ top: "16px", left: "16px", fontSize: "0.75rem", padding: "6px 12px" }}
              >
                {product.badge}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`thumb-btn ${idx === activeImageIndex ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                  aria-label={`Thumbnail image ${idx + 1}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Purchasing & Info Column */}
        <div className="product-info-panel">
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="details-brand">{product.brand}</span>
              <button
                type="button"
                onClick={handleShare}
                className="cart-action-link"
                style={{ gap: "4px" }}
                title="Share product link"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
            <h1 className="details-title" id="details-product-title">{product.name}</h1>
          </div>

          <div className="details-rating-row">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={18} />
            <span style={{ color: "var(--border-light)" }}>|</span>
            <span style={{ fontSize: "0.875rem", color: product.stock > 0 ? "#15803d" : "var(--danger)", fontWeight: 700 }}>
              {product.stock > 0 ? `In Stock (${product.stock} units available)` : "Out of Stock"}
            </span>
          </div>

          {/* Price Box */}
          <div className="details-price-box">
            <span className="details-price-current">QAR {product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="details-price-original">QAR {product.originalPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="details-savings">
                Save QAR {product.originalPrice - product.price} ({product.discount}% OFF)
              </span>
            )}
          </div>

          <p className="details-description">{product.description}</p>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="swatch-group">
              <span className="swatch-label">
                Selected Color: <span>{selectedColor}</span>
              </span>
              <div className="color-swatches">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`color-swatch-btn ${selectedColor === c.name ? "active" : ""}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Swatches */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="swatch-group">
              <span className="swatch-label">
                Selected Size: <span>{selectedSize}</span>
              </span>
              <div className="size-swatches">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`size-swatch-btn ${selectedSize === s ? "active" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Add to Cart Controls */}
          <div className="purchase-controls">
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
                onClick={() => setQuantity((q) => Math.min(product.stock || 20, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="details-cta-group">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                id="details-add-to-cart-btn"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={handleBuyNow}
                id="details-buy-now-btn"
              >
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                className={`card-icon-action ${isLiked ? "active" : ""}`}
                style={{ width: "52px", height: "52px" }}
                onClick={() => toggleWishlist(product)}
                aria-label="Add to Wishlist"
                id="details-wishlist-btn"
              >
                <Heart size={22} fill={isLiked ? "#ef4444" : "none"} />
              </button>
            </div>
          </div>

          {/* Trust Guarantee List */}
          <div className="guarantee-list">
            <div className="guarantee-item">
              <Truck className="guarantee-icon" size={20} />
              <div>
                <div>Free Express Delivery</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Orders over QAR 100 arrive in 1-2 business days</div>
              </div>
            </div>
            <div className="guarantee-item">
              <RotateCcw className="guarantee-icon" size={20} />
              <div>
                <div>30-Day Hassle-Free Returns</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Complimentary pickup from your address</div>
              </div>
            </div>
            <div className="guarantee-item">
              <ShieldCheck className="guarantee-icon" size={20} />
              <div>
                <div>100% Genuine Certified</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Includes official manufacturer warranty</div>
              </div>
            </div>
            <div className="guarantee-item">
              <Clock className="guarantee-icon" size={20} />
              <div>
                <div>Same-Day Dispatch</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>When ordered before 2:00 PM Doha time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Info: Specs, Reviews, Shipping Details */}
      <div className="details-tabs">
        <div className="tabs-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveTab("specs")}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Customer Reviews ({reviewsList.length + (product.reviewCount || 0)})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
            onClick={() => setActiveTab("shipping")}
          >
            Delivery & Returns Policy
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "specs" && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "16px" }}>
                Product Specifications
              </h3>
              {product.specifications ? (
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Brand / Designer</td>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <td>Product Category</td>
                      <td>{product.category} ({product.subcategory || "Curated"})</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "var(--text-muted)" }}>
                  Standard luxury specifications apply for this item. Contact our concierge for detailed custom inquiries.
                </p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px" }}>
                {/* Reviews List */}
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "20px" }}>
                    Customer Feedback
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        style={{
                          padding: "16px",
                          borderRadius: "12px",
                          border: "1px solid var(--border-light)",
                          background: "#fff"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700 }}>{rev.author}</span>
                            {rev.verified && (
                              <span style={{ fontSize: "0.6875rem", background: "#dcfce7", color: "#15803d", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{rev.date}</span>
                        </div>
                        <RatingStars rating={rev.rating} showNumber={false} size={14} />
                        <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.5 }}>
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Review Form */}
                <div style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "14px" }}>
                  <h4 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "12px" }}>
                    Write a Review
                  </h4>
                  <form onSubmit={handleAddReview}>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Tariq Al-Dosari"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Rating</label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewReviewRating(s)}
                            style={{ padding: "4px" }}
                          >
                            <Star
                              size={22}
                              fill={s <= newReviewRating ? "#f59e0b" : "none"}
                              stroke={s <= newReviewRating ? "#f59e0b" : "#94a3b8"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Experience</label>
                      <textarea
                        rows={4}
                        className="form-input"
                        style={{ height: "auto", padding: "10px" }}
                        placeholder="Write your candid review..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                      Post Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "16px" }}>
                Delivery & Global Shipping Information
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-muted)", lineHeight: 1.7 }}>
                <p>
                  <strong>Doha & Greater Qatar:</strong> Orders placed before 2:00 PM are eligible for Next-Day priority delivery by dedicated NANI DOHA couriers. Orders exceeding QAR 100 qualify for free express shipping.
                </p>
                <p>
                  <strong>GCC & Middle East:</strong> 2 to 4 business days via DHL Express or FedEx International Priority with end-to-end temperature controlled tracking.
                </p>
                <p>
                  <strong>International / Worldwide:</strong> 3 to 6 business days. All duties and customs clearance are prepaid at checkout for seamless zero-delay delivery.
                </p>
                <p>
                  <strong>Return Policy:</strong> You may initiate a return or exchange within 30 days of receiving your parcel. Items must remain unused in their pristine original box with all certificates and security seals intact.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <div className="section-header">
            <div className="section-title-wrap">
              <span className="section-subtitle">You May Also Like</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <Link to={`/products?category=${product.category}`} className="section-link">
              <span>View More in {product.category}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (!product) {
    return (
      <div className="page-wrapper container" style={{ padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>Product Not Found</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
          The product you are looking for does not exist or has been discontinued.
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper" id="product-details-page" style={{ paddingTop: "24px" }}>
      <ProductDetailsContent key={product.id} product={product} />
    </div>
  );
};
