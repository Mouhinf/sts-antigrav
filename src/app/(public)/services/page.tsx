"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Sprout, GraduationCap, Zap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";

const services = [
  {
    id: "immobilier",
    title: "Immobilier",
    description: "De la conception à la gestion locative, STS bâtit des logements modernes et accessibles.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    icon: <ShieldCheck className="w-8 h-8" />,
    href: "/services/immobilier",
    color: "from-sts-green/90 to-sts-green/40"
  },
  {
    id: "transport",
    title: "Transport & Logistique",
    description: "Vente et location de véhicules, transport touristique et collectif, solutions sur mesure pour particuliers et entreprises.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000",
    icon: <Truck className="w-8 h-8" />,
    href: "/services/transport",
    color: "from-sts-blue/90 to-sts-blue/40"
  },
  {
    id: "hygiene",
    title: "Hygiène & Services",
    description: "Nettoyage, sécurité, maintenance, et assistance administrative pour un cadre de vie sain et professionnel.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=1000",
    icon: <Zap className="w-8 h-8" />,
    href: "/services/hygiene-services",
    color: "from-sts-green/90 to-sts-green/40"
  },
  {
    id: "agrobusiness",
    title: "Agrobusiness",
    description: "Élevage de volailles, transformation d’aliments, culture de céréales et production locale pour la souveraineté alimentaire.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000",
    icon: <Sprout className="w-8 h-8" />,
    href: "/services/agrobusiness",
    color: "from-sts-blue/90 to-sts-blue/40"
  },
  {
    id: "formation",
    title: "Formation & Comptabilité",
    description: "Des modules pratiques en gestion, fiscalité, et logiciels de comptabilité comme Sage Saari, adaptés aux réalités du marché.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1000",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/services/formation-comptabilite",
    color: "from-sts-green/90 to-sts-green/40"
  },
  {
    id: "marketing",
    title: "Marketing & Commerce",
    description: "Stratégie commerciale, création de marque, techniques de vente, et accompagnement des jeunes entrepreneurs.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
    icon: <Briefcase className="w-8 h-8" />,
    href: "/services/marketing-commerce",
    color: "from-sts-blue/90 to-sts-blue/40"
  }
];

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sts-green/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sts-blue/20 blur-[120px] rounded-full" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mt-8"
          >
            <h1 className="text-6xl md:text-7xl font-black font-playfair mb-8 tracking-tighter">
              Nos Domaines <br />
              <span className="text-sts-green">d'Expertise</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              STS SOFITRANS SERVICE vous accompagne dans vos projets les plus ambitieux à travers ses pôles d'excellence intégrés au Sénégal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-80 transition-opacity group-hover:opacity-90`} />
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 border border-white/30"
                  >
                    {service.icon}
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-black font-playfair mb-6 tracking-tight">
                    {service.title}
                  </h2>
                  <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-md">
                    {service.description}
                  </p>
                  <Link href={service.href}>
                    <Button variant="outline" className="w-fit h-14 px-8 border-white/40 text-white hover:bg-white hover:text-sts-black backdrop-blur-sm group/btn">
                      Découvrir ce service <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
