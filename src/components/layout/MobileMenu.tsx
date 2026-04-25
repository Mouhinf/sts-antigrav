"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const services = [
  { title: "Immobilier", href: "/services/immobilier" },
  { title: "Transport & Logistique", href: "/services/transport" },
  { title: "Hygiène & Services", href: "/services/hygiene-services" },
  { title: "Agrobusiness", href: "/services/agrobusiness" },
  { title: "Formation & Comptabilité", href: "/services/formation-comptabilite" },
  { title: "Marketing & Commerce", href: "/services/marketing-commerce" },
];

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Reset menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return (
    <button
      onClick={() => setIsOpen(true)}
      className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-sts-green rounded-full shadow-lg flex items-center justify-center z-50"
      aria-label="Ouvrir le menu"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999999] md:hidden overflow-y-auto"
      style={{ 
        isolation: 'isolate',
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0 
      }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-white p-4 flex justify-between items-center border-b border-gray-100">
        <span className="font-bold text-xl tracking-tight">Menu</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="w-10 h-10 flex items-center justify-center text-2xl"
          aria-label="Fermer le menu"
        >
          ✕
        </button>
      </div>

      {/* Links */}
      <div className="p-6 flex flex-col gap-6">
        <Link href="/" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-sts-black">Accueil</Link>
        <Link href="/a-propos" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-sts-black">À propos</Link>
        
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-sts-green tracking-[0.3em] uppercase">Nos Services</span>
          <div className="grid gap-3 pl-2">
            {services.map((s) => (
              <Link 
                key={s.href} 
                href={s.href} 
                onClick={() => setIsOpen(false)} 
                className="text-lg font-medium text-slate-600 hover:text-sts-green"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>
        
        <Link href="/blog" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-sts-black">Blog</Link>
        <Link href="/contact" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-sts-black">Contact</Link>
      </div>
    </div>
  );
};