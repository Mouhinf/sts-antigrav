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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 py-4 px-6 md:px-12",
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

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[65] md:hidden pt-24 px-8"
          >
            <div className="flex flex-col gap-8 max-w-sm mx-auto">
              <div className="flex flex-col gap-4">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-sts-black tracking-tight">Accueil</Link>
                <Link href="/a-propos" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-sts-black tracking-tight">À propos</Link>
                <div className="flex flex-col gap-4 mt-2">
                  <span className="text-xs font-bold text-sts-green tracking-[0.3em] uppercase">Nos Services</span>
                  <div className="grid gap-3">
                    {services.map((s) => (
                      <Link 
                        key={s.href} 
                        href={s.href} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="text-xl font-medium text-slate-500 hover:text-sts-green transition-colors"
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-sts-black tracking-tight">Blog</Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-sts-black tracking-tight">Contact</Link>
              </div>
              <Button variant="primary" size="lg" className="w-full mt-4 h-14">Demande de devis</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
