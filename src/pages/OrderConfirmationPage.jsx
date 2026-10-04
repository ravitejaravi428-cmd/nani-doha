import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Calendar,
  MapPin,
  CreditCard,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Truck
} from "lucide-react";
import confetti from "canvas-confetti";
import { useOrders } from "../context/OrderContext";
import {
  OFFICIAL_QATAR_HOST_PHONE,
  OFFICIAL_QATAR_HOST_PHONE_DIGITS
} from "../data/qatarLocations";

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { getOrderById, orders } = useOrders();

  // Robust order resolution: specific orderId -> newest active order -> localStorage fallback
  let order = null;
  if (orderId && orderId !== "undefined") {
    order = getOrderById(orderId);
  }
  if (!order && orders && orders.length > 0) {
    order = orders[0];
  }
  if (!order) {
    try {
      const stored = localStorage.getItem("nanidoha_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          order = (orderId && orderId !== "undefined")
            ? parsed.find((o) => o.id === orderId) || parsed[0]
            : parsed[0];
        }
      }
    } catch (e) {}
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="page-wrapper container" style={{ paddingTop: "60px", textAlign: "center" }}>
        <h2>Order Not Found</h2>
        <p style={{ color: "var(--text-muted)", margin: "16px 0 24px" }}>
          We could not locate details for Order ID: {orderId}
        </p>
        <Link to="/orders" className="btn btn-primary">
          View All Orders
        </Link>
      </div>
    );
  }

  const addr = order.shippingAddress || {};
  const formattedAddress = [
    addr.building || addr.street,
    addr.street,
    addr.zone,
    addr.area,
    addr.city ? `${addr.city}, Qatar` : "Qatar"
  ].filter(Boolean).join(", ");

  const whatsappMessage = `🛍️ *NANI QATAR ORDER CONFIRMATION*
━━━━━━━━━━━━━━━━━━━━
Order ID: #${order.id}
Customer: ${addr.fullName || "Customer"}
Phone: ${addr.phone || "+974"}

📍 *Qatar Delivery Address:*
${formattedAddress}
${addr.landmark ? `Landmark: ${addr.landmark}` : ""}

📦 *Items:*
${order.items.map((i) => `• ${i.product.name} (x${i.quantity}) - QAR ${(i.product.price * i.quantity).toFixed(2)}`).join("\n")}

💰 *Total Paid:* QAR ${order.totalAmount.toFixed(2)}
💳 *Payment:* ${order.paymentMethod}

Hello Host Nani! I have placed this order on your official Qatar store. Please confirm my dispatch to this address in Qatar! 🙏🏻`;

  return (
    <div className="page-wrapper" id="order-confirmation-page" style={{ paddingTop: "40px" }}>
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon-bubble">
            <CheckCircle2 size={44} />
          </div>

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "1px" }}>
              Order Confirmed & Scheduled for Delivery
            </span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--secondary)", marginTop: "6px" }}>
              Thank You for Ordering with NANI QATAR!
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "8px" }}>
              Official Store Order Reference: <strong>#{order.id}</strong>
            </p>
          </div>

          {/* Qatar Nationwide Delivery Notification */}
          <div style={{
            background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
            border: "1.5px solid #059669",
            borderRadius: "14px",
            padding: "16px 20px",
            color: "#f8fafc",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "14px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(52, 211, 153, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem"
              }}>
                🚚
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#34d399", fontSize: "0.9375rem" }}>
                  Delivery to Any Address Across Qatar
                </div>
                <div style={{ fontSize: "0.8125rem", color: "#cbd5e1" }}>
                  Your parcel is dispatched by our dedicated team to your doorstep in <strong>{addr.city || "Qatar"}</strong>.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a
                href={`https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ background: "#16a34a", color: "#fff", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <MessageCircle size={16} />
                <span>Send to Host on WhatsApp</span>
              </a>

              <a
                href={`tel:${OFFICIAL_QATAR_HOST_PHONE_DIGITS}`}
                className="btn btn-sm btn-outline"
                style={{ borderColor: "#34d399", color: "#34d399", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <PhoneCall size={15} />
                <span>+974 7028 4220</span>
              </a>
            </div>
          </div>

          {/* Delivery & Timeline */}
          <div style={{ background: "var(--bg-main)", borderRadius: "14px", padding: "24px", marginBottom: "32px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Estimated Delivery Window
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)" }}>
                  <Calendar size={18} />
                  <span>{order.estimatedDelivery} (Priority Qatar Courier)</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Payment Method
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "1rem", fontWeight: 700, color: "var(--secondary)" }}>
                  <CreditCard size={18} />
                  <span>{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "16px" }}>
              <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Qatar Shipping Address
              </span>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "6px", fontSize: "0.9375rem", color: "var(--secondary)" }}>
                <MapPin size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>{addr.fullName}</strong> — {addr.building || addr.street}, {addr.street}{addr.zone ? `, ${addr.zone}` : ""}{addr.area ? `, ${addr.area}` : ""}, <strong>{addr.city}, Qatar</strong>
                  {addr.landmark && (
                    <div style={{ fontSize: "0.8125rem", color: "#059669", marginTop: "3px" }}>
                      📍 Landmark: {addr.landmark}
                    </div>
                  )}
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "3px" }}>
                    📞 Contact Phone: {addr.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products Itemized */}
          <div style={{ marginBottom: "32px" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "16px", color: "var(--secondary)" }}>
              Ordered Items ({order.items.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", border: "1px solid var(--border-light)", borderRadius: "12px", padding: "16px" }}>
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{item.product.name}</h4>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {item.selectedColor && `Color: ${item.selectedColor} • `}
                      {item.selectedSize && `Size: ${item.selectedSize} • `}
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "1rem" }}>
                    QAR {(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", fontSize: "1.125rem", fontWeight: 800 }}>
                <span>Total Paid</span>
                <span style={{ color: "var(--primary)" }}>QAR {order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg"
              style={{ background: "#16a34a", color: "#ffffff", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <MessageCircle size={18} />
              <span>Confirm on WhatsApp with Host</span>
            </a>

            <Link to="/orders" className="btn btn-primary btn-lg" id="confirmation-view-orders-btn">
              <Package size={18} />
              <span>View Orders & Track</span>
            </Link>

            <Link to="/products" className="btn btn-outline btn-lg" id="confirmation-continue-shop-btn">
              <span>Continue Shopping</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
