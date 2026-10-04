import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Store, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Heart, 
  ShoppingBag, 
  ArrowLeft,
  Sparkles,
  Search,
  Filter
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";
import { useProducts } from "../../context/ProductContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import { ProductCard } from "../../components/common/ProductCard";

export const CreatorPublicStorePage = () => {
  const { creator } = useCreator();
  const { products } = useProducts();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);

  // Filter products for this creator
  const creatorProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab = activeTab === "all" || p.category === activeTab;
      return matchSearch && matchTab;
    });
  }, [products, searchQuery, activeTab]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    showToast(isFollowing ? `Unfollowed ${creator.storeName}` : `Following ${creator.storeName}! You will receive new drop notifications.`, "success");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: creator.storeName,
        text: creator.tagline,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Storefront link copied to clipboard!", "success");
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "calc(100vh - 120px)", paddingBottom: "80px" }}>
      
      {/* Top Breadcrumb Bar */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 20px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#4f46e5", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to All Marketplace Products
          </Link>
          <div style={{ fontSize: "0.8125rem", color: "#64748b" }}>
            Customer View of Verified Creator Storefront
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div style={{ maxWidth: "1320px", margin: "24px auto 0", padding: "0 20px" }}>
        <div style={{
          background: "#ffffff",
          borderRadius: "24px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)"
        }}>
          {/* Cover image */}
          <div style={{ height: "240px", position: "relative", overflow: "hidden" }}>
            <img
              src={creator.banner || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"}
              alt="Store Cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
          </div>

          {/* Profile Header Details */}
          <div style={{ padding: "0 32px 32px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px", marginTop: "-60px", marginBottom: "20px" }}>
              
              {/* Avatar & Brand Title */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
                <img
                  src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                  alt={creator.storeName}
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "24px",
                    objectFit: "cover",
                    border: "5px solid #ffffff",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    background: "#ffffff"
                  }}
                />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
                      {creator.storeName}
                    </h1>
                    <span style={{
                      background: "#10b981",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: "20px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <CheckCircle2 size={13} /> Verified Artisan Seller
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9375rem" }}>
                    {creator.tagline}
                  </p>
                </div>
              </div>

              {/* Action buttons (Follow, Share, Creator Login) */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={handleShare}
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Share2 size={16} />
                  <span>Share Store</span>
                </button>

                <button
                  type="button"
                  onClick={handleFollowToggle}
                  style={{
                    background: isFollowing ? "#f1f5f9" : "#4f46e5",
                    border: `1px solid ${isFollowing ? "#cbd5e1" : "#4f46e5"}`,
                    color: isFollowing ? "#0f172a" : "#ffffff",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Heart size={16} fill={isFollowing ? "#ef4444" : "none"} color={isFollowing ? "#ef4444" : "#ffffff"} />
                  <span>{isFollowing ? "Following" : "Follow Store"}</span>
                </button>
              </div>

            </div>

            {/* Store Meta Row */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
              padding: "16px 0",
              borderTop: "1px solid #f1f5f9",
              borderBottom: "1px solid #f1f5f9",
              fontSize: "0.875rem",
              color: "#64748b"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#d97706", fontWeight: 700 }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{creator.rating} Rating ({creator.reviewCount} Reviews)</span>
              </div>
              <div>•</div>
              <div>{creator.followersCount + (isFollowing ? 1 : 0)} Followers</div>
              <div>•</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} />
                <span>{creator.location}</span>
              </div>
              <div>•</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={16} />
                <span>{creator.phone}</span>
              </div>
            </div>

            {/* Bio */}
            {creator.bio && (
              <p style={{ margin: "16px 0 0", color: "#334155", fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: "900px" }}>
                {creator.bio}
              </p>
            )}

          </div>
        </div>
      </div>

      {/* Catalog Section */}
      <div style={{ maxWidth: "1320px", margin: "32px auto 0", padding: "0 20px" }}>
        
        {/* Controls Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px"
        }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>
              All Products from {creator.storeName} ({creatorProducts.length})
            </h2>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            {/* Search within store */}
            <div style={{ position: "relative", width: "240px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search store items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "8px 12px 8px 34px",
                  fontSize: "0.875rem"
                }}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  style={{
                    background: activeTab === cat ? "#4f46e5" : "#ffffff",
                    color: activeTab === cat ? "#ffffff" : "#475569",
                    border: `1px solid ${activeTab === cat ? "#4f46e5" : "#e2e8f0"}`,
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {creatorProducts.length === 0 ? (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "60px 20px", textAlign: "center", border: "1px solid #e2e8f0" }}>
            <ShoppingBag size={48} style={{ margin: "0 auto 16px", color: "#94a3b8" }} />
            <h3 style={{ margin: "0 0 6px", color: "#0f172a" }}>No products found</h3>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>Try changing your category filter or search query.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "24px"
          }}>
            {creatorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
