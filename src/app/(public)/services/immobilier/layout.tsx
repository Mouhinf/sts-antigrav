import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue Immobilier | STS SOFITRANS SERVICE",
  description: "Découvrez nos appartements, villas, terrains et bureaux à Dakar et dans tout le Sénégal. Expertise et transparence pour votre projet immobilier.",
  keywords: ["achat villa dakar", "location appartement dakar", "terrain sénégal", "gestion immobilière sénégal", "vendre maison dakar"],
  openGraph: {
    title: "Catalogue Immobilier — STS SOFITRANS SERVICE",
    description: "Vente, location et gestion immobilière au Sénégal.",
    url: "https://sts-sofitrans.vercel.app/services/immobilier",
    type: "website",
  },
  alternates: {
    canonical: "https://sts-sofitrans.vercel.app/services/immobilier",
  }
};

export default function ImmobilierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
