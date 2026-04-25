# 🚀 STS Softrans - Site Web Professionnel

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud%20Firestore-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

Plateforme web professionnelle pour **STS Softrans Sarl**, entreprise multiservices basée au Sénégal. Le site présente les services d'immobilier, transport, formation professionnelle, agrobusiness, hygiene et marketing.

## ✨ Fonctionnalités

### 🌐 Site Public
- **Page d'accueil** - Présentation des services avec animations
- **Services** - Pages détaillées pour chaque service (Immobilier, Transport, Formation, etc.)
- **Blog** - Système de publication d'articles avec catégories
- **Contact** - Formulaire de contact sécurisé avec validation
- **Devis** - Demande de devis en ligne
- **Réservation** - Système de réservation pour véhicules et services

### 🔐 Espace Administrateur
- **Tableau de bord** - Vue d'ensemble avec statistiques
- **Gestion des biens immobiliers** - CRUD complet
- **Gestion des véhicules** - CRUD complet
- **Gestion des formations** - CRUD complet
- **Gestion du blog** - Publication et édition d'articles
- **Gestion des messages** - Formulaires de contact
- **Gestion des devis** - Suivi des demandes
- **Gestion des réservations** - Suivi des réservations
- **Paramètres du site** - Configuration générale

## 🛡️ Sécurité

Le projet intègre des mesures de sécurité professionnelles :

- ✅ **Rate Limiting** - Protection contre les attaques DoS sur toutes les API
- ✅ **Cookies httpOnly** - Authentification sécurisée côté serveur
- ✅ **Firebase Security Rules** - Règles de sécurité strictes pour Firestore
- ✅ **Input Sanitization** - Nettoyage des entrées utilisateur avec DOMPurify
- ✅ **CSRF Protection** - Headers de sécurité via middleware
- ✅ **Content Security Policy** - Protection XSS
- ✅ **Validation Zod** - Validation stricte des données
- ✅ **Logger sécurisé** - Logs sans données sensibles

## ⚡ Performance

Optimisations pour une expérience utilisateur fluide :

- 🚀 **Server Components** - Rendu côté serveur avec Next.js 14
- 🚀 **Dynamic Imports** - Chargement lazy des composants lourds
- 🚀 **Caching intelligent** - `unstable_cache` pour les données Firestore
- 🚀 **Pagination** - Cursor-based pour les grandes listes
- 🚀 **Images optimisées** - Next.js Image avec lazy loading
- 🚀 **Bundle optimization** - Code splitting automatique

## 🎨 Design

- **Tailwind CSS** - Design system cohérent
- **Framer Motion** - Animations fluides
- **Responsive** - Mobile-first design
- **Accessibilité** - ARIA labels et navigation clavier
- **SEO optimisé** - Meta tags dynamiques et structured data

## 🏗️ Architecture

```
sts-antigrav/
├── src/
│   ├── app/                    # Routes Next.js App Router
│   │   ├── (admin)/            # Groupe de routes admin
│   │   ├── (auth)/             # Groupe de routes auth
│   │   ├── (public)/           # Groupe de routes publiques
│   │   └── api/                # Routes API
│   ├── components/             # Composants React
│   │   ├── admin/              # Composants admin
│   │   ├── animations/         # Composants d'animation
│   │   ├── cards/              # Cartes réutilisables
│   │   ├── layout/             # Composants de layout
│   │   ├── sections/           # Sections de page
│   │   └── ui/                 # Composants UI de base
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilitaires et configurations
│   │   ├── firebase/           # Config Firebase
│   │   ├── services/           # Services de données
│   │   ├── validations/        # Schémas Zod
│   │   ├── rate-limit.ts       # Rate limiting
│   │   ├── logger.ts           # Logger sécurisé
│   │   ├── sanitize.ts         # Sanitization
│   │   └── seo.ts              # Génération SEO
│   ├── types/                  # Types TypeScript
│   └── middleware.ts           # Middleware Next.js
├── firestore.rules             # Règles de sécurité Firebase
├── logs/                       # Fichiers de logs
└── public/                     # Assets statiques
```

## 🚀 Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Compte Firebase
- Compte Cloudinary (pour les images)

### Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd sts-antigrav
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```

   Remplir les variables dans `.env.local` :
   ```env
   # Firebase Client
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=

   # Firebase Admin
   FIREBASE_ADMIN_PROJECT_ID=
   FIREBASE_ADMIN_CLIENT_EMAIL=
   FIREBASE_ADMIN_PRIVATE_KEY=

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # Site
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Déployer les règles Firestore**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Build pour production |
| `npm run start` | Démarrer le serveur de production |
| `npm run lint` | Lancer ESLint |

## 🔧 Configuration Firebase

### Firestore Indexes

Créer les indexes composites suivants dans Firebase Console :

```
Collection: properties
Fields:
  - featured Ascending
  - status Ascending
  - createdAt Descending

Collection: vehicles
Fields:
  - status Ascending
  - createdAt Descending

Collection: blog_posts
Fields:
  - published Ascending
  - publishedAt Descending
  - category Ascending
```

### Collections requises

- `admins` - Administrateurs du site
- `properties` - Biens immobiliers
- `vehicles` - Véhicules
- `trainings` - Formations
- `blog_posts` - Articles de blog
- `blog_categories` - Catégories de blog
- `messages` - Messages de contact
- `quotes` - Demandes de devis
- `bookings` - Réservations
- `newsletter_subscribers` - Abonnés newsletter
- `site_settings` - Paramètres du site
- `activity_logs` - Logs d'activité admin

## 🔒 Sécurité - Bonnes pratiques

1. **Ne jamais committer les fichiers `.env`**
2. **Déployer les Security Rules avant la mise en production**
3. **Vérifier les logs régulièrement** dans `logs/`
4. **Limiter les accès admin** dans la collection `admins`
5. **Activer l'authentification 2FA** sur le compte Firebase

## 📊 Monitoring

Les logs sont stockés dans le dossier `logs/` :
- `error.log` - Erreurs applicatives
- `combined.log` - Tous les logs

## 🌐 Déploiement

### Vercel (Recommandé)

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer

```bash
vercel --prod
```

### Autres plateformes

Le projet peut être déployé sur toute plateforme supportant Node.js :
- Netlify
- Railway
- DigitalOcean
- AWS

## 📄 License

Propriété privée - STS Softrans Sarl

## 🤝 Support

Pour toute question ou problème :
- Email : contact@sts-sofitrans.com
- Téléphone : +221 XX XXX XX XX

---

<p align="center">
  Développé avec ❤️ par DeepV Code pour STS Softrans
</p>
