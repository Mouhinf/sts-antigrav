"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

// SVGs officiels pour les réseaux sociaux (plus fiables que les polices d'icônes pour les marques)
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-slate-400 hover:text-sts-green hover:pl-2 transition-all duration-300 flex items-center">
        <span className="text-sts-green mr-2">•</span> {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a 
      href={href} 
      aria-label="Social Link"
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-sts-green hover:border-sts-green transition-all duration-300"
    >
      {icon}
    </a>
  );
}

export const Footer = () => {
  return (
    <footer className="bg-sts-black text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* COL 1: LOGO & SLOGAN */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sts-green rounded-lg flex items-center justify-center font-bold text-white text-xl">S</div>
            <span className="font-bold text-2xl tracking-tighter">STS SOFITRANS</span>
          </div>
          <p className="text-slate-400 font-medium italic">
            "Pour Mieux Vous Servir !"
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={<FacebookIcon />} href="#" />
            <SocialIcon icon={<TwitterIcon />} href="#" />
            <SocialIcon icon={<InstagramIcon />} href="#" />
            <SocialIcon icon={<LinkedinIcon />} href="#" />
          </div>
        </div>

        {/* COL 2: SERVICES */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-sts-green uppercase tracking-widest text-sm">Nos Services</h3>
          <ul className="space-y-4">
            <FooterLink href="/services/transport">Transport & Logistique</FooterLink>
            <FooterLink href="/services/immobilier">Gestion Immobilière</FooterLink>
            <FooterLink href="/services/nettoyage">Nettoyage Industriel</FooterLink>
            <FooterLink href="/services/vehicules">Vente de Véhicules</FooterLink>
            <FooterLink href="/services/formation">Centre de Formation</FooterLink>
          </ul>
        </div>

        {/* COL 3: LIENS RAPIDES */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-sts-green uppercase tracking-widest text-sm">Liens Rapides</h3>
          <ul className="space-y-4">
            <FooterLink href="/a-propos">À propos de nous</FooterLink>
            <FooterLink href="/blog">Actualités & Blog</FooterLink>
            <FooterLink href="/carrieres">Carrières</FooterLink>
            <FooterLink href="/devis">Demander un devis</FooterLink>
            <FooterLink href="/contact">Nous contacter</FooterLink>
          </ul>
        </div>

        {/* COL 4: CONTACT */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-sts-green uppercase tracking-widest text-sm">Nous Trouver</h3>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-sts-green shrink-0" />
              <span className="text-sm">Zac Mbao, Rond Point Sipres, Dakar, Sénégal</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-sts-green shrink-0" />
              <span className="text-sm">+221 33 8XX XX XX</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-sts-green shrink-0" />
              <span className="text-sm">contact@sts-sofitrans.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
        <p>© {new Date().getFullYear()} STS SOFITRANS SERVICE. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/mentions-legales" className="hover:text-sts-green transition-colors">Mentions Légales</Link>
          <Link href="/confidentialite" className="hover:text-sts-green transition-colors">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
};
