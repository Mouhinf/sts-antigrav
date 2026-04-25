"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Briefcase, TrendingUp, Presentation, ArrowRight, 
  CheckCircle2, Target, Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";

export default function MarketingCommercePage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-sts-black">
        <Image 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000"
          alt="Marketing & Commerce Hero"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sts-black via-sts-black/40 to-transparent" />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mt-12"
          >
            <span className="inline-block px-6 py-2 rounded-full bg-sts-blue/20 border border-sts-blue/30 text-sts-blue text-xs font-bold uppercase tracking-widest mb-8">
              Croissance & Stratégie
            </span>
            <h1 className="text-6xl md:text-8xl font-black font-playfair text-white mb-8 tracking-tighter">
              Marketing & <br />
              <span className="text-sts-blue">Commerce</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-xl">
              Stratégie commerciale, création de marque, techniques de vente, et accompagnement des jeunes entrepreneurs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black font-playfair">Propulsez votre entreprise vers le succès.</h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                Notre pôle Marketing & Commerce est conçu pour accompagner les porteurs de projets et les entreprises dans leur croissance sur le marché local et international.
              </p>
              
              <div className="grid gap-6">
                {[
                  { title: "Stratégie Commerciale B2B / B2C", icon: <TrendingUp /> },
                  { title: "Création de Marque & Identité", icon: <Target /> },
                  { title: "Techniques de Vente & Négociation", icon: <Presentation /> },
                  { title: "Accompagnement des Entrepreneurs", icon: <Users /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-sts-blue/10 text-sts-blue flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-bold text-slate-700">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
             <div className="relative">
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" alt="Marketing B2B" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-sts-blue rounded-full flex items-center justify-center text-white shadow-2xl">
                <Briefcase className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Prêt à développer votre marque ?" description="Nos experts en marketing et stratégie commerciale vous attendent." />
    </div>
  );
}
