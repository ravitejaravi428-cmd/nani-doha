import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { 
  getDb, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc,
  getDocs,
  onSnapshot 
} from "../services/firebase";

const OrderContext = createContext(null);
const ORDERS_STORAGE_KEY = "nanidoha_orders";
const ORDERS_CLEARED_FLAG = "nanidoha_orders_fresh_v3";

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      // Check if we need to clean up legacy mock orders
      const hasCleanedLegacy = localStorage.getItem(ORDERS_CLEARED_FLAG);
      if (!hasCleanedLegacy) {
        localStorage.removeItem(ORDERS_STORAGE_KEY);
        localStorage.setItem(ORDERS_CLEARED_FLAG, "true");
        return [];
      }

      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // If parsed orders only contain legacy IDs (ND-948210, ND-820194), wipe them
        const isLegacyOnly = parsed.every((o) => o.id === "ND-948210" || o.id === "ND-820194");
        if (isLegacyOnly) {
          localStorage.removeItem(ORDERS_STORAGE_KEY);
          return [];
        }
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  // Listen to Firestore orders collection if connected
  useEffect(() => {
    let unsubscribe = null;
    try {
      const db = getDb();
      if (db) {
        const ordersCol = collection(db, "orders");
        unsubscribe = onSnapshot(
          ordersCol,
          (snapshot) => {
            if (!snapshot.empty) {
              const liveOrders = [];
              snapshot.forEach((d) => {
                liveOrders.push({ id: d.id, ...d.data() });
              });
              // Sort newest first
              liveOrders.sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0));
              setOrders(liveOrders);
              try {
                localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(liveOrders));
              } catch (e) {}
            }
          },
          (err) => console.warn("Firestore orders onSnapshot error:", err)
        );
      }
    } catch (err) {
      console.warn("Firestore orders sync init failed:", err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const createOrder = async ({ items, shippingAddress, paymentMethod, totals }) => {
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ND-${orderNum}`;
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + 3);

    const newOrder = {
      id: orderId,
      orderDate: now.toISOString(),
      estimatedDelivery: deliveryDate.toISOString().split("T")[0],
      status: "Confirmed",
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        selectedColor: item.selectedColor || null,
        selectedSize: item.selectedSize || null,
        product: {
          id: item.product?.id,
          name: item.product?.name,
          price: item.product?.price,
          images: item.product?.images || [],
          category: item.product?.category || "general"
        }
      })),
      shippingAddress: { ...shippingAddress },
      paymentMethod,
      subtotal: totals.subtotal,
      discount: totals.couponDiscount || 0,
      shippingFee: totals.shippingFee || 0,
      tax: totals.taxAmount || 0,
      totalAmount: totals.totalAmount,
      trackingSteps: [
        {
          title: "Order Placed",
          date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true
        },
        { title: "Confirmed & Packed", date: "Processing", completed: true },
        { title: "Shipped", date: "Estimated Tomorrow", completed: false },
        { title: "Out for Delivery", date: "In 2 days", completed: false },
        {
          title: "Delivered",
          date: `Estimated ${deliveryDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          completed: false
        }
      ]
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Send to Firestore asynchronously if connected
    const db = getDb();
    if (db) {
      setDoc(doc(db, "orders", orderId), newOrder).catch((err) => {
        console.warn("Firestore order sync:", err);
      });
    }

    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedSteps = (order.trackingSteps || []).map((step) => {
          if (newStatus === "Delivered") return { ...step, completed: true };
          if (newStatus === "Out for Delivery" && step.title !== "Delivered") return { ...step, completed: true };
          if (newStatus === "Shipped" && ["Order Placed", "Confirmed & Packed", "Shipped"].includes(step.title)) return { ...step, completed: true };
          return step;
        });
        return {
          ...order,
          status: newStatus,
          trackingSteps: updatedSteps
        };
      })
    );

    const db = getDb();
    if (db) {
      try {
        await setDoc(doc(db, "orders", orderId), { status: newStatus }, { merge: true });
      } catch (err) {
        console.error("Failed updating order status in Firestore:", err);
      }
    }
  };

  const deleteOrder = async (orderId) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const db = getDb();
    if (db) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
      } catch (err) {
        console.warn("Failed deleting order in Firestore:", err);
      }
    }
  };

  const clearAllOrders = async () => {
    setOrders([]);
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
    } catch (e) {}

    const db = getDb();
    if (db) {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        snapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "orders", docSnap.id));
        });
      } catch (err) {
        console.warn("Failed clearing orders in Firestore:", err);
      }
    }
  };

  const createTrialOrder = async (preset = "saree") => {
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ND-${orderNum}`;
    const now = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(now.getDate() + 2);

    const sareeProd = PRODUCTS.find((p) => p.category === "sarees") || PRODUCTS[0];
    const oilProd = PRODUCTS.find((p) => p.category === "beauty" || p.name.toLowerCase().includes("oil")) || PRODUCTS[1] || PRODUCTS[0];

    let items = [];
    let subtotal = 0;
    let discount = 0;

    if (preset === "oil") {
      items = [
        {
          id: `item-${oilProd.id}-${Date.now()}`,
          productId: oilProd.id,
          quantity: 2,
          selectedColor: "100% Pure Botanical",
          selectedSize: "200ml Family Pack",
          product: {
            id: oilProd.id,
            name: oilProd.name,
            price: oilProd.price,
            images: oilProd.images || [],
            category: oilProd.category || "beauty",
            brand: oilProd.brand || "Nani Organics"
          }
        }
      ];
      subtotal = oilProd.price * 2;
      discount = 0;
    } else if (preset === "combo") {
      items = [
        {
          id: `item-${sareeProd.id}-${Date.now()}-1`,
          productId: sareeProd.id,
          quantity: 1,
          selectedColor: sareeProd.colors?.[0]?.name || "Royal Sapphire Blue",
          selectedSize: "Free Size (5.5m + Blouse)",
          product: {
            id: sareeProd.id,
            name: sareeProd.name,
            price: sareeProd.price,
            images: sareeProd.images || [],
            category: sareeProd.category || "sarees",
            brand: sareeProd.brand || "Nani Andhra Sarees"
          }
        },
        {
          id: `item-${oilProd.id}-${Date.now()}-2`,
          productId: oilProd.id,
          quantity: 1,
          selectedColor: "Cold-Pressed Herb Infusion",
          selectedSize: "200ml",
          product: {
            id: oilProd.id,
            name: oilProd.name,
            price: oilProd.price,
            images: oilProd.images || [],
            category: oilProd.category || "beauty",
            brand: oilProd.brand || "Nani Organics"
          }
        }
      ];
      subtotal = sareeProd.price + oilProd.price;
      discount = Number((sareeProd.price * 0.1).toFixed(2)); // 10% coupon
    } else {
      // Default: Saree trial order
      items = [
        {
          id: `item-${sareeProd.id}-${Date.now()}`,
          productId: sareeProd.id,
          quantity: 1,
          selectedColor: sareeProd.colors?.[0]?.name || "Royal Sapphire Blue",
          selectedSize: "Free Size (5.5m + Blouse)",
          product: {
            id: sareeProd.id,
            name: sareeProd.name,
            price: sareeProd.price,
            images: sareeProd.images || [],
            category: sareeProd.category || "sarees",
            brand: sareeProd.brand || "Nani Andhra Sarees"
          }
        }
      ];
      subtotal = sareeProd.price;
      discount = Number((sareeProd.price * 0.1).toFixed(2));
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Number((taxableAmount * 0.05).toFixed(2));
    const totalAmount = Number((taxableAmount + tax).toFixed(2));

    const trialAddresses = [
      {
        fullName: "Fatima Al-Thani (Official Trial)",
        phone: "+974 7028 4220",
        street: "Tower 14, Porto Arabia, Suite 1204",
        area: "The Pearl-Qatar",
        city: "Doha",
        country: "Qatar",
        landmark: "Marina Promenade Gate 3"
      },
      {
        fullName: "Mohammed Al-Sulaiti (Official Trial)",
        phone: "+974 7028 4220",
        street: "Villa 38, Street 705, Zone 66",
        area: "West Bay Lagoon",
        city: "Doha",
        country: "Qatar",
        landmark: "Near Lagoona Mall & Katara"
      },
      {
        fullName: "Ravi Teja (Qatar Concierge Trial)",
        phone: "+974 7028 4220",
        street: "Marina Residence Tower 2, Lusail City",
        area: "Lusail Marina",
        city: "Lusail",
        country: "Qatar",
        landmark: "Opposite Lusail Promenade"
      }
    ];

    const chosenAddr = trialAddresses[Math.floor(Math.random() * trialAddresses.length)];

    const trialOrder = {
      id: orderId,
      orderDate: now.toISOString(),
      estimatedDelivery: deliveryDate.toISOString().split("T")[0],
      status: "Confirmed",
      isTrialOrder: true,
      items,
      shippingAddress: chosenAddr,
      paymentMethod: "Cash on Delivery (Qatar Express)",
      subtotal,
      discount,
      shippingFee: 0,
      tax,
      totalAmount,
      trackingSteps: [
        {
          title: "Order Placed",
          date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          completed: true
        },
        { title: "Confirmed & Packed", date: "Artisan Quality Check Complete", completed: true },
        { title: "Shipped from Hub", date: "Scheduled for Qatar Flight Express", completed: false },
        { title: "Out for Delivery", date: "Local Doha Courier", completed: false },
        {
          title: "Delivered",
          date: `Estimated ${deliveryDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          completed: false
        }
      ]
    };

    setOrders((prev) => {
      const updated = [trialOrder, ...prev];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const db = getDb();
    if (db) {
      setDoc(doc(db, "orders", orderId), trialOrder).catch((err) => {
        console.warn("Firestore trial order sync:", err);
      });
    }

    return trialOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        clearAllOrders,
        createTrialOrder,
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
