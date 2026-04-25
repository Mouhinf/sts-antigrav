import admin from "firebase-admin";

if (typeof window !== 'undefined') {
  throw new Error("Le SDK Firebase Admin ne peut pas être utilisé côté client.");
}

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY || "")
    .replace(/\\n/g, "\n")
    .replace(/n/g, "\n"),
};

const isConfigured = 
  process.env.FIREBASE_ADMIN_PROJECT_ID && 
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL && 
  process.env.FIREBASE_ADMIN_PRIVATE_KEY;

const adminApp = (admin.apps.length > 0)
  ? admin.apps[0]
  : isConfigured 
    ? admin.initializeApp({
        credential: admin.credential.cert(firebaseAdminConfig),
      })
    : null;

const adminDb = adminApp ? admin.firestore() : (null as any);
const adminAuth = adminApp ? admin.auth() : (null as any);

export { adminApp, adminDb, adminAuth };
