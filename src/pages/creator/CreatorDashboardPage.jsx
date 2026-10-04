import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  Truck, 
  Award,
  ChevronRight
} from "lucide-react";
import { useCreator } from "../../context/CreatorContext";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";

export const CreatorDashboardPage = () => {
  const { creator, payouts } = useCreator();
  const { products } = useProducts();
  const { orders, updateOrderStatus } = useOrders();

  // Calculate seller-specific statistics
  const stats = useMemo(() => {
    // In our marketplace simulation, all orders are attributed to our primary verified artisan/creator
    const grossSales = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const platformFee = grossSales * (creator.commissionRate || 0.05);
    const netEarnings = grossSales - platformFee;
    
    // Total withdrawn so far
    const totalPaidOut = payouts
      .filter((p) => p.status === "Completed")
      .reduce((sum, p) => sum + Number(p.netAmount), 0);

    const availableBalance = Math.max(0, netEarnings - totalPaidOut);

    const pendingOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
    const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);

    return {
      grossSales: grossSales.toFixed(2),
      netEarnings: netEarnings.toFixed(2),
      availableBalance: availableBalance.toFixed(2),
      totalOrders: orders.length,
      pendingOrdersCount: pendingOrders.length,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length
    };
  }, [orders, products, payouts, creator]);

  const recentOrders = orders.slice(0, 5);

  return (
    <div style={{ background: "#0b0f19", minHeight: "calc(100vh - 120px)", color: "#f8fafc", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        
        {/* Welcome & Store Overview Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(49, 16, 66, 0.7) 100%)",
          borderRadius: "20px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "28px 32px",
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={creator.avatar}
              alt={creator.storeName}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "16px",
                objectFit: "cover",
                border: "3px solid #6366f1"
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  {creator.storeName}
                </h1>
                <span style={{
                  background: "#10b981",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <CheckCircle2 size={12} /> Verified Creator
                </span>
              </div>
              <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "0.9375rem" }}>
                Managed by {creator.creatorName} • Category: <strong style={{ color: "#e2e8f0" }}>{creator.category}</strong> • Joined {creator.joinedDate}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <Link
              to="/creator-store"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#f8fafc",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "10px 18px",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <span>Public Storefront</span>
              <ExternalLink size={14} />
            </Link>

            <Link
              to="/creator/products?action=add"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.875rem",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
              }}
            >
              <PlusCircle size={16} />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "32px"
        }}>
          {/* 1. Gross Revenue */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600 }}>Total Gross Sales</span>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(79, 70, 229, 0.2)", color: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              QAR {stats.grossSales}
            </div>
            <div style={{ fontSize: "0.8125rem", color: "#10b981", marginTop: "6px", fontWeight: 600 }}>
              +14.2% from customer orders
            </div>
          </div>

          {/* 2. Available Payout Balance */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px",
            position: "relative"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600 }}>Available for Payout</span>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399" }}>
              QAR {stats.availableBalance}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
              <span style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>Net (5% fee deducted)</span>
              <Link to="/creator/earnings" style={{ fontSize: "0.8125rem", color: "#818cf8", fontWeight: 700, textDecoration: "none" }}>
                Withdraw →
              </Link>
            </div>
          </div>

          {/* 3. Orders Received */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600 }}>Orders Received</span>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBag size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              {stats.totalOrders}
            </div>
            <div style={{ fontSize: "0.8125rem", color: stats.pendingOrdersCount > 0 ? "#f59e0b" : "#94a3b8", marginTop: "6px", fontWeight: 600 }}>
              {stats.pendingOrdersCount} orders needing fulfillment
            </div>
          </div>

          {/* 4. Active Catalog Products */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: 600 }}>Active Listings</span>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(236, 72, 153, 0.2)", color: "#f472b6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={20} />
              </div>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              {stats.totalProducts}
            </div>
            <div style={{ fontSize: "0.8125rem", color: stats.lowStockCount > 0 ? "#ef4444" : "#10b981", marginTop: "6px", fontWeight: 600 }}>
              {stats.lowStockCount > 0 ? `⚠️ ${stats.lowStockCount} items running low` : "All inventory stocked"}
            </div>
          </div>
        </div>

        {/* Two-Column Section: Recent Orders & Quick Store Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          
          {/* Left: Recent Customer Orders */}
          <div style={{
            background: "#131b2e",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
                  Incoming Customer Orders
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#94a3b8" }}>
                  Orders placed by shoppers that contain your creations
                </p>
              </div>
              <Link
                to="/creator/orders"
                style={{
                  color: "#818cf8",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span>View All Orders</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                No customer orders received yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentOrders.map((order) => {
                  const isDelivered = order.status === "Delivered";
                  const isShipped = order.status === "Shipped" || order.status === "Out for Delivery";

                  return (
                    <div
                      key={order.id}
                      style={{
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "12px"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9375rem" }}>
                            {order.id}
                          </span>
                          <span style={{
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: isDelivered ? "rgba(16, 185, 129, 0.15)" : isShipped ? "rgba(59, 130, 246, 0.15)" : "rgba(245, 158, 11, 0.15)",
                            color: isDelivered ? "#34d399" : isShipped ? "#60a5fa" : "#fbbf24",
                            border: `1px solid ${isDelivered ? "rgba(16, 185, 129, 0.3)" : isShipped ? "rgba(59, 130, 246, 0.3)" : "rgba(245, 158, 11, 0.3)"}`
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "4px" }}>
                          Customer: <strong style={{ color: "#e2e8f0" }}>{order.shippingAddress?.fullName || "Shopper"}</strong> • {order.items?.length || 1} item(s) • QAR {order.totalAmount}
                        </div>
                      </div>

                      {/* Quick Action button for seller fulfillment */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {!isDelivered && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = order.status === "Confirmed & Packed" ? "Shipped" : "Delivered";
                              updateOrderStatus(order.id, nextStatus);
                            }}
                            style={{
                              background: order.status === "Shipped" ? "#10b981" : "#4f46e5",
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
                            <span>{order.status === "Shipped" ? "Mark Delivered" : "Ship Order"}</span>
                          </button>
                        )}
                        <Link
                          to={`/creator/orders`}
                          style={{
                            color: "#94a3b8",
                            padding: "6px 10px",
                            fontSize: "0.8125rem",
                            textDecoration: "none"
                          }}
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Seller Performance & Quick Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Store Rating & Performance */}
            <div style={{
              background: "#131b2e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px", color: "#ffffff" }}>
                Seller Health & Trust
              </h3>

              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: "rgba(245, 158, 11, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fbbf24",
                  fontSize: "1.5rem",
                  fontWeight: 800
                }}>
                  ★ 4.9
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9375rem" }}>
                    Top Rated Artisan
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#94a3b8" }}>
                    {creator.reviewCount} customer reviews
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8125rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                  <span>On-Time Dispatch Rate</span>
                  <strong style={{ color: "#10b981" }}>98.4%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                  <span>Customer Satisfaction</span>
                  <strong style={{ color: "#10b981" }}>99.1%</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                  <span>Platform Commission</span>
                  <strong style={{ color: "#a5b4fc" }}>5% (Festive Creator Tier)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
                  <span>Payout Schedule</span>
                  <strong style={{ color: "#ffffff" }}>Instant UPI / Daily Bank</strong>
                </div>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div style={{
              background: "#131b2e",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: "24px"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px", color: "#ffffff" }}>
                Creator Studio Hub
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Link
                  to="/creator/products"
                  style={{
                    background: "#0b0f19",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    color: "#ffffff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "0.875rem",
                    fontWeight: 600
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Package size={16} color="#818cf8" /> Manage Products & Stock
                  </span>
                  <ChevronRight size={16} color="#64748b" />
                </Link>

                <Link
                  to="/creator/earnings"
                  style={{
                    background: "#0b0f19",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    color: "#ffffff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "0.875rem",
                    fontWeight: 600
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <DollarSign size={16} color="#34d399" /> Payouts & Banking
                  </span>
                  <ChevronRight size={16} color="#64748b" />
                </Link>

                <Link
                  to="/creator/profile"
                  style={{
                    background: "#0b0f19",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    color: "#ffffff",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "0.875rem",
                    fontWeight: 600
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Award size={16} color="#fbbf24" /> Store Brand Profile
                  </span>
                  <ChevronRight size={16} color="#64748b" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
