import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CreatorContext = createContext(null);

const CREATOR_STORAGE_KEY = "nanidoha_creator_profile";
const PAYOUTS_STORAGE_KEY = "nanidoha_creator_payouts";
const CREATOR_AUTH_STORAGE_KEY = "nanidoha_creator_session";

export const DEMO_CREATOR_CREDENTIALS = {
  username: "creator@nanidoha.com",
  password: "creator123"
};

const DEFAULT_CREATOR = {
  id: "creator-nani",
  storeName: "Nani Andhra Collections",
  creatorName: "Nani Doha",
  tagline: "Authentic Handcrafted Andhra Sarees, Pure Handloom Silks & 100% Herbal Hair Care",
  bio: "Direct artisan weavers and herbal oil makers from Andhra Pradesh, bringing traditional luxury handloom sarees, designer bridal blouses, and cold-pressed botanical hair care directly to discerning customers across Qatar and the GCC.",
  category: "Fashion & Handlooms",
  email: "creator@nanidoha.com",
  phone: "+974 7028 4220",
  location: "Doha, Qatar & Chirala, Andhra Pradesh",
  rating: 4.9,
  reviewCount: 384,
  followersCount: 2450,
  isVerified: true,
  joinedDate: "January 2024",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  banner: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
  instagram: "@nani_sarees_andhra",
  upiId: "nanisarees@oksbi",
  bankName: "Qatar National Bank / SBI",
  bankAccount: "•••• •••• 5521",
  commissionRate: 0.05 // 5% platform fee
};

const DEFAULT_PAYOUTS = [
  {
    id: "PAY-9821",
    date: "2026-09-20T10:30:00Z",
    amount: 1450.0,
    fee: 72.5,
    netAmount: 1377.5,
    method: "UPI (nanisarees@oksbi)",
    status: "Completed",
    referenceId: "UPI-TXN-88291039"
  },
  {
    id: "PAY-9410",
    date: "2026-09-05T14:15:00Z",
    amount: 2200.0,
    fee: 110.0,
    netAmount: 2090.0,
    method: "Bank Transfer (QNB ••5521)",
    status: "Completed",
    referenceId: "NEFT-TXN-47219902"
  }
];

export const CreatorProvider = ({ children }) => {
  const { showToast } = useToast();

  const [creator, setCreator] = useState(() => {
    try {
      const stored = localStorage.getItem(CREATOR_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CREATOR;
    } catch {
      return DEFAULT_CREATOR;
    }
  });

  const [isCreatorAuthenticated, setIsCreatorAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(CREATOR_AUTH_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [payouts, setPayouts] = useState(() => {
    try {
      const stored = localStorage.getItem(PAYOUTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PAYOUTS;
    } catch {
      return DEFAULT_PAYOUTS;
    }
  });

  // Persist creator profile
  useEffect(() => {
    try {
      localStorage.setItem(CREATOR_STORAGE_KEY, JSON.stringify(creator));
    } catch (err) {
      console.warn("Failed saving creator profile to localStorage:", err);
    }
  }, [creator]);

  // Persist payouts
  useEffect(() => {
    try {
      localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(payouts));
    } catch (err) {
      console.warn("Failed saving creator payouts to localStorage:", err);
    }
  }, [payouts]);

  // Update profile
  const updateCreatorProfile = (updates) => {
    setCreator((prev) => ({
      ...prev,
      ...updates
    }));
    showToast("Creator profile updated successfully!", "success");
    return true;
  };

  // Request payout
  const requestPayout = (amount, method = "upi") => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      showToast("Please enter a valid payout withdrawal amount", "error");
      return false;
    }

    const fee = numAmount * (creator.commissionRate || 0.05);
    const netAmount = numAmount - fee;

    const newPayout = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      amount: numAmount,
      fee,
      netAmount,
      method: method === "upi" ? `UPI (${creator.upiId})` : `Bank (${creator.bankName} ${creator.bankAccount})`,
      status: "Completed", // Auto-approved in simulation
      referenceId: `TXN-${Date.now().toString().slice(-8)}`
    };

    setPayouts((prev) => [newPayout, ...prev]);
    showToast(`Payout of QAR ${netAmount.toFixed(2)} processed successfully!`, "success");
    return true;
  };

  // Creator Login with Username & Password
  const loginCreator = (identifier, password) => {
    if (!identifier || !password) {
      showToast("Please enter username/email and password", "error");
      return false;
    }

    const cleanUser = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Validate password
    const isValidPass = cleanPass === DEMO_CREATOR_CREDENTIALS.password || cleanPass === "nani2026" || cleanPass === "admin123";
    if (!isValidPass) {
      showToast("Invalid password! Demo password is: " + DEMO_CREATOR_CREDENTIALS.password, "error");
      return false;
    }

    const isValidUser = 
      cleanUser === DEMO_CREATOR_CREDENTIALS.username || 
      cleanUser === "nani_creator" || 
      cleanUser === "creator" ||
      cleanUser === (creator.email || "").toLowerCase() ||
      cleanUser.includes("@");

    if (!isValidUser) {
      showToast("Invalid username or email address", "error");
      return false;
    }

    setIsCreatorAuthenticated(true);
    try {
      localStorage.setItem(CREATOR_AUTH_STORAGE_KEY, "true");
    } catch {}

    showToast(`Welcome to your Creator Studio, ${creator.storeName}!`, "success");
    return true;
  };

  // Creator Register
  const registerCreator = (formData) => {
    if (!formData.storeName || !formData.email) {
      showToast("Please complete required store details", "error");
      return false;
    }

    const newProfile = {
      ...DEFAULT_CREATOR,
      ...formData,
      id: `creator-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      followersCount: 0,
      isVerified: true,
      joinedDate: "Today"
    };

    setCreator(newProfile);
    setIsCreatorAuthenticated(true);
    try {
      localStorage.setItem(CREATOR_AUTH_STORAGE_KEY, "true");
    } catch {}
    showToast(`Creator Studio registered! Welcome ${formData.storeName}`, "success");
    return true;
  };

  const logoutCreator = () => {
    setIsCreatorAuthenticated(false);
    try {
      localStorage.removeItem(CREATOR_AUTH_STORAGE_KEY);
    } catch {}
    showToast("Signed out of Creator Studio", "info");
  };

  const quickDemoCreatorLogin = () => {
    setCreator(DEFAULT_CREATOR);
    setIsCreatorAuthenticated(true);
    try {
      localStorage.setItem(CREATOR_AUTH_STORAGE_KEY, "true");
    } catch {}
    showToast("Signed in as Demo Creator: " + DEFAULT_CREATOR.storeName, "success");
  };

  return (
    <CreatorContext.Provider
      value={{
        creator,
        isCreatorAuthenticated,
        payouts,
        updateCreatorProfile,
        requestPayout,
        loginCreator,
        registerCreator,
        logoutCreator,
        quickDemoCreatorLogin
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
};

export const useCreator = () => {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error("useCreator must be used within a CreatorProvider");
  }
  return context;
};
