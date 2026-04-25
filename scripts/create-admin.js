const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Manual env parsing
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

console.log('Project ID:', process.env.FIREBASE_ADMIN_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseAdminConfig),
    });
    console.log('✅ Firebase Admin initialisé.');
  } catch (e) {
    console.error('❌ Erreur initialisation :', e.message);
    process.exit(1);
  }
}

const email = 'admin@sts.sn';
const password = 'Sts@Admin2024'; // Vous pourrez le changer plus tard

async function createAdmin() {
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: 'Admin STS',
    });
    console.log('✅ Utilisateur Admin créé avec succès :', user.email);
    console.log('📧 Email :', email);
    console.log('🔑 Mot de passe :', password);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('ℹ️ L\'utilisateur existe déjà. Réinitialisation du mot de passe...');
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, { password });
      console.log('✅ Mot de passe réinitialisé pour :', email);
      console.log('🔑 Nouveau mot de passe :', password);
    } else {
      console.error('❌ Erreur :', error);
    }
  }
  process.exit();
}

createAdmin();
