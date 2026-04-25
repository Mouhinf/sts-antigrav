import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formation Professionnelle | STS SOFITRANS SERVICE",
  description: "Programmes de formation certifiants en management, logistique, immobilier et entrepreneuriat. Développez les compétences de vos équipes avec nos experts.",
  keywords: ["formation professionnelle dakar", "certification sénégal", "formation logistique dakar", "cours immobilier sénégal", "développement compétences"],
  openGraph: {
    title: "Formation Professionnelle — STS SOFITRANS SERVICE",
    description: "Académie d'excellence pour les métiers de demain au Sénégal.",
    url: "https://sts-sofitrans.vercel.app/services/formation",
    type: "website",
  },
  alternates: {
    canonical: "https://sts-sofitrans.vercel.app/services/formation",
  }
};

export default function FormationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
