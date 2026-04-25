import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agrobusiness & Export | STS SOFITRANS SERVICE",
  description: "Expertise en production, transformation et export de produits agricoles sénégalais. Connecter le terroir local aux marchés mondiaux.",
  keywords: ["agrobusiness sénégal", "exportation produits locaux", "investissement agricole sénégal", "production durable dakar", "fruits et légumes sénégal"],
  openGraph: {
    title: "Agrobusiness & Export — STS SOFITRANS SERVICE",
    description: "Solutions agricoles innovantes et durables au Sénégal.",
    url: "https://sts-sofitrans.vercel.app/services/agrobusiness",
    type: "website",
  },
  alternates: {
    canonical: "https://sts-sofitrans.vercel.app/services/agrobusiness",
  }
};

export default function AgrobusinessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
