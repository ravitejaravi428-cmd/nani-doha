import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  X, 
  Save
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import { CATEGORIES } from "../../data/categories";

export const CreatorProductsPage = () => {
  const [searchParams] = useSearchParams();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    category: "sarees",
    subcategory: "Festive Collection",
    price: "",
    originalPrice: "",
    stock: "25",
    badge: "ARTISAN CRAFTED",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
  });

  const handleOpenAdd = useCallback(() => {
    setEditingProduct(null);
    setForm({
      name: "",
      category: "sarees",
      subcategory: "Handloom Collection",
      price: "",
      originalPrice: "",
      stock: "20",
      badge: "NEW CREATION",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    });
    setIsModalOpen(true);
  }, []);

  // Auto-open modal if URL has ?action=add
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      handleOpenAdd();
    }
  }, [searchParams, handleOpenAdd]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category || "sarees",
      subcategory: p.subcategory || "",
      price: p.price,
      originalPrice: p.originalPrice || "",
      stock: p.stock || "10",
      badge: p.badge || "",
      description: p.description || "",
      imageUrl: p.images?.[0] || ""
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast("Please enter product title and price", "error");
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      subcategory: form.subcategory,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : parseFloat(form.price) * 1.2,
      stock: parseInt(form.stock) || 10,
      badge: form.badge || null,
      description: form.description,
      brand: "Nani Andhra Collections",
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      images: [form.imageUrl],
      colors: editingProduct?.colors || [{ name: "Artisan Original", hex: "#4f46e5" }],
      sizes: editingProduct?.sizes || ["Standard Free Size"]
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showToast("Product listing updated successfully! Shoppers now see the new details.", "success");
      } else {
        await addProduct(payload);
        showToast("New product published live to Nani Doha marketplace!", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast("Failed to save product", "error");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your catalog?`)) {
      await deleteProduct(id);
      showToast("Product removed from marketplace", "info");
    }
  };

  const handleStockAdjust = async (product, delta) => {
    const newStock = Math.max(0, (parseInt(product.stock) || 0) + delta);
    await updateProduct(product.id, { stock: newStock });
    showToast(`Stock updated to ${newStock}`, "success");
  };

  return (
    <div style={{ background: "#0b0f19", minHeight: "calc(100vh - 120px)", color: "#f8fafc", padding: "32px 20px 80px" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        
        {/* Header Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "28px"
        }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
              Product Catalog & Stock Management
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "#94a3b8" }}>
              Publish, modify, or replenish items available for customers to order
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
            }}
          >
            <PlusCircle size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters & Search Bar */}
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
          {/* Search box */}
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search by product title or keyword..."
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

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "0.8125rem", color: "#94a3b8", fontWeight: 600 }}>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                background: "#0b0f19",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "8px 14px",
                color: "#ffffff",
                fontSize: "0.875rem"
              }}
            >
              <option value="all">All Categories ({products.length})</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Catalog Table */}
        <div style={{
          background: "#131b2e",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#0b0f19", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94a3b8", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "14px 20px" }}>Product</th>
                <th style={{ padding: "14px 16px" }}>Category</th>
                <th style={{ padding: "14px 16px" }}>Price</th>
                <th style={{ padding: "14px 16px" }}>Inventory Stock</th>
                <th style={{ padding: "14px 16px" }}>Status</th>
                <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const stockNum = parseInt(item.stock) || 0;
                  const isLow = stockNum <= 5;
                  const isOutOfStock = stockNum === 0;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                        transition: "background 0.15s"
                      }}
                    >
                      {/* Product image & title */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <img
                            src={item.images?.[0] || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"}
                            alt={item.name}
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "8px",
                              objectFit: "cover",
                              border: "1px solid rgba(255, 255, 255, 0.1)"
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.875rem", maxWidth: "340px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", gap: "8px", marginTop: "2px" }}>
                              <span>ID: {item.id}</span>
                              {item.badge && <span style={{ color: "#f59e0b", fontWeight: 600 }}>• {item.badge}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "16px", fontSize: "0.8125rem", color: "#cbd5e1" }}>
                        <span style={{
                          background: "rgba(255, 255, 255, 0.06)",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem"
                        }}>
                          {item.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.9375rem" }}>
                          QAR {item.price}
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "line-through" }}>
                            QAR {item.originalPrice}
                          </div>
                        )}
                      </td>

                      {/* Stock controls */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item, -1)}
                            disabled={stockNum <= 0}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              background: "rgba(255, 255, 255, 0.1)",
                              color: "#ffffff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold"
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            fontWeight: 700,
                            minWidth: "32px",
                            textAlign: "center",
                            fontSize: "0.875rem",
                            color: isOutOfStock ? "#ef4444" : isLow ? "#f59e0b" : "#ffffff"
                          }}>
                            {stockNum}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(item, 1)}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "4px",
                              background: "rgba(255, 255, 255, 0.1)",
                              color: "#ffffff",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontWeight: "bold"
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ fontSize: "0.7rem", marginTop: "4px", color: isOutOfStock ? "#ef4444" : isLow ? "#f59e0b" : "#10b981" }}>
                          {isOutOfStock ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px" }}>
                        <span style={{
                          background: isOutOfStock ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                          color: isOutOfStock ? "#f87171" : "#34d399",
                          border: `1px solid ${isOutOfStock ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)"}`,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: isOutOfStock ? "#f87171" : "#34d399" }} />
                          {isOutOfStock ? "Hidden/Empty" : "Live in Store"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <Link
                            to={`/product/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View as customer"
                            style={{
                              color: "#94a3b8",
                              padding: "6px",
                              borderRadius: "6px",
                              background: "rgba(255, 255, 255, 0.05)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Product"
                            style={{
                              color: "#818cf8",
                              padding: "6px",
                              borderRadius: "6px",
                              background: "rgba(99, 102, 241, 0.1)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Edit3 size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            title="Delete Product"
                            style={{
                              color: "#f87171",
                              padding: "6px",
                              borderRadius: "6px",
                              background: "rgba(239, 68, 68, 0.1)",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Product Modal */}
        {isModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000
          }}>
            <div style={{
              background: "#131b2e",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>
                  {editingProduct ? "Edit Product Details" : "Create New Product Listing"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Product Name */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Handloom Silk Saree with Zari Border"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#0b0f19",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>

                {/* Category & Subcategory */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#ffffff",
                        fontSize: "0.875rem"
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                      Collection / Subcategory
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Festive Handlooms"
                      value={form.subcategory}
                      onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#ffffff",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>
                </div>

                {/* Price, Original Price, Stock */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                      Price (QAR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="120"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#ffffff",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                      Original Price (QAR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="150"
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#ffffff",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                      Initial Stock *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="25"
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#ffffff",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>
                </div>

                {/* Badge Tag */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Promo Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10% OFF OFFER, BESTSELLER, ARTISAN CHOICE"
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#0b0f19",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "0.875rem"
                    }}
                  />
                </div>

                {/* Image URL & Preview */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Image URL
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      style={{
                        flex: 1,
                        background: "#0b0f19",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        color: "#ffffff",
                        fontSize: "0.875rem"
                      }}
                    />
                  </div>
                  {form.imageUrl && (
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        style={{ width: "64px", height: "64px", borderRadius: "8px", objectFit: "cover", border: "1px solid rgba(255, 255, 255, 0.1)" }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Image preview loaded</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "#cbd5e1", marginBottom: "6px" }}>
                    Product Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the fabric, craft, origin, or usage..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    style={{
                      width: "100%",
                      background: "#0b0f19",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      color: "#ffffff",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      resize: "vertical"
                    }}
                  />
                </div>

                {/* Submit buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "none",
                      color: "#cbd5e1",
                      padding: "10px 18px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      border: "none",
                      color: "#ffffff",
                      padding: "10px 24px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)"
                    }}
                  >
                    <Save size={16} />
                    <span>{editingProduct ? "Update Product" : "Publish to Store"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
