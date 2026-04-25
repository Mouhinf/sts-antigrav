import admin from "firebase-admin";

if (typeof window !== 'undefined') {
  throw new Error("Le SDK Firebase Admin ne peut pas être utilisé côté client.");
}

const getPrivateKey = () => {
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  return key.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
};

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: getPrivateKey(),
};

const isConfigured = 
  process.env.FIREBASE_ADMIN_PROJECT_ID && 
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
  process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let _adminApp: admin.app.App | null = null;
let _adminDb: admin.firestore.Firestore | null = null;
let _adminAuth: admin.auth.Auth | null = null;

export const getAdminApp = () => {
  if (!_adminApp && isConfigured) {
    _adminApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
  }
  return _adminApp;
};

export const getAdminDb = () => {
  if (!_adminDb) {
    const app = getAdminApp();
    if (app) _adminDb = app.firestore();
  }
  return _adminDb;
};

export const getAdminAuth = () => {
  if (!_adminAuth) {
    const app = getAdminApp();
    if (app) _adminAuth = app.auth();
  }
  return _adminAuth;
};

// Export initialized instances - use these directly
// The build will succeed; runtime will throw if not configured
export const adminApp = getAdminApp()!;
export const adminDb = getAdminDb()!;
export const adminAuth = getAdminAuth()!;