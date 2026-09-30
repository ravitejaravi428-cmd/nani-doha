import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "nanidoha_cart";
const SAVED_STORAGE_KEY = "nanidoha_saved";
const COUPON_STORAGE_KEY = "nanidoha_coupon";

const AVAILABLE_COUPONS = {
  SAREE10: { code: "SAREE10", discountPercent: 10, description: "10% off All Festive Sarees" },
  NANI5: { code: "NANI5", discountPercent: 5, description: "5% off నాని ఆంధ్ర చీరలు" },
  NANI10: { code: "NANI10", discountPercent: 10, description: "10% off entire order" },
  DOHA20: { code: "DOHA20", discountPercent: 20, description: "20% Exclusive Doha deal" },
  FREESHIP: { code: "FREESHIP", freeShipping: true, description: "Free standard shipping" }
};

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();

  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedForLater));
  }, [savedForLater]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const color = selectedColor || (product.colors && product.colors[0]?.name) || "Standard";
    const size = selectedSize || (product.sizes && product.sizes[0]) || null;
    const cartItemId = `${product.id}-${color}-${size || "onesize"}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            product,
            quantity,
            selectedColor: color,
            selectedSize: size
          }
        ];
      }
    });

    showToast(`Added "${product.name.slice(0, 28)}..." to your cart!`, "success");
  };

  const removeFromCart = (cartItemId) => {
    const item = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    if (item) {
      showToast(`Removed "${item.product.name.slice(0, 24)}..." from cart`, "info");
    }
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: Math.min(newQuantity, 99) } : item
      )
    );
  };

  const saveForLater = (cartItemId) => {
    const itemToSave = cart.find((i) => i.id === cartItemId);
    if (!itemToSave) return;

    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    setSavedForLater((prev) => {
      const exists = prev.some((i) => i.id === itemToSave.id);
      return exists ? prev : [itemToSave, ...prev];
    });

    showToast(`Saved "${itemToSave.product.name.slice(0, 24)}..." for later`, "info");
  };

  const moveToCart = (savedItemId) => {
    const itemToMove = savedForLater.find((i) => i.id === savedItemId);
    if (!itemToMove) return;

    setSavedForLater((prev) => prev.filter((i) => i.id !== savedItemId));
    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === itemToMove.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += itemToMove.quantity || 1;
        return updated;
      }
      return [...prev, itemToMove];
    });

    showToast(`Moved "${itemToMove.product.name.slice(0, 24)}..." to cart`, "success");
  };

  const removeFromSaved = (savedItemId) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== savedItemId));
    showToast("Removed item from saved list", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (AVAILABLE_COUPONS[cleanCode]) {
      setAppliedCoupon(AVAILABLE_COUPONS[cleanCode]);
      showToast(`Coupon "${cleanCode}" applied successfully!`, "success");
      return { success: true };
    } else {
      showToast("Invalid promo code. Try SAREE10, NANI5, NANI10, or DOHA20", "error");
      return { success: false, message: "Invalid promo code" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Promo coupon removed", "info");
  };

  // Calculations
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const originalSubtotal = cart.reduce(
    (acc, item) => acc + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );
  const catalogDiscount = originalSubtotal - subtotal;

  let couponDiscount = 0;
  let isFreeShipping = subtotal >= 100 || (appliedCoupon && appliedCoupon.freeShipping);

  if (appliedCoupon && appliedCoupon.discountPercent) {
    couponDiscount = (subtotal * appliedCoupon.discountPercent) / 100;
  }

  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 15;
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const taxAmount = +(taxableAmount * 0.05).toFixed(2); // 5% VAT
  const totalAmount = Math.max(0, taxableAmount + shippingFee + taxAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        savedForLater,
        itemCount,
        subtotal,
        originalSubtotal,
        catalogDiscount,
        couponDiscount,
        appliedCoupon,
        shippingFee,
        taxAmount,
        totalAmount,
        isFreeShipping,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        removeFromSaved,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
