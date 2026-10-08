import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  Lock,
  MapPin,
  Truck,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  User,
  UserCheck,
  LogIn,
  UserPlus,
  Sparkles,
  Info
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import {
  QATAR_MUNICIPALITIES,
  OFFICIAL_QATAR_HOST_PHONE,
  OFFICIAL_QATAR_HOST_PHONE_DIGITS
} from "../data/qatarLocations";
import { notifyHostOnWhatsApp } from "../utils/whatsapp";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, subtotal, couponDiscount, shippingFee, taxAmount, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated, login, register, quickGuestLogin, savedAddresses, addAddress } = useAuth();
  const { createOrder } = useOrders();
  const { showToast } = useToast();

  // Step 1: Auth (if not logged in) or Address (if already logged in)
  // Step 2: Delivery Address
  // Step 3: Payment Method
  // Step 4: Review & Place Order
  const [currentStep, setCurrentStep] = useState(isAuthenticated ? 2 : 1);

  // Authentication Mode inside Step 1 ("login" | "register" | "express")
  const [authMode, setAuthMode] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [expressName, setExpressName] = useState("");
  const [expressPhone, setExpressPhone] = useState("");
  const [expressEmail, setExpressEmail] = useState("");

  // Customer Delivery Address Form State (Blank by default - no fake mock addresses suggested!)
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    city: "Doha",
    area: "",
    zone: "",
    street: "",
    building: "",
    landmark: "",
    notes: ""
  });

  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);

  // Synchronize user contact details if user logs in during checkout
  useEffect(() => {
    if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        phone: prev.phone || user.phone || ""
      }));
      // If user logs in and we're currently on Step 1, advance to Step 2 (Address)
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    }
  }, [user]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "card" | "upi"
  const [cardData, setCardData] = useState({
    cardNumber: "4242 •••• •••• 4242",
    holderName: user?.name || "NANI DOHA CUSTOMER",
    expiry: "12/28",
    cvv: "888"
  });
  const [upiId, setUpiId] = useState("nanidoha@oksbi");
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, show empty state
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

  // Handle Customer Login inside Checkout
  const handleCheckoutLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast("Please enter your email or phone and password", "error");
      return;
    }
    const success = login(loginEmail, loginPassword);
    if (success) {
      setCurrentStep(2);
    }
  };

  // Handle Customer Registration inside Checkout
  const handleCheckoutRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast("Please complete the required registration fields", "error");
      return;
    }
    const success = register(regName, regEmail, regPassword, regPhone || "+974 7028 4220");
    if (success) {
      setCurrentStep(2);
    }
  };

  // Handle Express Guest Sign In with Phone
  const handleExpressOrderSignIn = (e) => {
    e.preventDefault();
    if (!expressName.trim() || !expressPhone.trim()) {
      showToast("Please enter your full name and Qatar contact phone number", "error");
      return;
    }
    const signedUser = quickGuestLogin({
      name: expressName,
      phone: expressPhone,
      email: expressEmail
    });
    if (signedUser) {
      setCurrentStep(2);
    }
  };

  // Handle Validate Delivery Address & Proceed to Payment
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!addressForm.fullName.trim()) {
      showToast("Please enter the recipient's full name", "error");
      return;
    }
    if (!addressForm.phone.trim()) {
      showToast("Please enter a contact phone number in Qatar", "error");
      return;
    }
    if (!addressForm.city.trim()) {
      showToast("Please select your Qatar Municipality / City", "error");
      return;
    }
    if (!addressForm.area.trim()) {
      showToast("Please enter your District / Area in Qatar", "error");
      return;
    }
    if (!addressForm.street.trim()) {
      showToast("Please enter your Street name or number", "error");
      return;
    }
    if (!addressForm.building.trim()) {
      showToast("Please enter your Building, Villa, or Flat number", "error");
      return;
    }

    if (saveAddressToProfile && (!savedAddresses || savedAddresses.length === 0)) {
      addAddress(addressForm);
    }

    setCurrentStep(3);
  };

  // Handle Final Order Placement
  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    let paymentLabel = "Cash on Delivery (Pay upon arrival anywhere in Qatar)";
    if (paymentMethod === "card") paymentLabel = `Credit/Debit Card (Cardholder: ${cardData.holderName})`;
    if (paymentMethod === "upi") paymentLabel = `Instant UPI / QR (${upiId})`;

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

      // Automatically dispatch WhatsApp notification to Official Host (+974 7028 4220)
      notifyHostOnWhatsApp(order);

      clearCart();
      setIsProcessing(false);
      showToast("Order placed successfully! WhatsApp alert opened for Host (+974 7028 4220).", "success");
      navigate(`/order-confirmation/${confirmedId}`);
    } catch (err) {
      console.error("Order creation failed:", err);
      setIsProcessing(false);
      showToast("Encountered an issue placing your order. Please try again.", "error");
    }
  };

  return (
    <div className="page-wrapper" id="checkout-page" style={{ paddingTop: "32px", paddingBottom: "60px" }}>
      <div className="container">
        {/* Step Indicator */}
        <div className="checkout-steps-bar">
          <div className={`checkout-step-pill ${isAuthenticated ? "completed" : currentStep === 1 ? "active" : ""}`}>
            <span className="step-number">{isAuthenticated ? "✓" : "1"}</span>
            <span>{isAuthenticated ? `Signed In (${user.name.split(" ")[0]})` : "Customer Sign In"}</span>
          </div>

          <div className="checkout-step-line" />

          <div className={`checkout-step-pill ${currentStep === 2 ? "active" : currentStep > 2 ? "completed" : ""}`}>
            <span className="step-number">{currentStep > 2 ? "✓" : "2"}</span>
            <span>Delivery Address</span>
          </div>

          <div className="checkout-step-line" />

          <div className={`checkout-step-pill ${currentStep === 3 ? "active" : currentStep > 3 ? "completed" : ""}`}>
            <span className="step-number">{currentStep > 3 ? "✓" : "3"}</span>
            <span>Payment Method</span>
          </div>

          <div className="checkout-step-line" />

          <div className={`checkout-step-pill ${currentStep === 4 ? "active" : ""}`}>
            <span className="step-number">4</span>
            <span>Review & Confirm</span>
          </div>
        </div>

        <div className="cart-layout">
          {/* Main Checkout Interaction Column */}
          <div>
            {/* ============================================================== */}
            {/* STEP 1: CUSTOMER LOGIN REQUIRED GATE                           */}
            {/* ============================================================== */}
            {currentStep === 1 && !isAuthenticated && (
              <div className="cart-items-card">
                {/* Official Store Security Guarantee Header */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    border: "1.5px solid #334155",
                    borderRadius: "14px",
                    padding: "20px 24px",
                    color: "#f8fafc",
                    marginBottom: "24px",
                    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem"
                      }}
                    >
                      🇶🇦
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.125rem", color: "#34d399", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>Customer Login Required to Place Order</span>
                        <ShieldCheck size={18} />
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#cbd5e1", marginTop: "3px" }}>
                        Please sign in or create an account to verify your order, enable Qatar nationwide delivery, and receive live WhatsApp updates from Host (+974 7028 4220).
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auth Mode Tabs */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "8px",
                    background: "var(--bg-main)",
                    padding: "6px",
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}
                >
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: authMode === "login" ? "#fff" : "transparent",
                      color: authMode === "login" ? "var(--primary)" : "var(--text-muted)",
                      boxShadow: authMode === "login" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      padding: "10px 8px"
                    }}
                    onClick={() => setAuthMode("login")}
                  >
                    <LogIn size={15} />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: authMode === "register" ? "#fff" : "transparent",
                      color: authMode === "register" ? "var(--primary)" : "var(--text-muted)",
                      boxShadow: authMode === "register" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      padding: "10px 8px"
                    }}
                    onClick={() => setAuthMode("register")}
                  >
                    <UserPlus size={15} />
                    <span>Create Account</span>
                  </button>

                  <button
                    type="button"
                    className="btn"
                    style={{
                      background: authMode === "express" ? "#fff" : "transparent",
                      color: authMode === "express" ? "#059669" : "var(--text-muted)",
                      boxShadow: authMode === "express" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      padding: "10px 8px"
                    }}
                    onClick={() => setAuthMode("express")}
                  >
                    <Sparkles size={15} color="#059669" />
                    <span>⚡ Fast Phone Order</span>
                  </button>
                </div>

                {/* TAB 1: Sign In Form */}
                {authMode === "login" && (
                  <form onSubmit={handleCheckoutLogin} style={{ maxWidth: "520px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--secondary)", margin: 0 }}>
                        Sign In to Your Account
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Enter your credentials to continue to delivery address entry
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address or Phone *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. nani@example.com or +974 7028 4220"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        id="checkout-login-email"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        id="checkout-login-password"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "16px" }} id="checkout-login-submit">
                      <span>Sign In & Continue to Address</span>
                      <ArrowRight size={18} />
                    </button>

                    <div style={{ textAlign: "center", marginTop: "16px", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      First time shopping with us?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("register")}
                        style={{ color: "var(--primary)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                      >
                        Create an account here
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 2: Register Form */}
                {authMode === "register" && (
                  <form onSubmit={handleCheckoutRegister} style={{ maxWidth: "520px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--secondary)", margin: 0 }}>
                        Create Customer Account
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Register your official profile to receive order confirmations and delivery updates
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Customer Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Tariq Mansoor"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        id="checkout-reg-name"
                      />
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="tariq@example.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          required
                          id="checkout-reg-email"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Qatar Phone (+974)</label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="+974 7028 4220"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          id="checkout-reg-phone"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Minimum 6 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                        id="checkout-reg-password"
                      />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: "16px" }} id="checkout-reg-submit">
                      <span>Create Account & Continue to Address</span>
                      <ArrowRight size={18} />
                    </button>

                    <div style={{ textAlign: "center", marginTop: "16px", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("login")}
                        style={{ color: "var(--primary)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
                      >
                        Sign in here
                      </button>
                    </div>
                  </form>
                )}

                {/* TAB 3: Fast Express Phone Order */}
                {authMode === "express" && (
                  <form onSubmit={handleExpressOrderSignIn} style={{ maxWidth: "520px", margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ecfdf5", color: "#059669", padding: "4px 12px", borderRadius: "16px", fontSize: "0.75rem", fontWeight: 700, marginBottom: "8px" }}>
                        <Sparkles size={14} /> Quick One-Step Order Access
                      </div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--secondary)", margin: 0 }}>
                        Fast Order with Qatar Phone Number
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Enter your name and Qatar mobile number to proceed directly to delivery address entry without needing a password.
                      </p>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Your Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Fatima Al-Sulaiti"
                        value={expressName}
                        onChange={(e) => setExpressName(e.target.value)}
                        required
                        id="checkout-express-name"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Qatar Mobile Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+974 7028 4220"
                        value={expressPhone}
                        onChange={(e) => setExpressPhone(e.target.value)}
                        required
                        id="checkout-express-phone"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address (Optional, for invoice copy)</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="e.g. customer@nanidoha.com"
                        value={expressEmail}
                        onChange={(e) => setExpressEmail(e.target.value)}
                        id="checkout-express-email"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-lg"
                      style={{ marginTop: "16px", background: "linear-gradient(135deg, #059669 0%, #047857 100%)", borderColor: "#059669" }}
                      id="checkout-express-submit"
                    >
                      <UserCheck size={18} />
                      <span>Verify Customer & Enter Address</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 2: ENTER QATAR DELIVERY ADDRESS (NO FAKE SUGGESTIONS!)    */}
            {/* ============================================================== */}
            {currentStep === 2 && (
              <div className="cart-items-card">
                {/* Official Delivery Header */}
                <div
                  style={{
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
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "rgba(52, 211, 153, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem"
                      }}
                    >
                      🇶🇦
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "#34d399", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>Official Qatar Nationwide Delivery</span>
                        <ShieldCheck size={16} />
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#cbd5e1", marginTop: "2px" }}>
                        Doorstep delivery across all Qatar Municipalities: Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor & beyond.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span
                      style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        color: "#fef08a",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "6px"
                      }}
                    >
                      ⚡ Free Delivery &gt; QAR 100
                    </span>
                    <span
                      style={{
                        background: "#059669",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "6px"
                      }}
                    >
                      💵 COD Available
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--secondary)", margin: 0 }}>
                        Enter Your Qatar Delivery Address
                      </h2>
                      <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        Please provide your exact address details in Qatar for guaranteed courier delivery
                      </p>
                    </div>

                    {/* Customer Identity Badge */}
                    {user && (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-main)", padding: "6px 12px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
                        <User size={14} color="var(--primary)" />
                        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--secondary)" }}>
                          {user.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Qatar Delivery Address Form (Customer Inputs Real Address) */}
                <form onSubmit={handleProceedToPayment}>
                  {/* Recipient Contact Row */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Recipient Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Fatima Al-Kuwari"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        required
                        id="address-fullname-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Qatar Contact Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="+974 7028 4220"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                        id="address-phone-input"
                      />
                    </div>
                  </div>

                  {/* Municipality & Area */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Qatar Municipality / City *</label>
                      <select
                        className="form-input"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        required
                        id="address-city-select"
                      >
                        {QATAR_MUNICIPALITIES.map((m) => (
                          <option key={m.id} value={m.name.split(" (")[0]}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">District / Area in Qatar *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. West Bay, The Pearl, Lusail Marina, Al Sadd, Ain Khaled"
                        value={addressForm.area}
                        onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                        required
                        id="address-area-input"
                      />
                    </div>
                  </div>

                  {/* Qatar Blue Plate Address Banner & Inputs */}
                  <div
                    style={{
                      background: "rgba(14, 165, 233, 0.06)",
                      border: "1.5px dashed rgba(14, 165, 233, 0.4)",
                      borderRadius: "14px",
                      padding: "16px 18px",
                      marginBottom: "20px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                        color: "#0284c7",
                        fontWeight: 700,
                        fontSize: "0.875rem"
                      }}
                    >
                      <Info size={16} />
                      <span>Qatar Blue Plate Address (Zone, Street, Building)</span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "14px"
                      }}
                    >
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Zone Number *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Zone 66 or Zone 55"
                          value={addressForm.zone}
                          onChange={(e) => setAddressForm({ ...addressForm, zone: e.target.value })}
                          required
                          id="address-zone-input"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Street Name or Number *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Street 810 or Corniche Road"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          required
                          id="address-street-input"
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Building / Villa / Flat No. *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Villa 14, Tower 3 Apt 402"
                          value={addressForm.building}
                          onChange={(e) => setAddressForm({ ...addressForm, building: e.target.value })}
                          required
                          id="address-building-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Landmark & Courier Instructions */}
                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-label">Nearest Landmark (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Near Metro Station, Behind Al Meera Supermarket, Mosque"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                        id="address-landmark-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Delivery Instructions for Courier (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Call before arrival, leave with security reception"
                        value={addressForm.notes}
                        onChange={(e) => setAddressForm({ ...addressForm, notes: e.target.value })}
                        id="address-notes-input"
                      />
                    </div>
                  </div>

                  {/* Save address checkbox */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <input
                      type="checkbox"
                      id="save-addr-profile"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    />
                    <label htmlFor="save-addr-profile" style={{ fontSize: "0.875rem", color: "var(--secondary)", cursor: "pointer" }}>
                      Save this address to my profile for future orders
                    </label>
                  </div>

                  {/* WhatsApp Quick Track & Proceed Actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "14px",
                      paddingTop: "20px",
                      borderTop: "1px solid var(--border-light)"
                    }}
                  >
                    <a
                      href={`https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(
                        `Hello Host Nani! I am filling my delivery address for NANI DOHA order: ${addressForm.fullName || "Customer"} in ${addressForm.city || "Doha"}, Qatar.`
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
                      type="submit"
                      className="btn btn-primary btn-lg"
                      id="checkout-step-address-next"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 3: PAYMENT METHOD                                         */}
            {/* ============================================================== */}
            {currentStep === 3 && (
              <div className="cart-items-card">
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: "20px", color: "var(--secondary)" }}>
                  Select Payment Method
                </h2>

                <div className="payment-options-grid">
                  <div
                    className={`payment-method-card ${paymentMethod === "cod" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                    id="payment-cod-option"
                  >
                    <Banknote size={32} color={paymentMethod === "cod" ? "var(--primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700 }}>Cash on Delivery (COD)</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Pay upon physical arrival in Qatar</span>
                  </div>

                  <div
                    className={`payment-method-card ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                    id="payment-card-option"
                  >
                    <CreditCard size={32} color={paymentMethod === "card" ? "var(--primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700 }}>Credit / Debit Card</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Visa, Mastercard, QPay</span>
                  </div>

                  <div
                    className={`payment-method-card ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                    id="payment-upi-option"
                  >
                    <Smartphone size={32} color={paymentMethod === "upi" ? "var(--primary)" : "var(--text-muted)"} />
                    <span style={{ fontWeight: 700 }}>Instant UPI / QR</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Google Pay, PhonePe, Paytm</span>
                  </div>
                </div>

                {/* COD Details */}
                {paymentMethod === "cod" && (
                  <div style={{ background: "var(--bg-main)", padding: "20px", borderRadius: "14px", marginBottom: "24px", border: "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#15803d", fontWeight: 700, marginBottom: "8px" }}>
                      <CheckCircle2 size={18} />
                      <span>Zero Prepayment Required</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--secondary)", margin: 0, lineHeight: 1.6 }}>
                      You can pay via cash or card POS terminal at your doorstep when your courier delivers your package to <strong>{addressForm.building || addressForm.street}, {addressForm.city}, Qatar</strong>.
                    </p>
                  </div>
                )}

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
                      A secure payment request will be sent to your approved UPI app upon order submission.
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                    <ArrowLeft size={16} />
                    <span>Back to Address</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={() => setCurrentStep(4)}
                    id="checkout-step-payment-next"
                  >
                    <span>Review Order</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* STEP 4: REVIEW & CONFIRM ORDER                                 */}
            {/* ============================================================== */}
            {currentStep === 4 && (
              <div className="cart-items-card">
                <h2 style={{ fontSize: "1.375rem", fontWeight: 800, marginBottom: "20px", color: "var(--secondary)" }}>
                  Review & Confirm Order
                </h2>

                {/* Verified Customer Address Review */}
                <div style={{ background: "var(--bg-main)", padding: "20px", borderRadius: "14px", marginBottom: "20px", border: "1px solid var(--border-light)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={18} color="var(--primary)" />
                      <strong style={{ fontSize: "0.9375rem" }}>Qatar Delivery Address:</strong>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(2)} style={{ color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
                      Change Address
                    </button>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--secondary)", lineHeight: 1.6 }}>
                    <div><strong>{addressForm.fullName}</strong> • <span style={{ color: "var(--primary)", fontWeight: 700 }}>{addressForm.phone}</span></div>
                    <div>{addressForm.building}, {addressForm.street}</div>
                    <div>{addressForm.zone ? `${addressForm.zone}, ` : ""}{addressForm.area ? `${addressForm.area}, ` : ""}<strong>{addressForm.city}, Qatar</strong></div>
                    {addressForm.landmark && <div style={{ fontSize: "0.8125rem", color: "#059669", marginTop: "2px" }}>📍 Landmark: {addressForm.landmark}</div>}
                    {addressForm.notes && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>📝 Note: {addressForm.notes}</div>}
                  </div>
                </div>

                {/* Payment Method Review */}
                <div style={{ background: "var(--bg-main)", padding: "18px", borderRadius: "12px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <strong>Payment Method:</strong>
                    <button type="button" onClick={() => setCurrentStep(3)} style={{ color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                      Change
                    </button>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                    {paymentMethod === "card" && `Credit/Debit Card (Cardholder: ${cardData.holderName})`}
                    {paymentMethod === "upi" && `Instant UPI (${upiId})`}
                    {paymentMethod === "cod" && "Cash on Delivery (Pay upon arrival anywhere across Qatar)"}
                  </div>
                </div>

                {/* Final Action Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setCurrentStep(3)}>
                    <ArrowLeft size={16} />
                    <span>Back</span>
                  </button>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                    <a
                      href={`https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(
                        `🛍️ *NANI QATAR OFFICIAL ORDER*\n` +
                        `Name: ${addressForm.fullName}\n` +
                        `Phone: ${addressForm.phone}\n` +
                        `📍 *Qatar Address:* ${addressForm.building}, ${addressForm.street}, ${addressForm.zone || ""}, ${addressForm.area || ""}, ${addressForm.city}, Qatar (Landmark: ${addressForm.landmark || "N/A"})\n` +
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

            {/* Qatar Official Delivery Seal */}
            <div style={{ marginTop: "16px", padding: "12px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", fontSize: "0.8125rem", color: "#065f46", lineHeight: 1.5 }}>
              <strong>🇶🇦 Official Nationwide Dispatch</strong>
              <div>Host Hotline: <strong>+974 7028 4220</strong></div>
              <div>Free express delivery on orders over QAR 100</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
