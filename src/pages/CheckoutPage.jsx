import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  Lock,
  Plus,
  MapPin,
  Truck,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import {
  QATAR_MUNICIPALITIES,
  QATAR_POPULAR_AREAS,
  OFFICIAL_QATAR_HOST_PHONE,
  OFFICIAL_QATAR_HOST_PHONE_DIGITS
} from "../data/qatarLocations";

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
    fullName: user ? user.name : "Nani Qatar Customer",
    phone: user ? user.phone : "+974 7028 4220",
    building: "Villa 42",
    street: "Street 810",
    zone: "Zone 66",
    area: "West Bay Lagoon",
    city: "Doha",
    country: "Qatar",
    landmark: "Near West Bay Beach & Katara",
    notes: ""
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

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    let paymentLabel = "Credit Card (ending in 4242)";
    if (paymentMethod === "upi") paymentLabel = `UPI (${upiId})`;
    if (paymentMethod === "cod") paymentLabel = "Cash on Delivery";

    try {
      const order = await createOrder({
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

      const confirmedId = order?.id || `ND-${Math.floor(100000 + Math.random() * 900000)}`;

      clearCart();
      setIsProcessing(false);
      showToast("Order placed successfully!", "success");
      navigate(`/order-confirmation/${confirmedId}`);
    } catch (err) {
      console.error("Order creation failed:", err);
      setIsProcessing(false);
      showToast("Encountered an issue placing your order. Please try again.", "error");
    }
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
                {/* Official Qatar Delivery Guarantee Banner */}
                <div style={{
                  background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
                  border: "1.5px solid #059669",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  color: "#f8fafc",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  boxShadow: "0 10px 25px rgba(6, 78, 59, 0.2)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "rgba(52, 211, 153, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem"
                    }}>
                      🇶🇦
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>Official Qatar Nationwide Delivery</span>
                        <ShieldCheck size={16} />
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#cbd5e1", marginTop: "2px" }}>
                        Direct delivery to <strong>any address across all Qatar Municipalities</strong>: Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor, Umm Salal & beyond.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "#fef08a",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "6px"
                    }}>
                      ⚡ Free Delivery &gt; QAR 100
                    </span>
                    <span style={{
                      background: "#059669",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "6px"
                    }}>
                      💵 COD Available
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--secondary)", margin: 0 }}>
                      Select Qatar Delivery Address
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      Choose your saved Qatar location or enter a new building/villa address
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setIsAddingNewAddress(true);
                      setSelectedAddressId("new");
                    }}
                  >
                    <Plus size={14} /> Add New Qatar Address
                  </button>
                </div>

                {/* Saved Address Cards */}
                {!isAddingNewAddress && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr)}
                        style={{
                          border: selectedAddressId === addr.id ? "2px solid var(--primary)" : "1.5px solid var(--border-light)",
                          background: selectedAddressId === addr.id ? "var(--primary-light)" : "#fff",
                          padding: "18px",
                          borderRadius: "14px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          position: "relative"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontWeight: 800, fontSize: "0.9375rem", color: "var(--secondary)" }}>
                            {addr.fullName}
                          </span>
                          <span style={{ fontSize: "0.6875rem", padding: "2px 8px", background: "var(--bg-input)", borderRadius: "6px", fontWeight: 700, color: "var(--primary)" }}>
                            {addr.type || "Qatar Address"}
                          </span>
                        </div>
                        
                        <div style={{ fontSize: "0.875rem", color: "var(--secondary)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                          <MapPin size={15} color="var(--primary)" />
                          <span>{addr.building || addr.street}</span>
                        </div>

                        <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                          {addr.zone && <span style={{ fontWeight: 600, color: "var(--secondary)" }}>{addr.zone}, </span>}
                          {addr.street && <span>{addr.street}, </span>}
                          {addr.area && <span>{addr.area}, </span>}
                          <strong>{addr.city}, Qatar</strong>
                          {addr.landmark && (
                            <div style={{ marginTop: "4px", fontSize: "0.75rem", color: "#059669" }}>
                              📍 Landmark: {addr.landmark}
                            </div>
                          )}
                          <div style={{ marginTop: "6px", fontWeight: 700, color: "var(--secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <PhoneCall size={13} color="var(--primary)" />
                            <span>{addr.phone}</span>
                          </div>
                        </div>

                        {selectedAddressId === addr.id && (
                          <div style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "var(--primary)",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}>
                            <CheckCircle2 size={14} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Form to enter / edit address */}
                {isAddingNewAddress && (
                  <form onSubmit={handleSaveNewAddress} style={{ background: "var(--bg-main)", padding: "24px", borderRadius: "16px", marginBottom: "24px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--secondary)" }}>
                        Enter Qatar Delivery Address
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700 }}>
                        🇶🇦 Nationwide Qatar Coverage
                      </span>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Nani Doha"
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Qatar Contact Phone Number *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="+974 7028 4220"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Qatar Municipality / City *</label>
                        <select
                          className="form-input"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        >
                          {QATAR_MUNICIPALITIES.map((m) => (
                            <option key={m.id} value={m.name.split(" (")[0]}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Zone Number (Qatar Blue Plate)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Zone 66, Zone 55, Zone 24"
                          value={addressForm.zone || ""}
                          onChange={(e) => setAddressForm({ ...addressForm, zone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Building / Villa / Flat / Compound *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Villa 42, Building 18, Flat 402"
                          value={addressForm.building || ""}
                          onChange={(e) => setAddressForm({ ...addressForm, building: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Street Name / Street Number *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Street 810 or Corniche Road"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">District / Area in Qatar</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. West Bay, The Pearl, Al Sadd, Ain Khaled"
                          value={addressForm.area}
                          onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nearest Landmark (Optional)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Near Metro Station, Behind Al Meera, Mosque"
                          value={addressForm.landmark || ""}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delivery Instructions (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Call upon arrival, leave with security gate"
                        value={addressForm.notes || ""}
                        onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                      <button type="submit" className="btn btn-primary">
                        Save & Use This Qatar Address
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setIsAddingNewAddress(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* WhatsApp Quick Track & Action Bar */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "14px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-light)"
                }}>
                  <a
                    href={`https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(
                      `Hello Host Nani! I am on the checkout page of NANI DOHA. I would like to order items for delivery to my address in Qatar: ${addressForm.city || "Doha"}, ${addressForm.area || "Qatar"}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ borderColor: "#16a34a", color: "#16a34a", fontWeight: 700 }}
                  >
                    <MessageCircle size={18} color="#16a34a" />
                    <span>WhatsApp Host: +974 7028 4220</span>
                  </a>

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

                <div style={{ background: "var(--bg-main)", padding: "20px", borderRadius: "14px", marginBottom: "20px", border: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={18} color="var(--primary)" />
                      <strong style={{ fontSize: "0.9375rem" }}>Qatar Delivery Address:</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(1)} style={{ color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 700 }}>
                      Change Address
                    </button>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--secondary)", lineHeight: 1.6 }}>
                    <div><strong>{addressForm.fullName}</strong> • <span style={{ color: "var(--primary)" }}>{addressForm.phone}</span></div>
                    <div>{addressForm.building || addressForm.street}, {addressForm.street}</div>
                    <div>{addressForm.zone ? `${addressForm.zone}, ` : ""}{addressForm.area ? `${addressForm.area}, ` : ""}{addressForm.city}, Qatar</div>
                    {addressForm.landmark && <div style={{ fontSize: "0.8125rem", color: "#059669", marginTop: "2px" }}>📍 Landmark: {addressForm.landmark}</div>}
                    {addressForm.notes && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>📝 Note: {addressForm.notes}</div>}
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
                    {paymentMethod === "cod" && "Cash on Delivery (Pay upon arrival anywhere in Qatar)"}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </button>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      href={`https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(
                        `🛍️ *NANI QATAR OFFICIAL ORDER*\n` +
                        `Name: ${addressForm.fullName}\n` +
                        `Phone: ${addressForm.phone}\n` +
                        `📍 *Qatar Address:* ${addressForm.building || addressForm.street}, ${addressForm.street}, ${addressForm.zone || ""}, ${addressForm.city}, Qatar (Landmark: ${addressForm.landmark || "N/A"})\n` +
                        `📦 *Items:* ${cart.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")}\n` +
                        `💰 *Total:* QAR ${totalAmount.toFixed(2)}\n` +
                        `Payment: ${paymentMethod === "cod" ? "COD" : "Card"}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ borderColor: "#16a34a", color: "#16a34a", fontWeight: 700 }}
                    >
                      <MessageCircle size={18} />
                      <span>Order via WhatsApp</span>
                    </a>

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
