import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS } from "../data/products";
import { 
  getDb, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot 
} from "../services/firebase";

const OrderContext = createContext(null);
const ORDERS_STORAGE_KEY = "nanidoha_orders";

const INITIAL_ORDERS = [
  {
    id: "ND-948210",
    orderDate: "2026-09-26T14:32:00Z",
    estimatedDelivery: "2026-10-02",
    status: "Out for Delivery",
    items: [
      {
        id: "prod-2-Midnight Black-null",
        productId: "prod-2",
        product: PRODUCTS[1],
        quantity: 1,
        selectedColor: "Midnight Black",
        selectedSize: null
      },
      {
        id: "prod-11-Washed Slate Charcoal-L",
        productId: "prod-11",
        product: PRODUCTS[10],
        quantity: 2,
        selectedColor: "Washed Slate Charcoal",
        selectedSize: "L"
      }
    ],
    shippingAddress: {
      fullName: "Nani Doha",
      phone: "+974 5512 3456",
      street: "Villa 42, Street 810, Zone 66",
      area: "West Bay Lagoon",
      city: "Doha",
      country: "Qatar"
    },
    paymentMethod: "Credit Card (ending in •••• 4242)",
    subtotal: 439,
    discount: 43.9,
    shippingFee: 0,
    tax: 19.76,
    totalAmount: 414.86,
    trackingSteps: [
      { title: "Order Placed", date: "Sep 26, 02:32 PM", completed: true },
      { title: "Confirmed & Packed", date: "Sep 27, 09:15 AM", completed: true },
      { title: "Shipped from Hub", date: "Sep 28, 11:40 AM", completed: true },
      { title: "Out for Delivery", date: "Today, 08:30 AM", completed: true },
      { title: "Delivered", date: "Estimated Today by 6 PM", completed: false }
    ]
  },
  {
    id: "ND-820194",
    orderDate: "2026-09-12T10:15:00Z",
    estimatedDelivery: "2026-09-15",
    status: "Delivered",
    items: [
      {
        id: "prod-6-Gloss White-null",
        productId: "prod-6",
        product: PRODUCTS[5],
        quantity: 1,
        selectedColor: "Gloss White",
        selectedSize: null
      }
    ],
    shippingAddress: {
      fullName: "Nani Doha",
      phone: "+974 5512 3456",
      street: "Porto Arabia Tower 12, Floor 8, Suite 804",
      area: "The Pearl-Qatar",
      city: "Doha",
      country: "Qatar"
    },
    paymentMethod: "Cash on Delivery",
    subtotal: 199,
    discount: 0,
    shippingFee: 0,
    tax: 9.95,
    totalAmount: 208.95,
    trackingSteps: [
      { title: "Order Placed", date: "Sep 12, 10:15 AM", completed: true },
      { title: "Confirmed & Packed", date: "Sep 12, 01:20 PM", completed: true },
      { title: "Shipped from Hub", date: "Sep 13, 08:00 AM", completed: true },
      { title: "Out for Delivery", date: "Sep 14, 09:10 AM", completed: true },
      { title: "Delivered", date: "Sep 14, 03:45 PM", completed: true }
    ]
  }
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
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

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
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
