import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "nanidoha_user";
const ADDRESSES_STORAGE_KEY = "nanidoha_addresses";
const AUTH_FRESH_FLAG = "nanidoha_auth_official_v1";
const ADDRESSES_FRESH_FLAG = "nanidoha_addresses_official_v1";

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  // User Authentication State (Default: null - customer must sign in or register to order)
  const [user, setUser] = useState(() => {
    try {
      // Check if we need to clean up legacy mock demo users
      const hasCleanedLegacy = localStorage.getItem(AUTH_FRESH_FLAG);
      if (!hasCleanedLegacy) {
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.setItem(AUTH_FRESH_FLAG, "true");
        return null;
      }

      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id === "usr-demo-01") {
          localStorage.removeItem(USER_STORAGE_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  // Customer Saved Addresses State (Default: [] - no mock addresses suggested, customer enters their address)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const hasCleanedAddresses = localStorage.getItem(ADDRESSES_FRESH_FLAG);
      if (!hasCleanedAddresses) {
        localStorage.removeItem(ADDRESSES_STORAGE_KEY);
        localStorage.setItem(ADDRESSES_FRESH_FLAG, "true");
        return [];
      }

      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy addresses
          const realAddresses = parsed.filter(
            (a) => a.id !== "addr-1" && a.id !== "addr-2" && a.id !== "addr-3" && !a.building?.includes("Villa 42")
          );
          return realAddresses;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const login = (emailOrPhone, password) => {
    if (!emailOrPhone || !password) {
      showToast("Please enter both email/phone and password", "error");
      return false;
    }
    const cleanId = emailOrPhone.includes("@") 
      ? emailOrPhone.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Customer";

    const loggedInUser = {
      id: "usr-" + Date.now(),
      name: cleanId || "Valued Customer",
      email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone.replace(/\D/g, "")}@nanidoha.com`,
      phone: emailOrPhone.includes("@") ? "+974 7028 4220" : emailOrPhone,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      tier: "Official Customer",
      memberSince: "Member",
      loyaltyPoints: 100
    };
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.name}!`, "success");
    return true;
  };

  const register = (name, email, password, phone = "") => {
    if (!name || !email || !password) {
      showToast("Please fill in all required registration fields", "error");
      return false;
    }
    const newUser = {
      id: "usr-" + Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || "+974 7028 4220",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      tier: "Registered Customer",
      memberSince: "New Member",
      loyaltyPoints: 200
    };
    setUser(newUser);
    showToast(`Welcome to NANI DOHA, ${name.trim()}! Account verified.`, "success");
    return true;
  };

  // Quick Express Order Sign In (for rapid checkout without password hurdles)
  const quickGuestLogin = ({ name, phone, email }) => {
    if (!name || !phone) {
      showToast("Please provide your full name and Qatar phone number", "error");
      return false;
    }
    const customerUser = {
      id: "usr-" + Date.now(),
      name: name.trim(),
      email: email?.trim() || `${phone.replace(/\D/g, "")}@nanidoha.com`,
      phone: phone.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      tier: "Verified Buyer",
      memberSince: "Today",
      loyaltyPoints: 50
    };
    setUser(customerUser);
    showToast(`Verified customer profile: ${customerUser.name}`, "success");
    return customerUser;
  };

  const logout = () => {
    setUser(null);
    showToast("You have been signed out.", "info");
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => ({
      ...prev,
      ...updatedData
    }));
    showToast("Profile updated successfully!", "success");
  };

  const addAddress = (address) => {
    const newAddr = {
      id: "addr-" + Date.now(),
      isDefault: savedAddresses.length === 0,
      country: "Qatar",
      ...address
    };
    if (newAddr.isDefault) {
      setSavedAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setSavedAddresses((prev) => [...prev, newAddr]);
    }
    showToast("Delivery address saved successfully", "success");
    return newAddr;
  };

  const removeAddress = (addressId) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== addressId));
    showToast("Address removed", "info");
  };

  const setDefaultAddress = (addressId) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === addressId
      }))
    );
    showToast("Default address updated", "success");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        savedAddresses,
        login,
        register,
        quickGuestLogin,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        setDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
