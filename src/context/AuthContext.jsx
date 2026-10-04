import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

const USER_STORAGE_KEY = "nanidoha_user";
const ADDRESSES_STORAGE_KEY = "nanidoha_addresses";

const DEFAULT_USER = {
  id: "usr-demo-01",
  name: "Nani Qatar Customer",
  email: "customer@nanidoha.com",
  phone: "+974 7028 4220",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  tier: "Qatar VIP Member",
  memberSince: "January 2024",
  loyaltyPoints: 1250
};

const DEFAULT_ADDRESSES = [
  {
    id: "addr-1",
    fullName: "Nani Doha Customer",
    phone: "+974 7028 4220",
    building: "Villa 42",
    street: "Street 810",
    zone: "Zone 66",
    area: "West Bay Lagoon",
    city: "Doha",
    country: "Qatar",
    landmark: "Near West Bay Beach & Katara",
    isDefault: true,
    type: "Home"
  },
  {
    id: "addr-2",
    fullName: "Nani Doha Customer",
    phone: "+974 7028 4220",
    building: "Porto Arabia Tower 12, Floor 8",
    street: "Main Marina Promenade",
    zone: "Zone 66",
    area: "The Pearl-Qatar",
    city: "Doha",
    country: "Qatar",
    landmark: "Near Monoprix & Marina Gate 4",
    isDefault: false,
    type: "Residence"
  },
  {
    id: "addr-3",
    fullName: "Nani Doha Customer",
    phone: "+974 7028 4220",
    building: "Villa 18, Compound 3",
    street: "Al Wukair Main Road",
    zone: "Zone 90",
    area: "Al Wukair",
    city: "Al Wakrah",
    country: "Qatar",
    landmark: "Behind Al Meera Supermarket",
    isDefault: false,
    type: "Family Villa"
  }
];

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USER; // Default logged in for instant seamless demo testing
    } catch {
      return DEFAULT_USER;
    }
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
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

  const login = (email, password) => {
    if (!email || !password) {
      showToast("Please enter both email and password", "error");
      return false;
    }
    // Simulate authentication
    const loggedInUser = {
      id: "usr-" + Date.now(),
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: "+974 5512 3456",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      tier: "Silver Member",
      memberSince: "Today",
      loyaltyPoints: 100
    };
    setUser(loggedInUser);
    showToast(`Welcome back, ${loggedInUser.name}!`, "success");
    return true;
  };

  const register = (name, email, password, phone = "+974 5512 3456") => {
    if (!name || !email || !password) {
      showToast("Please fill in all required registration fields", "error");
      return false;
    }
    const newUser = {
      id: "usr-" + Date.now(),
      name,
      email,
      phone,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      tier: "Welcome Tier",
      memberSince: "New Member",
      loyaltyPoints: 200
    };
    setUser(newUser);
    showToast(`Account created! Welcome to NANI DOHA, ${name}!`, "success");
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast("You have been signed out.", "info");
  };

  const quickDemoLogin = () => {
    setUser(DEFAULT_USER);
    showToast("Signed in as Demo User (Nani Doha)", "success");
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
      ...address
    };
    if (newAddr.isDefault) {
      setSavedAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setSavedAddresses((prev) => [...prev, newAddr]);
    }
    showToast("Address saved successfully", "success");
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
        logout,
        quickDemoLogin,
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
