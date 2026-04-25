import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { MobileMenu } from "@/components/layout/MobileMenu";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "STS SOFITRANS SERVICE | Immobilier, Transport & Formation au Sénégal",
  description: "Votre partenaire multisectoriel à Dakar. Immobilier, transport, agrobusiness et formations professionnelles. Pour Mieux Vous Servir !",
  keywords: ["immobilier Dakar", "transport Sénégal", "agrobusiness", "formation professionnelle Dakar"],
  openGraph: {
    title: "STS SOFITRANS SERVICE",
    description: "Votre partenaire multisectoriel à Dakar. Immobilier, transport, agrobusiness et formations professionnelles. Pour Mieux Vous Servir !",
    url: "https://sts-sofitrans.vercel.app",
    siteName: "STS SOFITRANS SERVICE",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "fr_SN",
    type: "website"
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://sts-sofitrans.vercel.app" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-sts-black min-h-screen flex flex-col`}>
        <SmoothScroll>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sts-green text-white px-4 py-2 rounded-lg z-[100]">
            Passer au contenu principal
          </a>
          
          <Navbar />
          <MobileMenu />
          
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          
          <Footer />
          <WhatsAppButton />
          <Toaster position="top-right" richColors />
        </SmoothScroll>
      </body>
    </html>
  );
}