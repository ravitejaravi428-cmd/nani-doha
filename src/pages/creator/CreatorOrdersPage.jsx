import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Calendar,
  Trash2,
  Sparkles,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import { useToast } from "../../context/ToastContext";
import { notifyHostOnWhatsApp, getHostOrderWhatsAppUrl } from "../../utils/whatsapp";

export const CreatorOrdersPage = () => {
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders, createTrialOrder } = useOrders();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.shippingAddress?.fullName && order.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.shippingAddress?.city && order.shippingAddress.city.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchStatus = true;
      if (statusFilter === "pending") {
        matchStatus = order.status === "Order Placed" || order.status === "Pending";
      } else if (statusFilter === "packed") {
        matchStatus = order.status === "Confirmed & Packed";
      } else if (statusFilter === "shipped") {
        matchStatus = order.status === "Shipped" || order.status === "Out for Delivery";
      } else if (statusFilter === "delivered") {
        matchStatus = order.status === "Delivered";
      }

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} status updated to: ${newStatus}. Customer tracking timeline synchronized!`, "success");
  };

  const handleClearAllOrders = async () => {
    if (window.confirm("⚠️ Clear ALL orders from the creator/admin list?")) {
      await clearAllOrders();
      showToast("All orders cleared! List is now empty.", "info");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Delete Order #${orderId} permanently?`)) {
      await deleteOrder(orderId);
      showToast(`Order #${orderId} removed.`, "info");
    }
  };

  const handleCreateTrialOrder = async (preset = "saree") => {
    const newOrder = await createTrialOrder(preset);
    showToast(`Official Trial Order #${newOrder.id} generated! WhatsApp alert dispatched to Host (+974 7028 4220).`, "success");
    notifyHostOnWhatsApp(newOrder);
  };

  return (
    <div style={{ background: "#0b0f19", minHeight: "calc(100vh - 120px)", color: "#f8fafc", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
              Orders Received & Fulfillment
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#94a3b8" }}>
              Manage customer purchases, pack shipments, and dispatch orders across Qatar & GCC
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {orders.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllOrders}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Trash2 size={14} /> Clear All Orders
              </button>
            )}

            <button
              type="button"
              onClick={() => handleCreateTrialOrder("saree")}
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#ffffff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Sparkles size={14} /> + Saree Trial Order
            </button>

            <button
              type="button"
              onClick={() => handleCreateTrialOrder("oil")}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#ffffff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <Sparkles size={14} /> + Hair Oil Trial Order
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: "#131b2e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "24px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by Order ID, customer name, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "10px 14px 10px 38px",
                color: "#ffffff",
                fontSize: "0.875rem"
              }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { id: "all", label: "All Orders", count: orders.length },
              { id: "pending", label: "New / Pending", count: orders.filter((o) => o.status === "Order Placed" || o.status === "Pending").length },
              { id: "packed", label: "Packed", count: orders.filter((o) => o.status === "Confirmed & Packed").length },
              { id: "shipped", label: "Dispatched", count: orders.filter((o) => o.status === "Shipped" || o.status === "Out for Delivery").length },
              { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "Delivered").length }
            ].map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    background: active ? "#4f46e5" : "#0b0f19",
                    color: active ? "#ffffff" : "#94a3b8",
                    border: `1px solid ${active ? "#6366f1" : "rgba(255, 255, 255, 0.08)"}`,
                    padding: "8px 14px",
                    borderRadius: "8px",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    background: active ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                    padding: "1px 6px",
                    borderRadius: "10px",
                    fontSize: "0.7rem"
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "60px 20px",
            textAlign: "center",
            color: "#94a3b8"
          }}>
            <ShoppingBag size={48} style={{ margin: "0 auto 16px", opacity: 0.5, color: "#10b981" }} />
            <h3 style={{ color: "#ffffff", fontSize: "1.25rem", margin: "0 0 8px", fontWeight: 800 }}>
              Orders List Cleared & Ready
            </h3>
            <p style={{ margin: "0 auto 20px", fontSize: "0.875rem", maxWidth: "520px", lineHeight: 1.6 }}>
              All legacy admin orders have been cleared. You are ready to receive live purchases or generate official trial orders to verify the full dispatch flow.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleCreateTrialOrder("saree")}
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Sparkles size={16} /> + Generate Saree Trial Order
              </button>
              <button
                type="button"
                onClick={() => handleCreateTrialOrder("oil")}
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Sparkles size={16} /> + Generate Hair Oil Trial Order
              </button>
              <Link
                to="/products"
                target="_blank"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <ExternalLink size={16} /> Shop Live as Customer
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredOrders.map((order) => {
              const isDelivered = order.status === "Delivered";
              const isShipped = order.status === "Shipped" || order.status === "Out for Delivery";
              const isPacked = order.status === "Confirmed & Packed";

              return (
                <div
                  key={order.id}
                  style={{
                    background: "#131b2e",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    overflow: "hidden"
                  }}
                >
                  {/* Order Card Header */}
                  <div style={{
                    background: "#0b0f19",
                    padding: "16px 24px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff" }}>
                        Order #{order.id}
                      </span>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: isDelivered ? "rgba(16, 185, 129, 0.15)" : isShipped ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
                        color: isDelivered ? "#34d399" : isShipped ? "#60a5fa" : "#fbbf24",
                        border: `1px solid ${isDelivered ? "rgba(16, 185, 129, 0.3)" : isShipped ? "rgba(59, 130, 246, 0.3)" : "rgba(245, 158, 11, 0.3)"}`
                      }}>
                        {order.status}
                      </span>
                      <span style={{ color: "#94a3b8", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={13} /> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Order Total:</span>
                      <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff" }}>
                        QAR {order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Order Content: 2-column (Customer info & Items ordered) */}
                  <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "24px" }}>
                    
                    {/* Left: Customer & Shipping Details */}
                    <div style={{ background: "#0b0f19", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", color: "#818cf8", marginBottom: "12px" }}>
                        Shipping & Customer Details
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.875rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ffffff", fontWeight: 600 }}>
                          <User size={15} color="#94a3b8" />
                          <span>{order.shippingAddress?.fullName || "Shopper Customer"}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1" }}>
                          <Phone size={15} color="#94a3b8" />
                          <span>{order.shippingAddress?.phone || "+974 5512 3456"}</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#94a3b8" }}>
                          <MapPin size={15} color="#94a3b8" style={{ marginTop: "3px", flexShrink: 0 }} />
                          <span>
                            {order.shippingAddress?.street}, {order.shippingAddress?.area}, {order.shippingAddress?.city}, {order.shippingAddress?.country || "Qatar"}
                          </span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a5b4fc", marginTop: "4px" }}>
                          <CreditCard size={15} />
                          <span>{order.paymentMethod || "Prepaid"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Items Ordered */}
                    <div>
                      <div style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", color: "#818cf8", marginBottom: "12px" }}>
                        Products Ordered ({order.items?.length || 0})
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "#0b0f19",
                              padding: "10px 14px",
                              borderRadius: "10px",
                              border: "1px solid rgba(255, 255, 255, 0.05)"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <img
                                src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"}
                                alt={item.product?.name || "Product"}
                                style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
                              />
                              <div>
                                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#ffffff", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {item.product?.name || "Handcrafted Luxury Item"}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                  Qty: {item.quantity} {item.selectedColor ? `• Color: ${item.selectedColor}` : ""} {item.selectedSize ? `• Size: ${item.selectedSize}` : ""}
                                </div>
                              </div>
                            </div>

                            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.875rem" }}>
                              QAR {(item.product?.price || 0) * (item.quantity || 1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Order Status Action Footer */}
                  <div style={{
                    background: "#0b0f19",
                    padding: "14px 24px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8125rem", color: "#94a3b8" }}>
                      <span>Update Fulfillment Status:</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, "Confirmed & Packed")}
                        style={{
                          background: isPacked ? "#312e81" : "rgba(255, 255, 255, 0.08)",
                          color: isPacked ? "#a5b4fc" : "#cbd5e1",
                          border: `1px solid ${isPacked ? "#6366f1" : "rgba(255, 255, 255, 0.1)"}`,
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        ✓ Mark Packed
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, "Shipped")}
                        style={{
                          background: order.status === "Shipped" ? "#1e3a8a" : "#4f46e5",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <Truck size={14} />
                        <span>Dispatch & Ship</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(order.id, "Delivered")}
                        style={{
                          background: isDelivered ? "#064e3b" : "#10b981",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Mark Delivered</span>
                      </button>

                      <a
                        href={getHostOrderWhatsAppUrl(order)}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: "rgba(34, 197, 94, 0.15)",
                          color: "#4ade80",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                        title="Send full order notification to Host WhatsApp (+974 7028 4220)"
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp Host (+974 7028 4220)</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          color: "#f87171",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                        title="Delete order permanently"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
