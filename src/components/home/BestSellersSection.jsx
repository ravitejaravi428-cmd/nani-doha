import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../common/ProductCard";

export const BestSellersSection = () => {
  const { products } = useProducts();
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="section" id="best-sellers-section">
      <div className="container">
        <div className="section-header">
          <div className="section-title-wrap">
            <span className="section-subtitle" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Trophy size={14} color="var(--primary)" /> Top Ranked
            </span>
            <h2 className="section-title">Best Sellers</h2>
          </div>
          <Link to="/products?sort=popularity" className="section-link">
            <span>View All Bestsellers</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
