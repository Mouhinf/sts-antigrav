import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Services | STS SOFITRANS SERVICE",
  description: "Découvrez l'ensemble de nos domaines d'expertise : Immobilier, Transport, Agrobusiness et Formation. Des solutions sur mesure pour mieux vous servir au Sénégal.",
  keywords: ["services sénégal", "immobilier dakar", "transport dakar", "formation professionnelle", "agrobusiness"],
  openGraph: {
    title: "Nos Services — STS SOFITRANS SERVICE",
    description: "Expertise multisectorielle au Sénégal.",
    url: "https://sts-sofitrans.vercel.app/services",
    type: "website",
  },
  alternates: {
    canonical: "https://sts-sofitrans.vercel.app/services",
  }
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
