import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "../common/ProductCard";
import { CountdownTimer } from "../common/CountdownTimer";

export const FlashDealsSection = () => {
  const { products } = useProducts();
  const flashProducts = products.filter((p) => p.isFlashDeal).slice(0, 4);

  return (
    <section className="section" id="flash-deals-section">
      <div className="container">
        <div className="flash-deals-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "#fee2e2",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Flame size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--secondary)" }}>
                Flash Deals of the Day
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                Limited inventory at steep luxury promotional discounts. Grab before timer expires!
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <CountdownTimer targetHours={14} label="Ends In" />
            <Link to="/products?deals=true" className="btn btn-outline btn-sm">
              <span>View All Deals</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="product-grid">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
