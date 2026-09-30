import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle2, Clock, Eye } from "lucide-react";
import { useOrders } from "../context/OrderContext";

export const OrdersPage = () => {
  const { orders } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "all") return true;
    return o.status.toLowerCase().includes(statusFilter.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { bg: "#dcfce7", text: "#15803d" };
      case "out for delivery":
        return { bg: "#e0f2fe", text: "#0284c7" };
      case "shipped":
        return { bg: "#fef3c7", text: "#d97706" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  return (
    <div className="page-wrapper" id="orders-page" style={{ paddingTop: "32px" }}>
      <div className="container">
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--secondary)" }}>
            Order History & Tracking
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Track your ongoing shipments and review past luxury purchases.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["all", "out for delivery", "confirmed", "delivered"].map((st) => (
            <button
              key={st}
              type="button"
              className={`btn btn-sm ${statusFilter === st ? "btn-primary" : "btn-outline"}`}
              onClick={() => setStatusFilter(st)}
              style={{ textTransform: "capitalize" }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);

              return (
                <div
                  key={order.id}
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid var(--border-light)",
                    overflow: "hidden",
                    boxShadow: "var(--shadow-xs)"
                  }}
                  id={`order-card-${order.id}`}
                >
                  {/* Order Card Header */}
                  <div
                    style={{
                      background: "var(--bg-main)",
                      padding: "16px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      borderBottom: "1px solid var(--border-light)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>
                          Order ID
                        </span>
                        <div style={{ fontWeight: 800, color: "var(--secondary)" }}>#{order.id}</div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>
                          Order Date
                        </span>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-main)", fontWeight: 600 }}>
                          {new Date(order.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-light)", textTransform: "uppercase", fontWeight: 700 }}>
                          Total Amount
                        </span>
                        <div style={{ fontSize: "0.875rem", color: "var(--secondary)", fontWeight: 800 }}>
                          QAR {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.text,
                          padding: "6px 14px",
                          borderRadius: "999px",
                          fontSize: "0.8125rem",
                          fontWeight: 700
                        }}
                      >
                        {order.status}
                      </span>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye size={14} />
                        <span>Track Order</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {order.items.map((item) => (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ width: "64px", height: "64px", borderRadius: "10px", objectFit: "cover", background: "#f8fafc" }}
                          />
                          <div style={{ flex: 1 }}>
                            <Link to={`/product/${item.product.id}`}>
                              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--secondary)" }}>
                                {item.product.name}
                              </h4>
                            </Link>
                            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              Brand: {item.product.brand}
                              {item.selectedColor && ` • Color: ${item.selectedColor}`}
                              {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 800, fontSize: "0.9375rem" }}>
                              QAR {item.product.price}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Qty: {item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-box">
            <div className="empty-icon-circle">
              <Package size={36} />
            </div>
            <h3>No Orders Found</h3>
            <p style={{ color: "var(--text-muted)" }}>
              You don't have any orders matching the "{statusFilter}" status filter.
            </p>
            <Link to="/products" className="btn btn-primary">
              Shop Now
            </Link>
          </div>
        )}

        {/* Detailed Tracking Modal */}
        {selectedOrder && (
          <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
            <div className="modal-card" style={{ maxWidth: "680px", padding: "32px" }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Tracking Order #{selectedOrder.id}</h3>
                  <span style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    Estimated Delivery: <strong>{selectedOrder.estimatedDelivery}</strong>
                  </span>
                </div>
                <button type="button" className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                  ✕
                </button>
              </div>

              {/* Progress Stepper */}
              <div className="tracking-timeline">
                {selectedOrder.trackingSteps ? (
                  selectedOrder.trackingSteps.map((step, idx) => (
                    <div key={idx} className={`timeline-step ${step.completed ? "completed" : ""}`}>
                      <div className="timeline-dot">
                        {step.completed ? <CheckCircle2 size={16} /> : <Clock size={14} />}
                      </div>
                      <div className="timeline-title">{step.title}</div>
                      <div className="timeline-date">{step.date}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: "center", color: "var(--text-muted)", width: "100%" }}>
                    Shipment tracking updates every few hours.
                  </div>
                )}
              </div>

              <div style={{ background: "var(--bg-main)", borderRadius: "12px", padding: "16px", marginTop: "24px" }}>
                <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--secondary)", marginBottom: "4px" }}>
                  Delivery Address:
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  {selectedOrder.shippingAddress.fullName} • {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                </div>
              </div>

              <div style={{ marginTop: "24px", textAlign: "right" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Close Tracker
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
