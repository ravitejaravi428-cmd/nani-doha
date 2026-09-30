import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "../../data/categories";

export const CategoriesSection = () => {
  // Exclude 'all' to show specific high-level visual categories
  const displayCategories = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <section className="section section-alt" id="categories-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-subtitle">Curated Departments</span>
            <h2 className="section-title">Explore by Category</h2>
          </div>
          <Link to="/products" className="section-link">
            <span>Browse All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="categories-grid">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="category-card"
              id={`cat-${cat.id}`}
            >
              <div className="category-img-box">
                <img src={cat.image} alt={cat.name} className="category-img" loading="lazy" />
              </div>
              <h3 className="category-name">{cat.name}</h3>
              <span className="category-count">{cat.itemCount}+ Products</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
