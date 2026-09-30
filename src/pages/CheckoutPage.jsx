import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  Lock,
  Plus
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal, couponDiscount, shippingFee, taxAmount, totalAmount, clearCart } = useCart();
  const { user, savedAddresses, addAddress } = useAuth();
  const { createOrder } = useOrders();
  const { showToast } = useToast();

  // Active step
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review

  // Shipping Address Form State
  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || {
    fullName: user ? user.name : "Nani Doha",
    phone: user ? user.phone : "+974 5512 3456",
    street: "Villa 42, Street 810",
    area: "West Bay Lagoon",
    city: "Doha",
    country: "Qatar"
  };

  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr.id || "custom");
  const [addressForm, setAddressForm] = useState(defaultAddr);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "upi" | "cod"
  const [cardData, setCardData] = useState({
    cardNumber: "4242 •••• •••• 4242",
    holderName: "NANI DOHA",
    expiry: "12/28",
    cvv: "888"
  });
  const [upiId, setUpiId] = useState("nanidoha@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, redirect
  if (cart.length === 0) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "60px", textAlign: "center" }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: "var(--text-muted)", margin: "16px 0 24px" }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setAddressForm(addr);
    setIsAddingNewAddress(false);
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.street || !addressForm.city) {
      showToast("Please fill in the required address fields", "error");
      return;
    }
    const created = addAddress(addressForm);
    setSelectedAddressId(created.id);
    setIsAddingNewAddress(false);
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    let paymentLabel = "Credit Card (ending in 4242)";
    if (paymentMethod === "upi") paymentLabel = `UPI (${upiId})`;
    if (paymentMethod === "cod") paymentLabel = "Cash on Delivery";

    setTimeout(() => {
      const order = createOrder({
        items: cart,
        shippingAddress: addressForm,
        paymentMethod: paymentLabel,
        totals: {
          subtotal,
          couponDiscount,
          shippingFee,
          taxAmount,
          totalAmount
        }
      });

      clearCart();
      setIsProcessing(false);
      showToast("Order placed successfully!", "success");
      navigate(`/order-confirmation/${order.id}`);
    }, 1200);
  };

  return (
    <div className="page-wrapper" id="checkout-page" style={{ paddingTop: "32px" }}>
      <div className="container">
        {/* Step Indicator */}
        <div className="checkout-steps-bar">
          <div className={`checkout-step-pill ${currentStep >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span>Delivery Address</span>
          </div>
          <div className="checkout-step-line" />
          <div className={`checkout-step-pill ${currentStep >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span>Payment Method</span>
          </div>
          <div className="checkout-step-line" />
          <div className={`checkout-step-pill ${currentStep >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span>Order Review</span>
          </div>
        </div>

        <div className="cart-layout">
          {/* Main Checkout Interaction Area */}
          <div>
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="cart-items-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--secondary)" }}>
                    Select Delivery Address
                  </h2>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setSelectedAddressId("new");
                    }}
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                </div>

                {/* Saved Address Cards */}
                {!isAddingNewAddress && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr)}
                        style={{
                          border: selectedAddressId === addr.id ? "2px solid var(--primary)" : "1.5px solid var(--border-light)",
                          background: selectedAddressId === addr.id ? "var(--primary-light)" : "#fff",
                          padding: "16px",
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span style={{ fontWeight: 700 }}>{addr.fullName}</span>
                          <span style={{ fontSize: "0.6875rem", padding: "2px 6px", background: "var(--bg-input)", borderRadius: "4px", fontWeight: 600 }}>
                            {addr.type || "Address"}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                          {addr.street}, {addr.area}
                          <br />
                          {addr.city}, {addr.country}
                          <br />
                          Phone: {addr.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Form to enter / edit address */}
                {isAddingNewAddress && (
                  <form onSubmit={handleSaveNewAddress} style={{ background: "var(--bg-main)", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "16px" }}>Add New Delivery Address</h3>
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Contact Phone Number *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Street Address & Villa / Building *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Villa 14, Street 902, Zone 66"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">District / Area</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. West Bay or The Pearl"
                          value={addressForm.area}
                          onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save & Use This Address
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setIsAddingNewAddress(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setCurrentStep(2)}
                    id="checkout-step-1-next"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="cart-items-card">
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: "20px", color: "var(--secondary)" }}>
                  Select Payment Method
                </h2>

                <div className="payment-options-grid">
                  <div
                    className={`payment-method-card ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard size={32} color={paymentMethod === "card" ? "var(--primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700 }}>Credit / Debit Card</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Visa, Mastercard, Amex</span>
                  </div>

                  <div
                    className={`payment-method-card ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <Smartphone size={32} color={paymentMethod === "upi" ? "var(--primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700 }}>Instant UPI / QR</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Google Pay, PhonePe, Paytm</span>
                  </div>

                  <div
                    className={`payment-method-card ${paymentMethod === "cod" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <Banknote size={32} color={paymentMethod === "cod" ? "var(--primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700 }}>Cash on Delivery</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pay upon physical arrival</span>
                  </div>
                </div>

                {/* Card Form */}
                {paymentMethod === "card" && (
                  <div style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "14px", marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Card Information</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Lock size={12} /> SSL Encrypted
                      </span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="4242 4242 4242 4242"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Cardholder Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={cardData.holderName}
                          onChange={(e) => setCardData({ ...cardData, holderName: e.target.value })}
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div className="form-group">
                          <label className="form-label">Expiry</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            className="form-input"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Form */}
                {paymentMethod === "upi" && (
                  <div style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "14px", marginBottom: "24px" }}>
                    <div className="form-group">
                      <label className="form-label">Enter Virtual Payment Address (UPI ID)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="yourname@bank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      A payment request prompt will be dispatched to your approved UPI mobile app upon clicking place order.
                    </div>
                  </div>
                )}

                {/* COD Info */}
                {paymentMethod === "cod" && (
                  <div style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "14px", marginBottom: "24px" }}>
                    <p style={{ fontSize: "0.9375rem", color: "var(--secondary)", lineHeight: 1.6 }}>
                      You can pay via cash or mobile POS terminal at your doorstep when your courier delivers your package.
                    </p>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                    Back to Address
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setCurrentStep(3)}
                    id="checkout-step-2-next"
                  >
                    <span>Review Order</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Place Order */}
            {currentStep === 3 && (
              <div className="cart-items-card">
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: "20px", color: "var(--secondary)" }}>
                  Review & Confirm Order
                </h2>

                <div style={{ background: "var(--bg-main)", padding: "18px", borderRadius: "12px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong>Delivery Address:</strong>
                    <button type="button" onClick={() => setCurrentStep(1)} style={{ color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 600 }}>
                      Change
                    </button>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {addressForm.fullName} • {addressForm.street}, {addressForm.area}, {addressForm.city}, {addressForm.country}
                  </div>
                </div>

                <div style={{ background: "var(--bg-main)", padding: "18px", borderRadius: "12px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong>Payment Method:</strong>
                    <button type="button" onClick={() => setCurrentStep(2)} style={{ color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 600 }}>
                      Change
                    </button>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {paymentMethod === "card" && `Credit/Debit Card (Cardholder: ${cardData.holderName})`}
                    {paymentMethod === "upi" && `UPI ID (${upiId})`}
                    {paymentMethod === "cod" && "Cash on Delivery"}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    id="place-order-final-btn"
                  >
                    {isProcessing ? "Processing Secure Order..." : `Place Order • QAR ${totalAmount.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <aside className="summary-card">
            <h3 className="summary-title">Order Items ({cart.length})</h3>
            <div style={{ maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Qty: {item.quantity} × QAR {item.product.price}
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                    QAR {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>QAR {subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="summary-row discount">
                  <span>Coupon Discount</span>
                  <span>-QAR {couponDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `QAR ${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5% VAT)</span>
                <span>QAR {taxAmount.toFixed(2)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total">
                <span>Total Due</span>
                <span>QAR {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
