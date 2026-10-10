import React, { createContext, useContext, useState, useEffect } from "react";
import { PRODUCTS as DEFAULT_PRODUCTS } from "../data/products";
import { 
  getDb, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from "../services/firebase";

const ProductContext = createContext(null);
const LOCAL_STORAGE_PRODUCTS_KEY = "nanidoha_dynamic_products";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If cached products contain old offer poster thumbnails for sarees, sanitize with default images
          const sanitized = parsed.map((p) => {
            if (p.id?.startsWith("saree-") && p.images?.[0]?.includes("/images/offers/")) {
              const defaultMatch = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id);
              return defaultMatch ? { ...p, images: defaultMatch.images } : p;
            }
            return p;
          });
          return sanitized;
        }
      }
    } catch (e) {
      console.warn("Failed reading cached products:", e);
    }
    return DEFAULT_PRODUCTS;
  });

  const [loading, setLoading] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  // Sync with Firestore if available
  useEffect(() => {
    let unsubscribe = null;
    try {
      const db = getDb();
      if (db) {
        setIsCloudConnected(true);
        const colRef = collection(db, "products");

        unsubscribe = onSnapshot(
          colRef,
          (snapshot) => {
            if (!snapshot.empty) {
              const liveProducts = [];
              snapshot.forEach((docItem) => {
                liveProducts.push({ id: docItem.id, ...docItem.data() });
              });
              setProducts(liveProducts);
              try {
                localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(liveProducts));
              } catch (e) {}
            } else {
              // Cloud collection is empty: we can auto-seed or keep local
              console.log("Firestore products collection is empty.");
            }
          },
          (err) => {
            console.warn("Firestore products onSnapshot error:", err);
            setIsCloudConnected(false);
          }
        );
      } else {
        setIsCloudConnected(false);
      }
    } catch (err) {
      console.warn("Firestore connection attempt failed:", err);
      setIsCloudConnected(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save to local storage whenever products state changes
  const persistLocally = (updated) => {
    setProducts(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const addProduct = async (productData) => {
    const newId = productData.id || `prod-custom-${Date.now()}`;
    const newProduct = {
      ...productData,
      id: newId,
      createdAt: new Date().toISOString()
    };

    const updated = [newProduct, ...products];
    persistLocally(updated);

    const db = getDb();
    if (db) {
      try {
        await setDoc(doc(db, "products", newId), newProduct);
      } catch (err) {
        console.error("Failed saving product to Firestore:", err);
      }
    }
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persistLocally(updated);

    const db = getDb();
    if (db) {
      try {
        await setDoc(doc(db, "products", id), updates, { merge: true });
      } catch (err) {
        console.error("Failed updating product in Firestore:", err);
      }
    }
  };

  const deleteProduct = async (id) => {
    const updated = products.filter((p) => p.id !== id);
    persistLocally(updated);

    const db = getDb();
    if (db) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        console.error("Failed deleting product from Firestore:", err);
      }
    }
  };

  // Seed default products to Firestore
  const seedCloudWithDefaults = async () => {
    const db = getDb();
    if (!db) {
      throw new Error("Cloud database is not connected. Add Firebase configuration first.");
    }
    setLoading(true);
    try {
      for (const prod of DEFAULT_PRODUCTS) {
        await setDoc(doc(db, "products", prod.id), prod, { merge: true });
      }
      return true;
    } catch (err) {
      console.error("Failed seeding products to Firestore:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    persistLocally(DEFAULT_PRODUCTS);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        isCloudConnected,
        setIsCloudConnected,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaults,
        seedCloudWithDefaults
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
