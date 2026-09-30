import React from "react";
import { TESTIMONIALS } from "../../data/products";
import { RatingStars } from "../common/RatingStars";
import { Quote, CheckCircle2 } from "lucide-react";

export const TestimonialsSection = () => {
  return (
    <section className="section section-alt" id="testimonials-section">
      <div className="container">
        <div className="section-header" style={{ justifyContent: "center", textAlign: "center" }}>
          <div className="section-title-wrap" style={{ alignItems: "center" }}>
            <span className="section-subtitle">Real Customer Feedback</span>
            <h2 className="section-title">What Our Shoppers Say</h2>
          </div>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <RatingStars rating={t.rating} showNumber={false} size={16} />
                <Quote size={20} color="var(--primary)" style={{ opacity: 0.4 }} />
              </div>

              <p className="testimonial-quote">"{t.comment}"</p>

              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} className="testimonial-avatar" loading="lazy" />
                <div>
                  <div className="author-name" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{t.name}</span>
                    <CheckCircle2 size={14} color="#15803d" />
                  </div>
                  <div className="author-role">{t.location} • {t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
