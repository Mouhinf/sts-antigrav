"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const services = [
  { title: "Immobilier", href: "/services/immobilier" },
  { title: "Transport", href: "/services/transport" },
  { title: "Hygiène", href: "/services/hygiene-services" },
  { title: "Agrobusiness", href: "/services/agrobusiness" },
  { title: "Formation", href: "/services/formation-comptabilite" },
  { title: "Marketing", href: "/services/marketing-commerce" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 20);
    });
  }

  return (
    <>
      {/* ============= NAVBAR ============= */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          padding: scrolled ? '12px 24px' : '16px 24px',
          transition: 'all 0.3s',
          boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, backgroundColor: '#1A8C3E', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 20 }}>S</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold', fontSize: 20, color: scrolled ? '#0A0A0A' : 'white' }}>STS</span>
              <span style={{ fontSize: 10, fontWeight: 'bold', color: scrolled ? '#1A8C3E' : 'rgba(255,255,255,0.8)', letterSpacing: '0.2em' }}>SOFITRANS</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="desktop-menu" style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/" style={{ color: scrolled ? '#0A0A0A' : 'white', textDecoration: 'none', fontWeight: 500 }}>Accueil</Link>
            <Link href="/a-propos" style={{ color: scrolled ? '#0A0A0A' : 'white', textDecoration: 'none', fontWeight: 500 }}>À propos</Link>
            
            <div style={{ position: 'relative' }}>
              <button style={{ color: scrolled ? '#0A0A0A' : 'white', background: 'none', border: 'none', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Services <ChevronDown size={16} />
              </button>
              <div className="desktop-dropdown" style={{ position: 'absolute', top: '100%', left: 0, backgroundColor: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: 12, display: 'none', minWidth: 200 }}>
                {services.map(s => (
                  <Link key={s.href} href={s.href} style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none', borderRadius: 8 }}>
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link href="/blog" style={{ color: scrolled ? '#0A0A0A' : 'white', textDecoration: 'none', fontWeight: 500 }}>Blog</Link>
            <Link href="/contact" style={{ color: scrolled ? '#0A0A0A' : 'white', textDecoration: 'none', fontWeight: 500 }}>Contact</Link>
            
            <Link href="/contact" style={{ backgroundColor: '#1A8C3E', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontWeight: 500 }}>
              Devis
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-hamburger"
            style={{ 
              display: 'none', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: 8
            }}
          >
            <div style={{ width: 24, height: 2, backgroundColor: scrolled ? '#0A0A0A' : 'white', marginBottom: 6 }} />
            <div style={{ width: 24, height: 2, backgroundColor: scrolled ? '#0A0A0A' : 'white', marginBottom: 6 }} />
            <div style={{ width: 24, height: 2, backgroundColor: scrolled ? '#0A0A0A' : 'white' }} />
          </button>
        </div>
      </nav>

      {/* ============= MOBILE MENU ============= */}
      {menuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 99999,
            overflowY: 'auto',
            paddingTop: 80,
            padding: '80px 24px 40px'
          }}
        >
          <button 
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 40,
              height: 40,
              backgroundColor: '#0A0A0A',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontSize: 28, fontWeight: 'bold', color: '#0A0A0A', textDecoration: 'none' }}>Accueil</Link>
            <Link href="/a-propos" onClick={() => setMenuOpen(false)} style={{ fontSize: 28, fontWeight: 'bold', color: '#0A0A0A', textDecoration: 'none' }}>À propos</Link>
            
            <div style={{ marginTop: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 'bold', color: '#1A8C3E', letterSpacing: '0.2em' }}>NOS SERVICES</span>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {services.map(s => (
                  <Link 
                    key={s.href} 
                    href={s.href} 
                    onClick={() => setMenuOpen(false)} 
                    style={{ fontSize: 18, color: '#555', textDecoration: 'none' }}
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link href="/blog" onClick={() => setMenuOpen(false)} style={{ fontSize: 28, fontWeight: 'bold', color: '#0A0A0A', textDecoration: 'none' }}>Blog</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ fontSize: 28, fontWeight: 'bold', color: '#0A0A0A', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-menu, .desktop-dropdown { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
        .desktop-dropdown:hover { display: block !important; }
      `}</style>
    </>
  );
}