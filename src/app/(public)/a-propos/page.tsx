"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  History, Users, Target, Shield,
  Award, Heart, Leaf, Briefcase,
  ArrowRight, CheckCircle2
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { cn } from "@/lib/utils";

const LinkedinIcon = (props: any) => (
  <svg 
    {...props}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const timeline = [
  { year: "2015", title: "Création de la société", desc: "Fondation de STS SOFITRANS SERVICE avec une vision multisectorielle." },
  { year: "2017", title: "Pôle Immobilier", desc: "Lancement des activités de promotion et de gestion immobilière." },
  { year: "2019", title: "Transport & Logistique", desc: "Expansion majeure de la flotte et des services de livraison." },
  { year: "2021", title: "Agrobusiness", desc: "Lancement de la production agricole et de l'exportation." },
  { year: "2023", title: "Formations Certifiantes", desc: "Création de l'académie pour le développement des compétences." },
  { year: "2024", title: "Digitalisation", desc: "Lancement de la plateforme digitale complète pour nos clients." },
];

const values = [
  { icon: <Target className="w-8 h-8" />, title: "Mission", desc: "Accompagner le développement du Sénégal en offrant des services de proximité et d'excellence dans des secteurs clés.", color: "bg-sts-green" },
  { icon: <Shield className="w-8 h-8" />, title: "Vision", desc: "Devenir le leader multisectoriel de référence en Afrique de l'Ouest d'ici 2030, porté par l'innovation.", color: "bg-sts-blue" },
  { icon: <Award className="w-8 h-8" />, title: "Valeurs", desc: "Intégrité, Professionnalisme, Innovation et Engagement envers la satisfaction de nos clients.", color: "bg-sts-black" },
];

const team = [
  { name: "Moustapha SENE", role: "Directeur Général", image: "https://i.pravatar.cc/300?u=ms" },
  { name: "Sokhna DIOP", role: "Responsable Immobilier", image: "https://i.pravatar.cc/300?u=sd" },
  { name: "Abdou LAYE", role: "Directeur Logistique", image: "https://i.pravatar.cc/300?u=al" },
  { name: "Fatou NDIAYE", role: "Chef de Projet Agrobusiness", image: "https://i.pravatar.cc/300?u=fn" },
  { name: "Ibrahima FALL", role: "Responsable Formation", image: "https://i.pravatar.cc/300?u=if" },
  { name: "Aminata TALL", role: "Directrice Digitale", image: "https://i.pravatar.cc/300?u=at" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-sts-black">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
          alt="STS Office"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sts-green/40 to-sts-blue/40" />

        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mt-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-sts-green animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Depuis 2015 · Dakar, Sénégal</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-playfair text-white mb-8 tracking-tighter">
              À Propos de <br />
              <span className="text-sts-green">STS SOFITRANS</span>
            </h1>
            <p className="text-2xl text-white/80 font-medium leading-relaxed max-w-2xl">
              Votre partenaire multisectoriel engagé pour l'émergence du Sénégal à travers l'innovation et l'excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* NOTRE HISTOIRE (TIMELINE) */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] text-sts-green uppercase mb-6">Notre Parcours</h2>
            <p className="text-4xl md:text-6xl font-black font-playfair">Une Histoire de Croissance</p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-slate-100 hidden md:block" />

            <div className="space-y-24">
              {timeline.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={cn(
                    "relative flex flex-col md:flex-row items-center gap-12",
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  <div className="flex-1 text-center md:text-right">
                    {idx % 2 === 1 && <div className="hidden md:block" />}
                    {idx % 2 === 0 && (
                      <div className="space-y-4">
                        <span className="text-6xl font-black text-slate-100">{item.year}</span>
                        <h3 className="text-2xl font-bold font-playfair">{item.title}</h3>
                        <p className="text-slate-500 max-w-sm ml-auto">{item.desc}</p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 w-12 h-12 rounded-full bg-white border-4 border-sts-green flex items-center justify-center shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-sts-green" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    {idx % 2 === 0 && <div className="hidden md:block" />}
                    {idx % 2 === 1 && (
                      <div className="space-y-4">
                        <span className="text-6xl font-black text-slate-100">{item.year}</span>
                        <h3 className="text-2xl font-bold font-playfair">{item.title}</h3>
                        <p className="text-slate-500 max-w-sm">{item.desc}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION VALEURS */}
      <section className="py-32 bg-slate-50 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8", v.color)}>
                  {v.icon}
                </div>
                <h3 className="text-2xl font-bold font-playfair mb-6">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NOTRE ÉQUIPE */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] text-sts-blue uppercase mb-6">Le Capital Humain</h2>
            <p className="text-4xl md:text-6xl font-black font-playfair">Nos Experts à Votre Service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="relative h-[400px] rounded-[3rem] overflow-hidden mb-8 shadow-2xl">
                  <Image src={member.image} alt={member.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-sts-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                    <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-sts-blue hover:bg-sts-blue hover:text-white transition-all">
                      <LinkedinIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-2xl font-bold font-playfair">{member.name}</h4>
                <p className="text-sts-green font-bold text-sm uppercase tracking-widest mt-2">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENGAGEMENT RSE */}
      <section className="py-32 bg-sts-black text-white px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-sm font-bold tracking-[0.5em] text-sts-green uppercase mb-8">Responsabilité Sociétale</h2>
              <h3 className="text-4xl md:text-6xl font-black font-playfair leading-tight mb-8">
                Un Impact <span className="text-sts-green">Durable</span> <br />
                pour le Sénégal
              </h3>
              <p className="text-xl text-white/60 leading-relaxed mb-12">
                Chez STS, notre croissance n'est jamais déconnectée du bien-être de notre communauté et de la préservation de notre environnement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Emploi local", desc: "Priorité au recrutement et à l'insertion des jeunes diplômés sénégalais.", icon: <Briefcase className="w-6 h-6" /> },
                  { title: "Environnement", desc: "Optimisation de notre empreinte carbone et agriculture durable.", icon: <Leaf className="w-6 h-6" /> },
                  { title: "Formation", desc: "Programmes gratuits de mentorat pour les entrepreneurs locaux.", icon: <Heart className="w-6 h-6" /> },
                  { title: "Soutien Social", desc: "Partenariats avec des associations locales pour l'éducation.", icon: <Users className="w-6 h-6" /> },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-sts-green shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="font-bold mb-2">{item.title}</h5>
                      <p className="text-sm text-white/40">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative h-[600px] w-full rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white/5">
                <Image
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
                  alt="RSE Impact"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
