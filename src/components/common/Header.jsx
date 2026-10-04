import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  LogOut,
  Package
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { CATEGORIES } from "../../data/categories";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { products } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Close menus when location changes
  const prevPathRef = useRef(location.pathname);
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setIsMobileMenuOpen(false);
      setIsSearchOpen(false);
      setIsUserDropdownOpen(false);
    }
  }, [location.pathname]);

  // Derive search suggestions directly during render
  const trimmed = searchQuery.trim().toLowerCase();
  const suggestions = trimmed.length > 1
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.brand?.toLowerCase().includes(trimmed)
      ).slice(0, 5)
    : [];

  // Click outside to close search dropdown & user menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <header className="header-sticky" id="main-header">
      {/* Top Banner */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-notice">
            <span className="top-bar-badge" style={{ background: "#dc2626" }}>Festive Offer</span>
            <span>
              🥻 <strong>నాని ఆంధ్ర చీరలు Bumper Offer:</strong> 10% OFF with code <strong>SAREE10</strong> | 5% OFF with code <strong>NANI5</strong>
            </span>
          </div>

          <div className="top-bar-links">
            <Link to="/orders" className="top-bar-link">
              <Package size={14} />
              <span>Track Order</span>
            </Link>
            <a href="tel:+97470284220" className="top-bar-link">
              <PhoneCall size={14} />
              <span>+974 7028 4220</span>
            </a>
            <span style={{ opacity: 0.3 }}>|</span>
            <a
              href="https://www.instagram.com/nani_sarees_andhra?stkn=MTh4OXhrb2p4ZGwwbw=="
              target="_blank"
              rel="noopener noreferrer"
              className="top-bar-link"
              style={{ color: "#fef08a", fontWeight: 700 }}
              title="Official Instagram @nani_sarees_andhra"
            >
              <span>@nani_sarees_andhra</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="container header-main">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open mobile menu"
          id="mobile-menu-trigger"
        >
          <Menu size={24} />
        </button>

        {/* Brand Logo */}
        <Link to="/" className="brand-logo" id="header-logo">
          <div className="brand-icon-box">
            <ShoppingBag size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">
              NANI <span>DOHA</span>
            </span>
            <span className="brand-sub">Luxury & Lifestyle</span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div className="search-container" ref={searchContainerRef}>
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <Search size={18} className="search-icon-left" />
            <input
              type="text"
              id="header-search-input"
              className="search-input"
              placeholder="Search Nani organic hair oil, sarees, dresses, jewellery..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim().length > 1) {
                  setIsSearchOpen(true);
                }
              }}
              onFocus={() => searchQuery.trim().length > 1 && setIsSearchOpen(true)}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="search-submit-btn" id="header-search-submit">
              <span>Search</span>
            </button>
          </form>

          {/* Instant Dropdown Suggestions */}
          {isSearchOpen && trimmed.length > 1 && (
            <div className="search-dropdown">
              {suggestions.length > 0 ? (
                <div>
                  <div style={{ padding: "8px 16px", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase" }}>
                    Top Matching Products
                  </div>
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      className="search-suggestion-item"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="search-suggestion-img"
                      />
                      <div className="search-suggestion-info">
                        <div className="search-suggestion-title">{item.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          in {item.category} • {item.brand}
                        </div>
                      </div>
                      <div className="search-suggestion-price">QAR {item.price}</div>
                    </Link>
                  ))}
                  <div style={{ padding: "10px 16px", background: "var(--bg-main)", textAlign: "center" }}>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)" }}
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  No products matching "{searchQuery}". Press Enter to see full catalog search.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Action Buttons (Wishlist, Cart, Profile) */}
        <div className="header-actions">
          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="action-btn"
            title="Wishlist"
            id="nav-wishlist-btn"
            aria-label="View Wishlist"
          >
            <Heart size={22} />
            {wishlistCount > 0 && <span className="badge-pill">{wishlistCount}</span>}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="action-btn"
            title="Cart"
            id="nav-cart-btn"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && <span className="badge-pill">{itemCount}</span>}
          </Link>

          {/* User Account / Profile Dropdown */}
          <div style={{ position: "relative" }} ref={userDropdownRef}>
            {isAuthenticated ? (
              <button
                type="button"
                className="user-menu-trigger"
                onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                id="user-menu-btn"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar-sm"
                />
                <span className="user-name-label">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} style={{ color: "var(--text-light)" }} />
              </button>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm" id="nav-login-btn">
                <User size={16} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Profile Dropdown Popup */}
            {isUserDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: "240px",
                  background: "#fff",
                  borderRadius: "14px",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "12px",
                  zIndex: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border-subtle)", marginBottom: "4px" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--secondary)" }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {user?.email}
                  </div>
                  <div style={{ marginTop: "4px", display: "inline-block", background: "var(--accent-light)", color: "#b45309", fontSize: "0.6875rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px" }}>
                    {user?.tier || "Gold Member"}
                  </div>
                </div>

                <Link
                  to="/account"
                  className="drawer-nav-link"
                  style={{ padding: "8px 12px", fontSize: "0.875rem" }}
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <User size={16} /> My Account & Profile
                  </span>
                </Link>

                <Link
                  to="/orders"
                  className="drawer-nav-link"
                  style={{ padding: "8px 12px", fontSize: "0.875rem" }}
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Package size={16} /> My Orders & Tracking
                  </span>
                </Link>

                <Link
                  to="/wishlist"
                  className="drawer-nav-link"
                  style={{ padding: "8px 12px", fontSize: "0.875rem" }}
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Heart size={16} /> Saved Wishlist ({wishlistCount})
                  </span>
                </Link>

                <div style={{ height: "1px", background: "var(--border-subtle)", margin: "4px 0" }} />

                <button
                  type="button"
                  className="drawer-nav-link"
                  style={{ padding: "8px 12px", fontSize: "0.875rem", color: "var(--danger)", width: "100%", textAlign: "left", justifyContent: "flex-start", gap: "8px" }}
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navbar (Desktop) */}
      <nav className="header-navbar">
        <div className="container navbar-inner">
          <ul className="nav-links">
            <li className="nav-item">
              <NavLink to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products?category=all">
                All Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products?category=sarees" style={{ color: "#b91c1c", fontWeight: 700 }}>
                <span>🥻 Festive Sarees (చీరలు)</span>
                <span className="nav-deal-tag" style={{ background: "#dc2626" }}>10% OFF</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products?category=beauty">
                <span>🌿 Hair Care & Oils</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products?category=fashion">
                <span>👗 Designer Dresses</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/products?category=accessories">
                <span>✨ Gold & Silver Jewellery</span>
              </NavLink>
            </li>
          </ul>

          <div className="nav-contact-quick">
            <ShieldCheck size={16} color="var(--primary)" />
            <span>100% Genuine Luxury Guarantee</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`drawer-backdrop ${isMobileMenuOpen ? "active" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      <div className={`mobile-drawer ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="drawer-header">
          <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="brand-icon-box" style={{ width: "36px", height: "36px" }}>
              <ShoppingBag size={18} />
            </div>
            <span className="brand-name" style={{ fontSize: "1.2rem" }}>
              NANI <span>DOHA</span>
            </span>
          </Link>
          <button
            type="button"
            className="action-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Mobile Search input inside drawer */}
          <form onSubmit={handleSearchSubmit}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="search-input"
                style={{ paddingRight: "40px" }}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                style={{ position: "absolute", right: "12px", top: "14px", color: "var(--primary)" }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* User state in mobile */}
          {isAuthenticated ? (
            <div style={{ background: "var(--bg-main)", padding: "14px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
              <img src={user.avatar} alt={user.name} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9375rem" }}>{user.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{user.email}</div>
              </div>
              <button onClick={logout} title="Sign Out" style={{ color: "var(--danger)" }}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <Link
                to="/login"
                className="btn btn-primary btn-block btn-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <button
                type="button"
                className="btn btn-outline btn-block btn-sm"
                onClick={() => {
                  quickDemoLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Demo
              </button>
            </div>
          )}

          {/* Drawer Links */}
          <ul className="drawer-nav-list">
            <li>
              <NavLink to="/" className="drawer-nav-link" end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" className="drawer-nav-link">
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/products?category=sarees" className="drawer-nav-link" style={{ color: "#b91c1c", fontWeight: 700 }}>
                🥻 Festive Sarees (10% OFF)
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className="drawer-nav-link">
                Shopping Cart ({itemCount})
              </NavLink>
            </li>
            <li>
              <NavLink to="/wishlist" className="drawer-nav-link">
                My Wishlist ({wishlistCount})
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <NavLink to="/orders" className="drawer-nav-link">
                    Order History & Tracking
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/account" className="drawer-nav-link">
                    Account Settings
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Category Quick Chips */}
          <div>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", marginBottom: "10px" }}>
              Browse Categories
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {CATEGORIES.slice(1).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  style={{
                    fontSize: "0.8125rem",
                    padding: "6px 12px",
                    background: "var(--bg-input)",
                    borderRadius: "999px",
                    color: "var(--text-main)",
                    fontWeight: 600
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
