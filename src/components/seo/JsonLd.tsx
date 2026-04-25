// Pas de "use client" — JSON-LD doit être rendu côté serveur (Server Component)
// pour que les robots d'indexation (Googlebot, etc.) puissent le lire directement
// sans exécuter du JavaScript.

import React from "react";

const BASE_URL = "https://sts-sofitrans.vercel.app";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "STS SOFITRANS SERVICE",
  "url": BASE_URL,
  "image": `${BASE_URL}/og-image.jpg`,
  "address": { 
    "@type": "PostalAddress",
    "streetAddress": "Zac Mbao, Rond Point Sipres",
    "addressLocality": "Dakar", 
    "addressCountry": "SN" 
  },
  "description": "Votre partenaire multisectoriel à Dakar. Immobilier, transport, agrobusiness et formations professionnelles. Pour Mieux Vous Servir !",
};

// Schéma WebSite avec SearchAction (active le Sitelinks Searchbox dans Google)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  "url": BASE_URL,
  "name": "STS SOFITRANS SERVICE",
  "description": "Partenaire multisectoriel au Sénégal — Immobilier, Transport, Agrobusiness, Formation",
  "inLanguage": "fr-SN",
  "publisher": {
    "@id": `${BASE_URL}/#business`,
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${BASE_URL}/recherche?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const JsonLd = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};
