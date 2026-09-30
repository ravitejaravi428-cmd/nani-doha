import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = "nanidoha_wishlist";

export const WishlistProvider = ({ children }) => {
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name.slice(0, 24)}..." from wishlist`, "info");
    } else {
      setWishlist((prev) => [product, ...prev]);
      showToast(`Added "${product.name.slice(0, 24)}..." to your wishlist!`, "success");
    }
  };

  const removeFromWishlist = (productId) => {
    const item = wishlist.find((i) => i.id === productId);
    setWishlist((prev) => prev.filter((i) => i.id !== productId));
    if (item) {
      showToast(`Removed "${item.name.slice(0, 24)}..." from wishlist`, "info");
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
