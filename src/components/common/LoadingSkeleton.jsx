import React from "react";

export const ProductCardSkeleton = () => {
  return (
    <div className="product-card" style={{ pointerEvents: "none" }}>
      <div className="skeleton" style={{ width: "100%", paddingTop: "100%" }} />
      <div className="product-card-content">
        <div className="skeleton" style={{ width: "40%", height: "12px", marginBottom: "8px" }} />
        <div className="skeleton" style={{ width: "90%", height: "18px", marginBottom: "8px" }} />
        <div className="skeleton" style={{ width: "70%", height: "18px", marginBottom: "12px" }} />
        <div className="skeleton" style={{ width: "50%", height: "14px", marginBottom: "16px" }} />
        <div className="skeleton" style={{ width: "60%", height: "24px", marginBottom: "16px" }} />
        <div className="skeleton" style={{ width: "100%", height: "38px", borderRadius: "8px" }} />
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};
