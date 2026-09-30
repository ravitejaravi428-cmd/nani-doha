import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  List,
  RotateCcw
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { CATEGORIES, BRANDS } from "../data/categories";
import { ProductCard } from "../components/common/ProductCard";

export const ProductListingPage = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL parameters
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const dealsParam = searchParams.get("deals") === "true";
  const sortParam = searchParams.get("sort") || "popularity";

  // Local filter states initialized directly from URL
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [sortBy, setSortBy] = useState(sortParam);
  const [onlyDeals, setOnlyDeals] = useState(dealsParam);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [visibleCount, setVisibleCount] = useState(12);

  // Brand toggle helper
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setVisibleCount(12);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setMinDiscount(0);
    setOnlyDeals(false);
    setOnlyInStock(false);
    setSortBy("popularity");
    setSearchParams({});
    setVisibleCount(12);
  };

  // Filter & Sort calculation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query
      if (searchParam.trim()) {
        const q = searchParam.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesSubcategory = product.subcategory?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSubcategory) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price filter
      if (minPrice && product.price < Number(minPrice)) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;

      // Rating filter
      if (minRating > 0 && product.rating < minRating) return false;

      // Discount filter
      if (minDiscount > 0 && (!product.discount || product.discount < minDiscount)) return false;

      // Only Flash Deals
      if (onlyDeals && !product.isFlashDeal) return false;

      // Stock
      if (onlyInStock && product.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      // default popularity
      return b.reviewCount - a.reviewCount;
    });
  }, [
    searchParam,
    selectedCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    onlyDeals,
    onlyInStock,
    sortBy,
    products
  ]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedBrands.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (onlyDeals ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  return (
    <div className="page-wrapper" id="product-listing-page" style={{ paddingTop: "24px" }}>
      <div className="container">
        {/* Breadcrumb & Heading */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "8px", fontSize: "0.8125rem", color: "var(--text-light)", marginBottom: "8px" }}>
            <Link to="/" style={{ color: "var(--text-muted)" }}>Home</Link>
            <span>/</span>
            <span>Products</span>
            {selectedCategory !== "all" && (
              <>
                <span>/</span>
                <span style={{ textTransform: "capitalize", color: "var(--primary)", fontWeight: 600 }}>
                  {selectedCategory}
                </span>
              </>
            )}
            {searchParam && (
              <>
                <span>/</span>
                <span>Search: "{searchParam}"</span>
              </>
            )}
          </div>

          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary)" }}>
            {searchParam
              ? `Search Results for "${searchParam}"`
              : onlyDeals
              ? "Festive Offers & Promotions"
              : selectedCategory !== "all"
              ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`
              : "All Products"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", marginTop: "4px" }}>
            Showing {filteredProducts.length} authentic curated products
          </p>
        </div>

        {/* Active Filters Bar */}
        {activeFilterCount > 0 && (
          <div className="active-filters-bar">
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--secondary)" }}>
              Active Filters ({activeFilterCount}):
            </span>

            {selectedCategory !== "all" && (
              <span className="filter-tag">
                Category: {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory("all")}><X size={14} /></button>
              </span>
            )}

            {selectedBrands.map((b) => (
              <span key={b} className="filter-tag">
                Brand: {b}
                <button type="button" onClick={() => toggleBrand(b)}><X size={14} /></button>
              </span>
            ))}

            {(minPrice || maxPrice) && (
              <span className="filter-tag">
                Price: QAR {minPrice || 0} - {maxPrice || "Max"}
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {minRating > 0 && (
              <span className="filter-tag">
                Rating: {minRating}★ & above
                <button type="button" onClick={() => setMinRating(0)}><X size={14} /></button>
              </span>
            )}

            {minDiscount > 0 && (
              <span className="filter-tag">
                Discount: {minDiscount}%+
                <button type="button" onClick={() => setMinDiscount(0)}><X size={14} /></button>
              </span>
            )}

            {onlyDeals && (
              <span className="filter-tag">
                Festive Offers Only
                <button type="button" onClick={() => setOnlyDeals(false)}><X size={14} /></button>
              </span>
            )}

            <button
              type="button"
              className="clear-filters-btn"
              onClick={resetFilters}
              style={{ marginLeft: "8px" }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Listing Layout: Sidebar + Grid */}
        <div className="listing-layout">
          {/* Filters Sidebar */}
          <aside className="filter-sidebar" id="filter-sidebar">
            <div className="filter-header">
              <h3>
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </h3>
              {activeFilterCount > 0 && (
                <button type="button" className="clear-filters-btn" onClick={resetFilters}>
                  Reset All
                </button>
              )}
            </div>

            {/* Department / Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Department</h4>
              <ul className="filter-list">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <label className="filter-checkbox-label">
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="radio"
                          name="category-filter"
                          checked={selectedCategory === cat.id}
                          onChange={() => {
                            setSelectedCategory(cat.id);
                            setVisibleCount(12);
                          }}
                        />
                        {cat.name}
                      </span>
                      <span className="filter-count">({cat.itemCount || 36})</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range (QAR)</h4>
              <div className="price-slider-wrap">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    className="price-input-box"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="price-input-box"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Brand</h4>
              <ul className="filter-list" style={{ maxHeight: "200px", overflowY: "auto" }}>
                {BRANDS.map((brand) => (
                  <li key={brand}>
                    <label className="filter-checkbox-label">
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        {brand}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Rating Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Customer Rating</h4>
              <ul className="filter-list">
                {[
                  { rating: 4.8, label: "4.8★ & above" },
                  { rating: 4.5, label: "4.5★ & above" },
                  { rating: 4.0, label: "4.0★ & above" }
                ].map((item) => (
                  <li key={item.rating}>
                    <label className="filter-checkbox-label">
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="radio"
                          name="rating-filter"
                          checked={minRating === item.rating}
                          onChange={() => setMinRating(minRating === item.rating ? 0 : item.rating)}
                        />
                        {item.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discount Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Discount Deals</h4>
              <ul className="filter-list">
                {[
                  { discount: 10, label: "10% or more" },
                  { discount: 20, label: "20% or more" },
                  { discount: 30, label: "30% or more" }
                ].map((item) => (
                  <li key={item.discount}>
                    <label className="filter-checkbox-label">
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="radio"
                          name="discount-filter"
                          checked={minDiscount === item.discount}
                          onChange={() => setMinDiscount(minDiscount === item.discount ? 0 : item.discount)}
                        />
                        {item.label}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Toggle Checks */}
            <div className="filter-group">
              <ul className="filter-list">
                <li>
                  <label className="filter-checkbox-label">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={onlyDeals}
                        onChange={(e) => setOnlyDeals(e.target.checked)}
                      />
                      Flash Deals Only 🔥
                    </span>
                  </label>
                </li>
                <li>
                  <label className="filter-checkbox-label">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                      />
                      In Stock Only
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main>
            {/* Toolbar */}
            <div className="listing-toolbar">
              <div className="listing-results-count">
                Showing <strong>1 - {displayedProducts.length}</strong> of{" "}
                <strong>{filteredProducts.length}</strong> items
              </div>

              <div className="listing-actions-row">
                <div className="sort-select-wrap">
                  <span className="sort-label">Sort by:</span>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    id="sort-select"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                <div className="view-mode-btns">
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                    aria-label="Grid View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    title="List View"
                    aria-label="List View"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {displayedProducts.length > 0 ? (
              <>
                <div
                  className={viewMode === "grid" ? "product-grid-3" : "product-grid"}
                  style={
                    viewMode === "list"
                      ? { display: "flex", flexDirection: "column", gap: "16px" }
                      : {}
                  }
                >
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-lg"
                      onClick={() => setVisibleCount((prev) => prev + 9)}
                      id="load-more-btn"
                    >
                      Load More Products ({filteredProducts.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state-box">
                <div className="empty-icon-circle">
                  <Search size={36} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>No Products Found</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                  We couldn't find any products matching your specific filters. Try expanding your search or resetting applied options.
                </p>
                <button type="button" className="btn btn-primary" onClick={resetFilters}>
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
