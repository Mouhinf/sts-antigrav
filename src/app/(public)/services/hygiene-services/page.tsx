"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Sparkles, ShieldCheck, Zap, ArrowRight, 
  CheckCircle2, Droplets, Wind, UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";

export default function HygieneServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-sts-black">
        <Image 
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=2000"
          alt="Hygiène & Services Hero"
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
            <span className="inline-block px-6 py-2 rounded-full bg-sts-green/20 border border-sts-green/30 text-sts-green text-xs font-bold uppercase tracking-widest mb-8">
              Excellence & Sécurité
            </span>
            <h1 className="text-6xl md:text-8xl font-black font-playfair text-white mb-8 tracking-tighter">
              Hygiène & <br />
              <span className="text-sts-green">Services</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-xl">
              Nettoyage, sécurité, maintenance, et assistance administrative pour un cadre de vie sain et professionnel au Sénégal.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=1000" alt="Nettoyage Pro" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-sts-green rounded-full flex items-center justify-center text-white shadow-2xl">
                <Sparkles className="w-16 h-16" />
              </div>
            </div>

            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black font-playfair">Un environnement de travail optimal et sécurisé.</h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                STS SOFITRANS SERVICE intervient auprès des professionnels et particuliers pour garantir propreté, sécurité et confort au quotidien.
              </p>
              
              <div className="grid gap-6">
                {[
                  { title: "Nettoyage & Entretien Industriel", icon: <Sparkles /> },
                  { title: "Sécurité & Gardiennage", icon: <ShieldCheck /> },
                  { title: "Maintenance technique", icon: <Zap /> },
                  { title: "Assistance Administrative", icon: <UserCheck /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-sts-green/10 text-sts-green flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-bold text-slate-700">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Besoin de nos services ?" description="Nos équipes interviennent rapidement pour assurer la qualité de votre environnement de travail." />
    </div>
  );
}
