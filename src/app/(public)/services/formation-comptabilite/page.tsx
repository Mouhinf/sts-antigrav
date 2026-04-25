"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, BookOpen, Users, Clock, 
  ArrowRight, CheckCircle2, Star, Target,
  X, Mail, Phone, Calendar, Briefcase
} from "lucide-react";
import { db, collection, getDocs, query, where } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrainingCard } from "@/components/cards/TrainingCard";
import { CTASection } from "@/components/sections/CTASection";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validations";
import { toast } from "sonner";

export default function FormationPage() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulaire d'inscription
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "Inscription Formation",
      message: "Je souhaite m'inscrire à cette formation.",
      type: "inscription_formation"
    }
  });

  const onEnrollSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subject: `Inscription Formation: ${selectedTraining?.title}`,
          training: selectedTraining?.id
        })
      });

      if (res.ok) {
        toast.success("Votre demande d'inscription a été envoyée !");
        reset();
        setSelectedTraining(null);
      } else {
        toast.error("Erreur lors de l'envoi de l'inscription.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Tout", "Immobilier", "Logistique", "Management", "Digital"];
  
  const filteredTrainings = selectedCategory === "Tout" 
    ? trainings 
    : trainings.filter(t => t.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-32 bg-[#0A1A2F] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000"
            alt="Formation Professionnelle"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-sts-blue via-transparent to-sts-green opacity-20" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mt-12"
          >
            <span className="inline-block px-6 py-2 rounded-full bg-sts-blue/20 border border-sts-blue/30 text-sts-blue text-xs font-bold uppercase tracking-widest mb-8">
              Académie & Expertise
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-playfair text-white mb-8 tracking-tighter">
              Formation & <br />
              <span className="text-sts-blue">Comptabilité</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
              Des modules pratiques en gestion, fiscalité, et logiciels de comptabilité comme Sage Saari, adaptés aux réalités du marché.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTRES & CATALOGUE */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-[0.5em] text-sts-blue uppercase mb-4">Notre Catalogue</h2>
              <p className="text-4xl md:text-5xl font-black font-playfair">Formations Disponibles</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all",
                    selectedCategory === cat 
                      ? "bg-sts-blue text-white shadow-xl shadow-sts-blue/20" 
                      : "bg-slate-50 text-slate-400 hover:text-sts-blue border border-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[450px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrainings.map(t => (
                <TrainingCard key={t.id} training={t} onSelect={setSelectedTraining} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL DÉTAIL FORMATION */}
      <AnimatePresence>
        {selectedTraining && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTraining(null)}
              className="absolute inset-0 bg-sts-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedTraining(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full lg:w-3/5 p-8 md:p-12 overflow-y-auto">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-10 shadow-xl">
                  <Image src={selectedTraining.image} alt={selectedTraining.title} fill className="object-cover" />
                </div>
                
                <h2 className="text-4xl font-black font-playfair mb-6">{selectedTraining.title}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { icon: <Clock />, label: "Durée", value: selectedTraining.duration },
                    { icon: <Calendar />, label: "Début", value: selectedTraining.nextSession },
                    { icon: <Users />, label: "Capacité", value: `${selectedTraining.seats} Pers.` },
                    { icon: <Target />, label: "Niveau", value: "Tous niveaux" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-sts-blue mb-1">{item.icon}</div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</p>
                      <p className="font-bold text-sm">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-sts-blue" /> Programme de la formation
                    </h4>
                    <div className="space-y-4">
                      {selectedTraining.program?.map((step: string, i: number) => (
                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-sts-blue text-white flex items-center justify-center font-bold shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-slate-600 font-medium">{step}</p>
                        </div>
                      )) || (
                        <p className="text-slate-400 italic">Détails du programme disponibles sur demande.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-2/5 p-8 md:p-12 bg-slate-50 overflow-y-auto border-l border-slate-100">
                <div className="mb-10">
                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-sts-blue" /> Inscription à la session
                  </h4>
                  <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm mb-8">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Prix de la certification</p>
                    <p className="text-4xl font-black text-sts-blue">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(selectedTraining.price)}
                    </p>
                  </div>
                  
                  <form className="space-y-4" onSubmit={handleSubmit(onEnrollSubmit)}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nom complet</label>
                      <Input {...register("name")} className={cn("bg-white", errors.name && "border-red-500")} />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                      <Input type="email" {...register("email")} className={cn("bg-white", errors.email && "border-red-500")} />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléphone</label>
                      <Input {...register("phone")} className="bg-white" />
                    </div>
                    <Button 
                      type="submit"
                      disabled={submitting}
                      className="w-full h-14 bg-sts-blue hover:bg-sts-black text-white font-bold mt-6 disabled:opacity-50"
                    >
                      {submitting ? "Envoi en cours..." : "Valider mon inscription"} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </div>

                <div className="p-6 rounded-3xl bg-sts-green/5 border border-sts-green/10">
                  <h5 className="font-bold text-sts-green mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Certification STS
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    À l'issue de cette formation, vous recevrez un certificat de réussite reconnu par STS SOFITRANS SERVICE et ses partenaires.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CTASection title="Une formation sur mesure ?" description="Nous concevons des programmes spécifiques pour les entreprises et les groupes." />
    </div>
  );
}
