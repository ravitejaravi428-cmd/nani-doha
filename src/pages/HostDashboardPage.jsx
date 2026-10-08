import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  ShoppingBag, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Phone, 
  MapPin, 
  Database, 
  RefreshCw, 
  Search, 
  DollarSign, 
  AlertCircle, 
  ExternalLink,
  Save,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useOrders } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import { getActiveFirebaseConfig, saveFirebaseConfig, getDb } from "../services/firebase";
import { notifyHostOnWhatsApp, getHostOrderWhatsAppUrl } from "../utils/whatsapp";

export const HostDashboardPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, seedCloudWithDefaults, isCloudConnected, setIsCloudConnected } = useProducts();
  const { orders, updateOrderStatus, deleteOrder, clearAllOrders, createTrialOrder } = useOrders();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "products" | "database"
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // Add Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "sarees",
    subcategory: "Festive Collection",
    price: "",
    originalPrice: "",
    stock: "25",
    badge: "NEW ARRIVAL",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
  });

  // Database Config State
  const [dbConfig, setDbConfig] = useState(() => {
    const active = getActiveFirebaseConfig();
    return {
      apiKey: active?.apiKey || "",
      authDomain: active?.authDomain || "",
      projectId: active?.projectId || "",
      storageBucket: active?.storageBucket || "",
      messagingSenderId: active?.messagingSenderId || "",
      appId: active?.appId || ""
    };
  });
  const [isSeeding, setIsSeeding] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const pendingOrders = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
    const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
    return {
      totalRevenue: totalRev.toFixed(2),
      totalOrders: orders.length,
      pendingOrders,
      totalProducts: products.length,
      lowStock
    };
  }, [orders, products]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === "all") return orders;
    return orders.filter((o) => o.status.toLowerCase().includes(orderStatusFilter.toLowerCase()));
  }, [orders, orderStatusFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          (p.category && p.category.toLowerCase().includes(productSearch.toLowerCase()));
      const matchCat = productCategoryFilter === "all" || p.category === productCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  // Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "sarees",
      subcategory: "Festive Collection",
      price: "",
      originalPrice: "",
      stock: "25",
      badge: "NEW ARRIVAL",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    });
    setIsAddProductOpen(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category || "sarees",
      subcategory: prod.subcategory || "",
      price: prod.price || "",
      originalPrice: prod.originalPrice || "",
      stock: prod.stock || "10",
      badge: prod.badge || "",
      description: prod.description || "",
      imageUrl: prod.images?.[0] || ""
    });
    setIsAddProductOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast("Please enter product name and price", "error");
      return;
    }

    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        subcategory: productForm.subcategory,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : parseFloat(productForm.price) * 1.2,
        stock: parseInt(productForm.stock) || 10,
        badge: productForm.badge || null,
        description: productForm.description,
        rating: editingProduct ? editingProduct.rating : 4.9,
        reviewCount: editingProduct ? editingProduct.reviewCount : 1,
        images: [productForm.imageUrl]
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast("Product updated successfully! Customers now see the update.", "success");
      } else {
        await addProduct(payload);
        showToast("New product published live to catalog!", "success");
      }
      setIsAddProductOpen(false);
    } catch (err) {
      showToast("Error saving product: " + err.message, "error");
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (window.confirm(`Are you sure you want to delete "${prodName}" from the store?`)) {
      await deleteProduct(prodId);
      showToast("Product deleted from store", "info");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} marked as ${newStatus}`, "success");
  };

  const handleClearAllOrders = async () => {
    if (window.confirm("⚠️ Are you sure you want to clear ALL orders from the admin list? This will reset your orders to fresh.")) {
      await clearAllOrders();
      showToast("All orders cleared! Admin list is now fresh and ready.", "info");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Delete Order #${orderId} permanently?`)) {
      await deleteOrder(orderId);
      showToast(`Order #${orderId} removed from admin list.`, "info");
    }
  };

  const handleCreateTrialOrder = async (preset = "saree") => {
    const newOrder = await createTrialOrder(preset);
    showToast(`Official Trial Order #${newOrder.id} generated! WhatsApp alert dispatched to Host (+974 7028 4220).`, "success");
    notifyHostOnWhatsApp(newOrder);
  };

  const handleSaveFirebaseKeys = (e) => {
    e.preventDefault();
    if (!dbConfig.projectId || !dbConfig.apiKey) {
      showToast("Please fill in Project ID and API Key", "error");
      return;
    }

    const db = saveFirebaseConfig(dbConfig);
    if (db) {
      setIsCloudConnected(true);
      showToast("Firebase Cloud Database connected successfully!", "success");
    } else {
      showToast("Failed to initialize Firebase with provided keys", "error");
    }
  };

  const handleSeedProducts = async () => {
    if (!window.confirm("Upload all default store products to Firebase Firestore?")) return;
    setIsSeeding(true);
    try {
      await seedCloudWithDefaults();
      showToast("All products uploaded to Firebase Firestore!", "success");
    } catch (err) {
      showToast("Failed to seed: " + err.message, "error");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Top Header Bar */}
        <div style={{ 
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
          borderRadius: "16px", 
          padding: "2rem", 
          color: "#fff", 
          marginBottom: "2rem",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <span style={{ 
                  background: "linear-gradient(135deg, #f59e0b, #d97706)", 
                  padding: "0.35rem 0.75rem", 
                  borderRadius: "999px", 
                  fontSize: "0.75rem", 
                  fontWeight: 700, 
                  letterSpacing: "0.05em",
                  textTransform: "uppercase" 
                }}>
                  Store Host & Admin
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem" }}>
                  <span style={{ 
                    display: "inline-block", 
                    width: "10px", 
                    height: "10px", 
                    borderRadius: "50%", 
                    backgroundColor: isCloudConnected ? "#10b981" : "#f59e0b",
                    boxShadow: isCloudConnected ? "0 0 10px #10b981" : "none"
                  }} />
                  <span style={{ color: isCloudConnected ? "#34d399" : "#fbbf24", fontWeight: 600 }}>
                    {isCloudConnected ? "Live Cloud Connected (Firebase)" : "Local Storage Mode (Ready to Sync)"}
                  </span>
                </div>
              </div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Nani Doha Store Control Panel</h1>
              <p style={{ color: "#94a3b8", margin: "0.4rem 0 0 0", fontSize: "0.95rem" }}>
                Manage live products, customer orders, and cloud database synchronization in real-time.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link 
                to="/products" 
                target="_blank"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                <ExternalLink size={16} /> View Store As Customer
              </Link>
              <button
                onClick={handleOpenAddProduct}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  backgroundColor: "#d97706",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                <PlusCircle size={18} /> Add New Product
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "1rem", 
            marginTop: "2rem" 
          }}>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>Total Revenue</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.3rem" }}>QAR {stats.totalRevenue}</div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>Total Customer Orders</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#4ade80", marginTop: "0.3rem" }}>{stats.totalOrders}</div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>Pending Deliveries</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fbbf24", marginTop: "0.3rem" }}>{stats.pendingOrders}</div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px", padding: "1.2rem", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 600 }}>Live Products in Store</div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f472b6", marginTop: "0.3rem" }}>{stats.totalProducts}</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              backgroundColor: activeTab === "orders" ? "#0f172a" : "transparent",
              color: activeTab === "orders" ? "#fff" : "#64748b"
            }}
          >
            <Package size={18} />
            Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("products")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              backgroundColor: activeTab === "products" ? "#0f172a" : "transparent",
              color: activeTab === "products" ? "#fff" : "#64748b"
            }}
          >
            <ShoppingBag size={18} />
            Products & Inventory ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("database")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              backgroundColor: activeTab === "database" ? "#0f172a" : "transparent",
              color: activeTab === "database" ? "#fff" : "#64748b"
            }}
          >
            <Database size={18} />
            Cloud Database Settings
          </button>
        </div>

        {/* TAB 1: CUSTOMER ORDERS */}
        {activeTab === "orders" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                {["all", "Confirmed", "Shipped", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      border: "1px solid #cbd5e1",
                      backgroundColor: orderStatusFilter === status ? "#0f172a" : "#fff",
                      color: orderStatusFilter === status ? "#fff" : "#334155",
                      cursor: "pointer"
                    }}
                  >
                    {status === "all" ? `All Orders (${orders.length})` : status}
                  </button>
                ))}
              </div>

              {/* Order Actions: Clear All Orders and Quick Trial Orders */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                {orders.length > 0 && (
                  <button
                    onClick={handleClearAllOrders}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #fecaca",
                      backgroundColor: "#fef2f2",
                      color: "#dc2626",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                    title="Clear all orders to start fresh"
                  >
                    <Trash2 size={15} /> Clear All Orders
                  </button>
                )}

                <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                  <button
                    onClick={() => handleCreateTrialOrder("saree")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #fed7aa",
                      backgroundColor: "#fff7ed",
                      color: "#ea580c",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                    title="Generate an official trial order with Festive Silk Saree"
                  >
                    <Sparkles size={15} /> + Saree Trial Order
                  </button>
                  <button
                    onClick={() => handleCreateTrialOrder("oil")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.45rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #bbf7d0",
                      backgroundColor: "#f0fdf4",
                      color: "#16a34a",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                    title="Generate an official trial order with Nani Organic Hair Oil"
                  >
                    <Sparkles size={15} /> + Hair Oil Trial Order
                  </button>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{ background: "#fff", padding: "3.5rem 2rem", textAlign: "center", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <div style={{ width: "64px", height: "64px", margin: "0 auto 1.25rem", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={32} style={{ color: "#16a34a" }} />
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>
                  Admin Order List is Clear & Ready!
                </h3>
                <p style={{ color: "#64748b", maxWidth: "560px", margin: "0 auto 1.5rem", fontSize: "0.925rem", lineHeight: 1.6 }}>
                  The store is running in clean official mode with 0 legacy orders. You can now start fresh by creating test trial orders below or shopping directly from the customer storefront!
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleCreateTrialOrder("saree")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.65rem 1.25rem",
                      backgroundColor: "#ea580c",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer"
                    }}
                  >
                    <Sparkles size={16} /> Create Saree Trial Order
                  </button>
                  <button
                    onClick={() => handleCreateTrialOrder("oil")}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.65rem 1.25rem",
                      backgroundColor: "#16a34a",
                      color: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      cursor: "pointer"
                    }}
                  >
                    <Sparkles size={16} /> Create Hair Oil Trial Order
                  </button>
                  <Link
                    to="/products"
                    target="_blank"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.65rem 1.25rem",
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "0.9rem"
                    }}
                  >
                    <ExternalLink size={16} /> Shop Live as Customer
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {filteredOrders.map((order) => {
                  const whatsappPhone = (order.shippingAddress?.phone || "").replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=Hello%20${encodeURIComponent(order.shippingAddress?.fullName || "Valued Customer")},%20regarding%20your%20order%20%23${order.id}%20from%20Nani%20Doha...`;

                  return (
                    <div 
                      key={order.id} 
                      style={{ 
                        background: "#fff", 
                        borderRadius: "12px", 
                        padding: "1.5rem", 
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1rem", marginBottom: "1rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>Order #{order.id}</span>
                            <span style={{ 
                              padding: "0.25rem 0.6rem", 
                              borderRadius: "999px", 
                              fontSize: "0.75rem", 
                              fontWeight: 700,
                              backgroundColor: order.status === "Delivered" ? "#dcfce7" : order.status === "Shipped" ? "#e0e7ff" : "#fef3c7",
                              color: order.status === "Delivered" ? "#15803d" : order.status === "Shipped" ? "#4338ca" : "#b45309"
                            }}>
                              {order.status}
                            </span>
                            {order.isTrialOrder && (
                              <span style={{
                                padding: "0.2rem 0.6rem",
                                borderRadius: "999px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                backgroundColor: "#fef3c7",
                                color: "#b45309",
                                border: "1px solid #fde68a"
                              }}>
                                🧪 Trial Order
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.3rem" }}>
                            Placed on: {new Date(order.orderDate).toLocaleString()} • Payment: <strong style={{ color: "#334155" }}>{order.paymentMethod}</strong>
                          </div>
                        </div>

                        {/* Host Status & Management Actions */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            style={{
                              padding: "0.4rem 0.8rem",
                              borderRadius: "6px",
                              border: "1px solid #cbd5e1",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                              backgroundColor: "#f8fafc",
                              cursor: "pointer"
                            }}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <a
                            href={getHostOrderWhatsAppUrl(order)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.4rem 0.8rem",
                              backgroundColor: "#15803d",
                              color: "#fff",
                              borderRadius: "6px",
                              textDecoration: "none",
                              fontSize: "0.85rem",
                              fontWeight: 700
                            }}
                            title="Send full order alert to Host WhatsApp (+974 7028 4220)"
                          >
                            <MessageCircle size={14} /> WhatsApp Host (+974 7028 4220)
                          </a>

                          {whatsappPhone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                padding: "0.4rem 0.8rem",
                                backgroundColor: "#25d366",
                                color: "#fff",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontSize: "0.85rem",
                                fontWeight: 700
                              }}
                              title="Chat with Customer on WhatsApp"
                            >
                              <Phone size={14} /> WhatsApp Customer
                            </a>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              padding: "0.4rem 0.75rem",
                              backgroundColor: "#fff",
                              border: "1px solid #fca5a5",
                              color: "#dc2626",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                            title="Delete this order from admin list"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Customer Details & Items Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                            Customer & Delivery Address
                          </div>
                          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>
                            {order.shippingAddress?.fullName}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                            <Phone size={14} /> {order.shippingAddress?.phone}
                          </div>
                          <div style={{ fontSize: "0.9rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.2rem" }}>
                            <MapPin size={14} /> {order.shippingAddress?.street}, {order.shippingAddress?.area}, {order.shippingAddress?.city}, {order.shippingAddress?.country}
                          </div>
                          {order.shippingAddress?.landmark && (
                            <div style={{ fontSize: "0.825rem", color: "#059669", marginTop: "0.25rem" }}>
                              📍 {order.shippingAddress.landmark}
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                            Items Ordered ({order.items?.length || 0})
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                            {order.items?.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                                <span style={{ color: "#334155" }}>
                                  <strong>{item.quantity}x</strong> {item.product?.name || "Product"} 
                                  {item.selectedColor ? ` (${item.selectedColor})` : ""}
                                </span>
                                <span style={{ fontWeight: 600, color: "#0f172a" }}>
                                  QAR {((item.product?.price || 0) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div style={{ borderTop: "1px dashed #cbd5e1", marginTop: "0.75rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: "1.05rem" }}>
                            <span>Total Amount:</span>
                            <span style={{ color: "#0f172a" }}>QAR {Number(order.totalAmount).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", flex: 1, maxWidth: "500px" }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Search products by title or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem 0.6rem 2.2rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.9rem"
                    }}
                  />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9rem"
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="sarees">Festive Sarees</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion & Clothing</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddProduct}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.65rem 1.25rem",
                  backgroundColor: "#0f172a",
                  color: "#fff",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer"
                }}
              >
                <PlusCircle size={18} /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                    <th style={{ padding: "0.75rem 1rem" }}>Product</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Category</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Price</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Stock</th>
                    <th style={{ padding: "0.75rem 1rem" }}>Badge</th>
                    <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img 
                          src={prod.images?.[0] || "https://placehold.co/80x80"} 
                          alt={prod.name} 
                          style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, color: "#0f172a", maxWidth: "320px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {prod.name}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>ID: {prod.id}</div>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", textTransform: "capitalize", color: "#475569" }}>
                        {prod.category}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "#0f172a" }}>
                        ${prod.price} {prod.originalPrice > prod.price && <span style={{ textDecoration: "line-through", color: "#94a3b8", fontWeight: 400, fontSize: "0.8rem" }}>${prod.originalPrice}</span>}
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        <span style={{ 
                          padding: "0.2rem 0.5rem", 
                          borderRadius: "4px", 
                          fontSize: "0.8rem", 
                          fontWeight: 700,
                          backgroundColor: prod.stock <= 5 ? "#fee2e2" : "#dcfce7",
                          color: prod.stock <= 5 ? "#ef4444" : "#16a34a"
                        }}>
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem" }}>
                        {prod.badge ? (
                          <span style={{ padding: "0.2rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, backgroundColor: "#fef3c7", color: "#b45309" }}>
                            {prod.badge}
                          </span>
                        ) : "-"}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleEditProduct(prod)}
                            title="Edit Product"
                            style={{
                              padding: "0.4rem",
                              backgroundColor: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <Edit3 size={15} style={{ color: "#334155" }} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            title="Delete Product"
                            style={{
                              padding: "0.4rem",
                              backgroundColor: "#fee2e2",
                              border: "1px solid #fca5a5",
                              borderRadius: "6px",
                              cursor: "pointer"
                            }}
                          >
                            <Trash2 size={15} style={{ color: "#ef4444" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CLOUD DATABASE SETTINGS */}
        {activeTab === "database" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            
            {/* Database Connection Form */}
            <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Database size={24} style={{ color: "#d97706" }} />
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>Firebase Cloud Sync Setup</h2>
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
                Connect your free Firebase Firestore database so that whenever customers place an order or you add new products, everything updates across all mobile phones and computers in real-time.
              </p>

              <form onSubmit={handleSaveFirebaseKeys} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Project ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. nani-doha-store"
                    value={dbConfig.projectId}
                    onChange={(e) => setDbConfig({ ...dbConfig, projectId: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    API Key *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AIzaSy..."
                    value={dbConfig.apiKey}
                    onChange={(e) => setDbConfig({ ...dbConfig, apiKey: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Auth Domain (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. nani-doha-store.firebaseapp.com"
                    value={dbConfig.authDomain}
                    onChange={(e) => setDbConfig({ ...dbConfig, authDomain: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Storage Bucket (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. nani-doha-store.appspot.com"
                    value={dbConfig.storageBucket}
                    onChange={(e) => setDbConfig({ ...dbConfig, storageBucket: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.75rem",
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                >
                  <Save size={18} /> Save & Connect Cloud Database
                </button>
              </form>

              {isCloudConnected && (
                <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: "#0f172a" }}>Cloud Database Actions</h4>
                  <button
                    onClick={handleSeedProducts}
                    disabled={isSeeding}
                    style={{
                      width: "100%",
                      padding: "0.65rem",
                      backgroundColor: "#f59e0b",
                      color: "#fff",
                      borderRadius: "6px",
                      border: "none",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <RefreshCw size={16} className={isSeeding ? "spin" : ""} />
                    {isSeeding ? "Uploading Products..." : "Upload All 20+ Store Products to Firestore"}
                  </button>
                </div>
              )}
            </div>

            {/* Quick 2-Minute Setup Instructions */}
            <div style={{ background: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Sparkles size={24} style={{ color: "#10b981" }} />
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, margin: 0 }}>How to get your free Firebase keys:</h3>
              </div>

              <ol style={{ paddingLeft: "1.2rem", color: "#475569", lineHeight: 1.8, fontSize: "0.9rem" }}>
                <li>
                  Go to <strong><a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>Firebase Console</a></strong> and sign in with your Google account.
                </li>
                <li>
                  Click <strong>"Add project"</strong>, name it (e.g. <code>nani-doha</code>), and click continue.
                </li>
                <li>
                  In your project dashboard, click the <strong>Web (&lt;/&gt;) icon</strong> to register a web app.
                </li>
                <li>
                  Copy the <code>firebaseConfig</code> values (like <code>apiKey</code>, <code>projectId</code>) and paste them in the form on the left.
                </li>
                <li>
                  In the Firebase sidebar, click <strong>Build → Firestore Database</strong>, click <strong>"Create Database"</strong>, and choose <strong>"Start in test mode"</strong>.
                </li>
                <li>
                  That's it! Any product you add or customer order placed will instantly sync across all devices in real-time!
                </li>
              </ol>

              <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#166534", fontWeight: 700, fontSize: "0.9rem" }}>
                  <ShieldCheck size={18} /> Zero Server Maintenance
                </div>
                <div style={{ fontSize: "0.85rem", color: "#15803d", marginTop: "0.3rem" }}>
                  Firebase free tier gives 50,000 reads and 20,000 writes every single day with no credit card required.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isAddProductOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            maxWidth: "600px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "2rem",
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Silk Festive Saree with Designer Blouse"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="sarees">Festive Sarees</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion & Clothing</option>
                    <option value="home">Home & Living</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Subcategory / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Silk Sarees, Earbuds"
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="135"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="150"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
                {productForm.imageUrl && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <img 
                      src={productForm.imageUrl} 
                      alt="Preview" 
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }} 
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Promo Badge (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10% OFF OFFER, BESTSELLER, HOT DEAL"
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Product specifications, features, fabric care, etc..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #cbd5e1", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  style={{
                    padding: "0.65rem 1.25rem",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.65rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0f172a",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 700
                  }}
                >
                  {editingProduct ? "Update Product" : "Publish Product Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
