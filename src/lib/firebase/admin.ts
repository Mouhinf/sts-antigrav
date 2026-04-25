import type admin from "firebase-admin";
import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

let _adminApp: admin.app.App | null = null;
let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

const getPrivateKey = () => {
  let key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  if (!key) return key;
  
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  
  key = key.replace(/\\n/g, '\n');
  
  return key;
};

const isConfigured = () => {
  return !!(process.env.FIREBASE_ADMIN_PROJECT_ID && 
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
    process.env.FIREBASE_ADMIN_PRIVATE_KEY);
};

const initAdminApp = async (): Promise<admin.app.App> => {
  if (_adminApp) return _adminApp;
  
  const { default: admin } = await import('firebase-admin');
  
  // Check if there's already a default app
  try {
    if (admin.apps.length > 0) {
      _adminApp = admin.apps[0];
      return _adminApp;
    }
  } catch (e) {
    // Ignore
  }
  
  const privateKey = getPrivateKey();
  
  _adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  }, 'sts-admin-app');
  
  return _adminApp;
};

export const getAdminDb = async (): Promise<Firestore | null> => {
  if (!_adminDb && isConfigured()) {
    const app = await initAdminApp();
    _adminDb = app.firestore();
  }
  return _adminDb;
};

export const getAdminAuth = async (): Promise<Auth | null> => {
  if (!_adminAuth && isConfigured()) {
    const app = await initAdminApp();
    _adminAuth = app.auth();
  }
  return _adminAuth;
};

export const adminDb: Firestore | null = null;
export const adminAuth: Auth | null = null;
export const adminApp: admin.app.App | null = null;