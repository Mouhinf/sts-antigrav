"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { title: "Immobilier", href: "/services/immobilier" },
  { title: "Transport & Logistique", href: "/services/transport" },
  { title: "Hygiène & Services", href: "/services/hygiene-services" },
  { title: "Agrobusiness", href: "/services/agrobusiness" },
  { title: "Formation & Comptabilité", href: "/services/formation-comptabilite" },
  { title: "Marketing & Commerce", href: "/services/marketing-commerce" },
];

function NavLink({ href, children, isScrolled, active = false }: any) {
  return (
    <Link
      href={href}
      className={cn(
        "font-medium transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-sts-green after:transition-all",
        isScrolled ? "text-sts-black hover:text-sts-green" : "text-white hover:text-white/80",
        active ? "after:w-full" : "after:w-0 hover:after:w-full"
      )}
    >
      {children}
    </Link>
  );
}

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // ... scroll listener stays the same

  // Don't render mobile menu here - it's in separate component now
  // Just use the hamburger for showing a toast/alert if needed, or remove it
  
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 py-4 px-6 md:px-12 flex",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg py-2" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-sts-green rounded-lg flex items-center justify-center font-bold text-white text-xl group-hover:rotate-12 transition-transform">S</div>
          <div className="flex flex-col leading-none">
            <span className={cn("font-bold text-xl tracking-tighter", isScrolled ? "text-sts-black" : "text-white")}>STS</span>
            <span className={cn("text-[10px] font-bold tracking-[0.2em]", isScrolled ? "text-sts-green" : "text-white/80")}>SOFITRANS</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/" isScrolled={isScrolled}>Accueil</NavLink>
          <NavLink href="/a-propos" isScrolled={isScrolled}>À propos</NavLink>
          
          <div className="relative group">
            <button 
              className={cn(
                "flex items-center gap-1 font-medium transition-colors py-2",
                isScrolled ? "text-sts-black hover:text-sts-green" : "text-white hover:text-white/80"
              )}
              aria-haspopup="true"
              aria-expanded="false"
            >
              Services <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-2xl shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 p-4 border border-slate-100">
              <div className="grid gap-1">
                {services.map((s) => (
                  <Link 
                    key={s.href} 
                    href={s.href} 
                    className="block px-4 py-3 text-sm text-slate-600 hover:text-sts-green hover:bg-sts-green/5 rounded-xl transition-colors font-medium"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <NavLink href="/blog" isScrolled={isScrolled}>Blog</NavLink>
          <NavLink href="/contact" isScrolled={isScrolled}>Contact</NavLink>
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Button variant="primary" size="md" className="px-8 shadow-lg shadow-sts-green/20">Demande de devis</Button>
        </div>

        {/* MOBILE TOGGLE (Custom Animated Hamburger) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden relative w-10 h-10 flex items-center justify-center z-[70]"
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <div className="flex flex-col gap-1.5 w-6">
            <span className={cn(
              "h-0.5 w-full bg-current transition-all duration-300 origin-left",
              isMobileMenuOpen ? "rotate-45 translate-x-1" : "",
              isScrolled || isMobileMenuOpen ? "text-sts-black" : "text-white"
            )} />
            <span className={cn(
              "h-0.5 w-full bg-current transition-all duration-300",
              isMobileMenuOpen ? "opacity-0 -translate-x-2" : "",
              isScrolled || isMobileMenuOpen ? "text-sts-black" : "text-white"
            )} />
            <span className={cn(
              "h-0.5 w-full bg-current transition-all duration-300 origin-left",
              isMobileMenuOpen ? "-rotate-45 translate-x-1" : "",
              isScrolled || isMobileMenuOpen ? "text-sts-black" : "text-white"
            )} />
          </div>
</button>
      </div>
    </nav>
  );
};
