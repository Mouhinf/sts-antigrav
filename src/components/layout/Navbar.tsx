"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "lucide-react";

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
  const [mobileMenuChecked, setMobileMenuChecked] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-4 px-6 md:px-12",
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-sts-green rounded-lg flex items-center justify-center font-bold text-white text-xl">S</div>
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
              <button className={cn("flex items-center gap-1 font-medium transition-colors py-2", isScrolled ? "text-sts-black hover:text-sts-green" : "text-white hover:text-white/80")}>
                Services <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3">
                <div className="grid gap-1">
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} className="block px-4 py-2 text-sm text-slate-600 hover:text-sts-green hover:bg-sts-green/5 rounded-lg">
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
            <Button variant="primary" size="sm">Devis</Button>
          </div>

          {/* MOBILE MENU CHECKBOX (Pure CSS!) */}
          <label className="md:hidden cursor-pointer w-10 h-10 flex items-center justify-center">
            <input 
              type="checkbox" 
              className="peer sr-only"
              checked={mobileMenuChecked}
              onChange={(e) => setMobileMenuChecked(e.target.checked)}
            />
            <span className={cn("space-y-1.5", mobileMenuChecked && "hidden")}>
              <span className={cn("block w-6 h-0.5 bg-current rounded-full", isScrolled ? "bg-sts-black" : "bg-white")} />
              <span className={cn("block w-6 h-0.5 bg-current rounded-full", isScrolled ? "bg-sts-black" : "bg-white")} />
              <span className={cn("block w-6 h-0.5 bg-current rounded-full", isScrolled ? "bg-sts-black" : "bg-white")} />
            </span>
            <span className={cn("text-2xl", !mobileMenuChecked && "hidden")}>✕</span>
          </label>
        </div>
      </nav>

      {/* MOBILE MENU PANEL (CSS-only, no JS animation) */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-30 pt-20 px-6 md:hidden transition-transform duration-300",
          !mobileMenuChecked && "-translate-y-full"
        )}
        style={{ top: '60px' }}
      >
        <div className="flex flex-col gap-6 pb-24">
          <Link href="/" onClick={() => setMobileMenuChecked(false)} className="text-2xl font-bold text-sts-black">Accueil</Link>
          <Link href="/a-propos" onClick={() => setMobileMenuChecked(false)} className="text-2xl font-bold text-sts-black">À propos</Link>
          
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-sts-green tracking-widest">NOS SERVICES</span>
            {services.map((s) => (
              <Link 
                key={s.href} 
                href={s.href} 
                onClick={() => setMobileMenuChecked(false)} 
                className="text-lg text-slate-600"
              >
                {s.title}
              </Link>
            ))}
          </div>
          
          <Link href="/blog" onClick={() => setMobileMenuChecked(false)} className="text-2xl font-bold text-sts-black">Blog</Link>
          <Link href="/contact" onClick={() => setMobileMenuChecked(false)} className="text-2xl font-bold text-sts-black">Contact</Link>
        </div>
      </div>

      {/* CSS-only menu overlay */}
      <style jsx global>{`
        input[type="checkbox"]:checked ~ .mobile-panel {
          transform: translateY(0) !important;
        }
      `}</style>
    </>
  );
};