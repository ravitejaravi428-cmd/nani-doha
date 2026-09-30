import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Calendar, MapPin, CreditCard } from "lucide-react";
import confetti from "canvas-confetti";
import { useOrders } from "../context/OrderContext";

export const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
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

  return (
    <div className="page-wrapper" id="order-confirmation-page" style={{ paddingTop: "40px" }}>
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon-bubble">
            <CheckCircle2 size={44} />
          </div>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#15803d", textTransform: "uppercase", letterSpacing: "1px" }}>
              Order Confirmed & Payment Verified
            </span>
            <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--secondary)", marginTop: "6px" }}>
              Thank You for Shopping at NANI DOHA!
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "8px" }}>
              Your order confirmation has been dispatched. Order Reference: <strong>#{order.id}</strong>
            </p>
          </div>

          {/* Delivery & Timeline */}
          <div style={{ background: "var(--bg-main)", borderRadius: "14px", padding: "24px", marginBottom: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Estimated Delivery Date
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "1.125rem", fontWeight: 800, color: "var(--primary)" }}>
                  <Calendar size={18} />
                  <span>{order.estimatedDelivery}</span>
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
                Shipping Address
              </span>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginTop: "6px", fontSize: "0.9375rem", color: "var(--secondary)" }}>
                <MapPin size={18} style={{ color: "var(--primary)", flexShrink: 0, marginTop: "2px" }} />
                <span>
                  <strong>{order.shippingAddress.fullName}</strong> — {order.shippingAddress.street}, {order.shippingAddress.area ? `${order.shippingAddress.area}, ` : ""}{order.shippingAddress.city}, {order.shippingAddress.country} (Phone: {order.shippingAddress.phone})
                </span>
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
