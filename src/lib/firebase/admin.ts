import admin from "firebase-admin";

if (typeof window !== 'undefined') {
  throw new Error("Le SDK Firebase Admin ne peut pas être utilisé côté client.");
}

const getPrivateKey = () => {
  const key = process.env.FIREBASE_ADMIN_PRIVATE_KEY || "";
  return key.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
};

const isConfigured = 
  process.env.FIREBASE_ADMIN_PROJECT_ID && 
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
  process.env.FIREBASE_ADMIN_PRIVATE_KEY;

let _adminApp: admin.app.App | null = null;
let _adminDb: admin.firestore.Firestore | null = null;
let _adminAuth: admin.auth.Auth | null = null;

const _initApp = () => {
  if (!_adminApp && isConfigured) {
    const firebaseAdminConfig = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    };
    _adminApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
  }
  return _adminApp;
};

const _getDb = () => {
  if (!_adminDb) {
    const app = _initApp();
    if (app) _adminDb = app.firestore();
  }
  return _adminDb;
};

const _getAuth = () => {
  if (!_adminAuth) {
    const app = _initApp();
    if (app) _adminAuth = app.auth();
  }
  return _adminAuth;
};

export const getAdminApp = () => _initApp();
export const getAdminDb = () => _getDb();
export const getAdminAuth = () => _getAuth();

// Lazy proxy for backwards compatibility
const dbProxy = new Proxy({}, {
  get(_target, prop) {
    const db = _getDb();
    return (db as any)?.[prop];
  }
});

const authProxy = new Proxy({}, {
  get(_target, prop) {
    const auth = _getAuth();
    return (auth as any)?.[prop];
  }
});

export const adminDb = dbProxy as admin.firestore.Firestore;
export const adminAuth = authProxy as admin.auth.Auth;
export const adminApp = _initApp();