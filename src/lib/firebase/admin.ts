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

let adminApp: admin.app.App | null = null;
let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;

const getAdminApp = () => {
  if (!adminApp && isConfigured) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
  }
  return adminApp;
};

const getAdminDb = () => {
  if (!adminDb) {
    const app = getAdminApp();
    if (app) adminDb = app.firestore();
  }
  return adminDb;
};

const getAdminAuth = () => {
  if (!adminAuth) {
    const app = getAdminApp();
    if (app) adminAuth = app.auth();
  }
  return adminAuth;
};

export const adminApp = getAdminApp();
export const adminDb = getAdminDb();
export const adminAuth = getAdminAuth();
