import React from "react";
import { Star, StarHalf } from "lucide-react";

export const RatingStars = ({ rating = 5, size = 15, showNumber = true, reviewCount = null }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="card-rating-row" style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
      <div className="rating-stars" style={{ display: "inline-flex", alignItems: "center", gap: "2px", color: "#f59e0b" }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="#f59e0b" stroke="#f59e0b" />
        ))}
        {hasHalfStar && <StarHalf size={size} fill="#f59e0b" stroke="#f59e0b" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} stroke="#cbd5e1" fill="none" />
        ))}
      </div>
      {showNumber && (
        <span style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--secondary)", marginLeft: "2px" }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
