import type { Metadata } from "next";
import type { SeoMetadata } from "@/types";

const SITE_NAME = "STS - Softrans Sarl";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sts-sofitrans.com";
const DEFAULT_IMAGE = "/images/og-default.jpg";

interface GenerateMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  ogType?: "website" | "article";
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

export function generateMetadata({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  keywords = [],
  ogType = "website",
  noIndex = false,
  structuredData,
}: GenerateMetadataOptions): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const fullUrl = `${SITE_URL}${path}`;
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  const defaultKeywords = [
    "STS",
    "Softrans",
    "Sénégal",
    "services",
    "immobilier",
    "transport",
    "formation",
    "agrobusiness",
    "marketing",
  ];

  return {
    title: fullTitle,
    description: description.slice(0, 160),
    keywords: [...defaultKeywords, ...keywords],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: fullUrl,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description: description.slice(0, 160),
      url: fullUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "fr_FR",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description.slice(0, 160),
      images: [fullImage],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    other: structuredData
      ? {
          "script:ld+json": JSON.stringify(structuredData),
        }
      : undefined,
  };
}

// Métadonnées spécifiques par page
export const homeMetadata = generateMetadata({
  title: SITE_NAME,
  description:
    "STS - Softrans Sarl : Votre partenaire multiservices au Sénégal. Immobilier, transport, formation professionnelle, agrobusiness et marketing.",
  path: "/",
  keywords: [
    "accueil",
    "multiservices",
    "entreprise sénégalaise",
    "solutions professionnelles",
  ],
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      "https://facebook.com/stssoftrans",
      "https://linkedin.com/company/sts-sofitrans",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+221-33-XXX-XXXX",
      contactType: "customer service",
      areaServed: "SN",
      availableLanguage: ["French"],
    },
  },
});

export const aboutMetadata = generateMetadata({
  title: "À propos",
  description:
    "Découvrez STS Softrans, entreprise sénégalaise leader dans les services multisectoriels. Notre histoire, nos valeurs et notre équipe.",
  path: "/a-propos",
  keywords: ["à propos", "histoire", "valeurs", "équipe", "entreprise"],
});

export const contactMetadata = generateMetadata({
  title: "Contact",
  description:
    "Contactez STS Softrans pour tous vos besoins en immobilier, transport, formation et plus. Formulaire de contact et coordonnées.",
  path: "/contact",
  keywords: ["contact", "formulaire", "adresse", "téléphone", "email"],
});

export const servicesMetadata = generateMetadata({
  title: "Nos Services",
  description:
    "Découvrez tous nos services : immobilier, transport et location de véhicules, formation professionnelle, agrobusiness, hygiene et marketing.",
  path: "/services",
  keywords: [
    "services",
    "immobilier",
    "transport",
    "formation",
    "agrobusiness",
    "marketing",
  ],
});

export const blogMetadata = generateMetadata({
  title: "Blog",
  description:
    "Actualités, conseils et articles sur l'immobilier, le transport, la formation professionnelle et le business au Sénégal.",
  path: "/blog",
  keywords: ["blog", "actualités", "conseils", "articles", "news"],
});

export const loginMetadata = generateMetadata({
  title: "Connexion Admin",
  description: "Espace administrateur STS Softrans. Accès sécurisé au tableau de bord.",
  path: "/login",
  noIndex: true,
});

// Générateur de métadonnées pour les pages dynamiques
export function generateBlogPostMetadata(
  post: {
    title: string;
    excerpt: string;
    coverImage?: string;
    slug: string;
    publishedAt?: string;
    author?: string;
  } | null
): Metadata {
  if (!post) {
    return generateMetadata({
      title: "Article non trouvé",
      description: "Cet article n'existe pas ou a été supprimé.",
      path: "/blog",
      noIndex: true,
    });
  }

  return generateMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    ogType: "article",
    keywords: ["article", "blog"],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage,
      datePublished: post.publishedAt,
      author: {
        "@type": "Person",
        name: post.author || "STS Softrans",
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
      },
    },
  });
}

export function generatePropertyMetadata(
  property: {
    title: string;
    description: string;
    images?: string[];
    id: string;
    location: string;
    price: number;
  } | null
): Metadata {
  if (!property) {
    return generateMetadata({
      title: "Bien non trouvé",
      description: "Ce bien immobilier n'existe pas ou a été vendu.",
      path: "/services/immobilier",
      noIndex: true,
    });
  }

  return generateMetadata({
    title: property.title,
    description: `${property.description.slice(0, 150)}... - ${property.location}`,
    path: `/services/immobilier/${property.id}`,
    image: property.images?.[0],
    keywords: [
      "immobilier",
      property.location,
      "vente",
      "location",
      "bien",
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: property.title,
      description: property.description,
      image: property.images,
      address: {
        "@type": "PostalAddress",
        addressLocality: property.location,
        addressCountry: "SN",
      },
      price: property.price,
      priceCurrency: "XOF",
    },
  });
}
