import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Bookmark,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck
} from "lucide-react";
import { useCart } from "../context/CartContext";

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    savedForLater,
    subtotal,
    catalogDiscount,
    couponDiscount,
    appliedCoupon,
    shippingFee,
    taxAmount,
    totalAmount,
    isFreeShipping,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoInput, setPromoInput] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    applyCoupon(promoInput);
    setPromoInput("");
  };

  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "60px" }}>
        <div className="empty-state-box">
          <div className="empty-icon-circle">
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Your Shopping Cart is Empty</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
            Looks like you haven't added anything to your cart yet. Explore our curated collections to discover luxury items you'll love.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg" id="cart-empty-shop-btn">
            <span>Start Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" id="cart-page" style={{ paddingTop: "32px" }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary)" }}>
            Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Review your selected products and proceed to secure checkout.
          </p>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="shipping-meter">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Truck size={16} color="var(--primary)" />
              {isFreeShipping ? (
                <strong style={{ color: "#15803d" }}>Congratulations! You have unlocked FREE Express Delivery!</strong>
              ) : (
                <span>
                  Add <strong>QAR {amountToFreeShipping.toFixed(2)}</strong> more to unlock <strong>FREE Express Delivery</strong>!
                </span>
              )}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{progressPercent}%</span>
          </div>
          <div className="meter-track">
            <div className="meter-progress" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Cart Main Layout: Items list + Summary Card */}
        <div className="cart-layout">
          {/* Items List */}
          <div>
            <div className="cart-items-card">
              {cart.map((item) => {
                const img = item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

                return (
                  <div key={item.id} className="cart-item-row" id={`cart-item-${item.id}`}>
                    <Link to={`/product/${item.product.id}`}>
                      <img src={img} alt={item.product.name} className="cart-item-img" />
                    </Link>

                    <div className="cart-item-info">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="cart-item-title">{item.product.name}</h3>
                      </Link>

                      <div className="cart-item-variant">
                        <span>Brand: {item.product.brand}</span>
                        {item.selectedColor && <span> • Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span> • Size: {item.selectedSize}</span>}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                        {/* Stepper */}
                        <div className="quantity-stepper" style={{ height: "36px" }}>
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="stepper-input" style={{ lineHeight: "36px" }}>
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            className="stepper-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-actions">
                          <button
                            type="button"
                            className="cart-action-link"
                            onClick={() => saveForLater(item.id)}
                            title="Save for later"
                          >
                            <Bookmark size={14} />
                            <span>Save for Later</span>
                          </button>

                          <button
                            type="button"
                            className="cart-action-link danger"
                            onClick={() => removeFromCart(item.id)}
                            title="Remove product"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="cart-item-total">
                      QAR {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
                <Link to="/products" className="btn btn-outline btn-sm">
                  <ArrowLeft size={16} />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div style={{ marginTop: "36px" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "16px", color: "var(--secondary)" }}>
                  Saved For Later ({savedForLater.length})
                </h3>
                <div className="cart-items-card">
                  {savedForLater.map((savedItem) => (
                    <div key={savedItem.id} className="cart-item-row">
                      <img
                        src={savedItem.product.images[0]}
                        alt={savedItem.product.name}
                        className="cart-item-img"
                      />
                      <div className="cart-item-info">
                        <Link to={`/product/${savedItem.product.id}`}>
                          <h4 className="cart-item-title">{savedItem.product.name}</h4>
                        </Link>
                        <div className="cart-item-variant">
                          <span>QAR {savedItem.product.price}</span>
                          {savedItem.selectedColor && <span> • {savedItem.selectedColor}</span>}
                        </div>
                        <div className="cart-item-actions" style={{ marginTop: "10px" }}>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => moveToCart(savedItem.id)}
                          >
                            Move to Cart
                          </button>
                          <button
                            type="button"
                            className="cart-action-link danger"
                            onClick={() => removeFromSaved(savedItem.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sticky Card */}
          <aside className="summary-card" id="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>QAR {subtotal.toFixed(2)}</span>
              </div>

              {catalogDiscount > 0 && (
                <div className="summary-row discount">
                  <span>Catalog Savings</span>
                  <span>-QAR {catalogDiscount.toFixed(2)}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="summary-row discount">
                  <span>Promo Discount ({appliedCoupon.code})</span>
                  <span>-QAR {couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: "#15803d" }}>FREE</strong> : `QAR ${shippingFee.toFixed(2)}`}</span>
              </div>

              <div className="summary-row">
                <span>Estimated VAT / Tax (5%)</span>
                <span>QAR {taxAmount.toFixed(2)}</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total Amount</span>
                <span>QAR {totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Box */}
            <div style={{ marginTop: "20px" }}>
              <label className="form-label" style={{ fontSize: "0.8125rem" }}>
                Have a Promo Code? (Try: <code>DOHA20</code> or <code>NANI10</code>)
              </label>
              {appliedCoupon ? (
                <div className="coupon-badge">
                  <span>{appliedCoupon.code} applied ({appliedCoupon.description})</span>
                  <button type="button" onClick={removeCoupon} style={{ color: "var(--danger)", fontWeight: 700 }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form className="coupon-box" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="coupon-input"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary btn-sm">
                    Apply
                  </button>
                </form>
              )}
            </div>

            <div style={{ marginTop: "24px" }}>
              <button
                type="button"
                className="btn btn-primary btn-block btn-lg"
                onClick={() => navigate("/checkout")}
                disabled={cart.length === 0}
                id="proceed-checkout-btn"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <ShieldCheck size={14} color="#15803d" />
              <span>Encrypted 256-Bit SSL Checkout Protection</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
