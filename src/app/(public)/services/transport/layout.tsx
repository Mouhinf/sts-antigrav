import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transport & Logistique | STS SOFITRANS SERVICE",
  description: "Location de véhicules avec chauffeurs, gestion de flotte et solutions logistiques au Sénégal. Pour mieux vous servir dans tous vos déplacements.",
  keywords: ["location voiture dakar", "transport logistique sénégal", "véhicule avec chauffeur dakar", "location SUV sénégal", "gestion de flotte"],
  openGraph: {
    title: "Transport & Logistique — STS SOFITRANS SERVICE",
    description: "Solutions de mobilité et logistique au Sénégal.",
    url: "https://sts-sofitrans.vercel.app/services/transport",
    type: "website",
  },
  alternates: {
    canonical: "https://sts-sofitrans.vercel.app/services/transport",
  }
};

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
