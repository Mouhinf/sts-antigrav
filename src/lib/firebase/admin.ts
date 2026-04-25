import type admin from "firebase-admin";
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

let _adminApp: admin.app.App | null = null;
let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

const getPrivateKey = () => {
  let key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  if (!key) return key;
  
  // Remove outer quotes if present
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  
  // Replace \n with actual newlines - handle multiple patterns
  key = key.replace(/\\n/g, '\n');
  
  return key;
};

const isConfigured = () => {
  return !!(process.env.FIREBASE_ADMIN_PROJECT_ID && 
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
    process.env.FIREBASE_ADMIN_PRIVATE_KEY);
};

export const getAdminDb = async (): Promise<Firestore | null> => {
  if (!_adminDb && isConfigured()) {
    const { default: admin } = await import('firebase-admin');
    
    if (!_adminApp) {
      // Decode the key properly
      const privateKey = getPrivateKey();
      
      _adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }
    _adminDb = _adminApp.firestore();
  }
  return _adminDb;
};

export const getAdminAuth = async (): Promise<Auth | null> => {
  if (!_adminAuth && isConfigured()) {
    const { default: admin } = await import('firebase-admin');
    
    if (!_adminApp) {
      const privateKey = getPrivateKey();
      _adminApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
    }
    _adminAuth = _adminApp.auth();
  }
  return _adminAuth;
};

// For backward compatibility - sync versions (use async ones when possible)
export const adminDb: Firestore | null = null;
export const adminAuth: Auth | null = null;
export const adminApp: admin.app.App | null = null;