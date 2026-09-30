import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../common/ProductCard";

export const FeaturedProducts = () => {
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState("all");

  const filterCategory = (cat) => {
    setActiveTab(cat);
  };

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return p.isFeatured;
    return p.isFeatured && p.category === activeTab;
  }).slice(0, 8);

  return (
    <section className="section section-alt" id="featured-products-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-subtitle">Handpicked Selection</span>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link to="/products" className="section-link">
            <span>Explore Full Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Featured" },
            { id: "electronics", label: "Electronics" },
            { id: "fashion", label: "Fashion & Apparel" },
            { id: "shoes", label: "Footwear" },
            { id: "home", label: "Home & Coffee" },
            { id: "accessories", label: "Accessories" }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`btn btn-sm ${activeTab === tab.id ? "btn-primary" : "btn-outline"}`}
              onClick={() => filterCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
