import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";

const STORAGE_KEY_FIREBASE_CONFIG = "nanidoha_firebase_config";

/**
 * Retrieves Firebase configuration from environment variables or localStorage (set via Host Panel).
 */
export const getActiveFirebaseConfig = () => {
  try {
    const customConfig = localStorage.getItem(STORAGE_KEY_FIREBASE_CONFIG);
    if (customConfig) {
      const parsed = JSON.parse(customConfig);
      if (parsed.projectId && parsed.apiKey) {
        return { ...parsed, source: "custom" };
      }
    }
  } catch (e) {
    console.warn("Failed reading custom Firebase config:", e);
  }

  // Check Vite environment variables
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  if (envConfig.projectId && envConfig.apiKey) {
    return { ...envConfig, source: "env" };
  }

  return null;
};

let appInstance = null;
let dbInstance = null;

export const initFirebase = (config = null) => {
  const activeConfig = config || getActiveFirebaseConfig();
  if (!activeConfig || !activeConfig.projectId) {
    return null;
  }

  try {
    appInstance = !getApps().length ? initializeApp(activeConfig) : getApp();
    dbInstance = getFirestore(appInstance);
    return dbInstance;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return null;
  }
};

export const getDb = () => {
  if (!dbInstance) {
    return initFirebase();
  }
  return dbInstance;
};

export const saveFirebaseConfig = (config) => {
  try {
    if (!config || !config.projectId) {
      localStorage.removeItem(STORAGE_KEY_FIREBASE_CONFIG);
    } else {
      localStorage.setItem(STORAGE_KEY_FIREBASE_CONFIG, JSON.stringify(config));
    }
    // Re-initialize
    appInstance = null;
    dbInstance = null;
    return initFirebase(config);
  } catch (e) {
    console.error("Failed to save Firebase config:", e);
    return null;
  }
};

export {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
};
