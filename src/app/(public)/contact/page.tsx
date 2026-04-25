"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, Mail, MapPin, Clock, 
  Send, MessageCircle, ArrowRight,
  CheckCircle2, Building2, User, PhoneCall,
  Globe, LayoutGrid, FileText
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, quoteSchema } from "@/lib/validations";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "devis">("contact");
  const [submitting, setSubmitting] = useState(false);

  // Formulaire Contact
  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "Question Générale", message: "" }
  });

  // Formulaire Devis
  const devisForm = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", service: "Immobilier", message: "", budget: "", deadline: "" }
  });

  const onContactSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Votre message a été envoyé !");
        contactForm.reset();
      } else {
        toast.error("Erreur lors de l'envoi.");
      }
    } catch (error) {
      toast.error("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDevisSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Votre demande de devis a été envoyée !");
        devisForm.reset();
      } else {
        toast.error("Erreur lors de l'envoi.");
      }
    } catch (error) {
      toast.error("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-sts-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,140,62,0.15),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,122,255,0.1),transparent)]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mt-12"
          >
            <h1 className="text-6xl md:text-8xl font-black font-playfair mb-8 tracking-tighter">
              Parlons de <br />
              votre <span className="text-sts-green">Projet</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed max-w-xl">
              Que ce soit pour une visite immobilière, une solution logistique ou une formation, notre équipe est à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Colonne Gauche - Infos */}
            <div className="lg:w-1/3 space-y-12">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold font-playfair">Nos Coordonnées</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-sts-blue group-hover:bg-sts-blue group-hover:text-white transition-all duration-500 shadow-sm">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Téléphone</p>
                      <a href="tel:+221779823550" className="text-lg font-bold hover:text-sts-blue transition-colors">+221 77 982 35 50</a>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-sm">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp</p>
                      <a href="https://wa.me/221779823550" className="text-lg font-bold hover:text-green-600 transition-colors">+221 77 982 35 50</a>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-sts-blue group-hover:bg-sts-blue group-hover:text-white transition-all duration-500 shadow-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <a href="mailto:sofitransservice@gmail.com" className="text-lg font-bold hover:text-sts-blue transition-colors">sofitransservice@gmail.com</a>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-sts-green group-hover:bg-sts-green group-hover:text-white transition-all duration-500 shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adresse</p>
                      <p className="text-lg font-bold">Zac Mbao, Rond Point Sipres, Dakar, Sénégal</p>
                    </div>
                  </div>

                  <div className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-sts-blue group-hover:bg-sts-blue group-hover:text-white transition-all duration-500 shadow-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horaires d'ouverture</p>
                      <p className="text-lg font-bold">Lun - Ven: 08:00 - 18:00</p>
                      <p className="text-slate-500 text-sm italic">Samedi: 09:00 - 13:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-50">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.97123456!2d-17.3123!3d14.7543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQ1JzE1LjUiTiAxN8KwMTgnNDQuNCJX!5e0!3m2!1sfr!2ssn!4v1620000000000!5m2!1sfr!2ssn" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  title="Siège STS SOFITRANS SERVICE - Zac Mbao"
                />
              </div>
            </div>

            {/* Colonne Droite - Formulaires */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Tabs Header */}
                <div className="flex bg-slate-50 p-2 border-b border-slate-100">
                  <button 
                    onClick={() => setActiveTab("contact")}
                    className={cn(
                      "flex-1 py-6 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500",
                      activeTab === "contact" ? "bg-white text-sts-blue shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-black font-playfair text-lg">Nous Contacter</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab("devis")}
                    className={cn(
                      "flex-1 py-6 flex items-center justify-center gap-3 rounded-[2rem] transition-all duration-500",
                      activeTab === "devis" ? "bg-white text-sts-green shadow-xl shadow-slate-200/50" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="font-black font-playfair text-lg">Demande de Devis</span>
                  </button>
                </div>

                <div className="p-10 md:p-16">
                  <AnimatePresence mode="wait">
                    {activeTab === "contact" ? (
                      <motion.div
                        key="contact"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <form className="space-y-8" onSubmit={contactForm.handleSubmit(onContactSubmit)}>
                          <div className="space-y-2">
                            <label htmlFor="contact-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Nom Complet</label>
                            <Input 
                              id="contact-name"
                              aria-required="true"
                              {...contactForm.register("name")} 
                              className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-blue", contactForm.formState.errors.name && "ring-2 ring-red-500")} 
                            />
                            {contactForm.formState.errors.name && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{contactForm.formState.errors.name.message as string}</p>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label htmlFor="contact-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Professionnel</label>
                              <Input 
                                id="contact-email"
                                type="email"
                                aria-required="true"
                                {...contactForm.register("email")} 
                                className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-blue", contactForm.formState.errors.email && "ring-2 ring-red-500")} 
                              />
                              {contactForm.formState.errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{contactForm.formState.errors.email.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="contact-phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Téléphone</label>
                              <Input 
                                id="contact-phone"
                                aria-required="true"
                                {...contactForm.register("phone")} 
                                className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-blue", contactForm.formState.errors.phone && "ring-2 ring-red-500")} 
                              />
                              {contactForm.formState.errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{contactForm.formState.errors.phone.message as string}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="contact-subject" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Sujet</label>
                            <select 
                              id="contact-subject"
                              aria-required="true"
                              {...contactForm.register("subject")}
                              className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-blue text-sm font-medium outline-none"
                            >
                              <option value="Question Générale">Question Générale</option>
                              <option value="Partenariat">Partenariat</option>
                              <option value="Réclamation">Réclamation</option>
                              <option value="Recrutement">Recrutement</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="contact-message" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Votre Message</label>
                            <textarea 
                              id="contact-message"
                              aria-required="true"
                              {...contactForm.register("message")}
                              className={cn(
                                "w-full min-h-[200px] rounded-[2rem] bg-slate-50 border-none p-8 focus:ring-2 focus:ring-sts-blue outline-none transition-all",
                                contactForm.formState.errors.message && "ring-2 ring-red-500"
                              )}
                              placeholder="Comment pouvons-nous vous aider ?"
                            />
                            {contactForm.formState.errors.message && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{contactForm.formState.errors.message.message as string}</p>}
                          </div>

                          <Button 
                            type="submit"
                            disabled={submitting}
                            className="w-full h-20 bg-sts-blue hover:bg-sts-black text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-sts-blue/20 transition-all active:scale-95"
                          >
                            {submitting ? "Envoi en cours..." : "Envoyer mon message"} <ArrowRight className="ml-3 w-6 h-6" />
                          </Button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="devis"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <form className="space-y-8" onSubmit={devisForm.handleSubmit(onDevisSubmit)}>
                          <div className="space-y-2">
                            <label htmlFor="quote-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Nom Complet</label>
                            <Input 
                              id="quote-name"
                              aria-required="true"
                              {...devisForm.register("name")} 
                              className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-green", devisForm.formState.errors.name && "ring-2 ring-red-500")} 
                            />
                            {devisForm.formState.errors.name && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{devisForm.formState.errors.name.message as string}</p>}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label htmlFor="quote-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Email Professionnel</label>
                              <Input 
                                id="quote-email"
                                type="email"
                                aria-required="true"
                                {...devisForm.register("email")} 
                                className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-green", devisForm.formState.errors.email && "ring-2 ring-red-500")} 
                              />
                              {devisForm.formState.errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{devisForm.formState.errors.email.message as string}</p>}
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="quote-phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Téléphone</label>
                              <Input 
                                id="quote-phone"
                                aria-required="true"
                                {...devisForm.register("phone")} 
                                className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-green", devisForm.formState.errors.phone && "ring-2 ring-red-500")} 
                              />
                              {devisForm.formState.errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{devisForm.formState.errors.phone.message as string}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label htmlFor="quote-service" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Service Demandé</label>
                              <select 
                                id="quote-service"
                                aria-required="true"
                                {...devisForm.register("service")}
                                className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-green text-sm font-medium outline-none"
                              >
                                <option value="Immobilier">Immobilier (Conception, Vente, Gestion)</option>
                                <option value="Transport & Logistique">Transport & Logistique (Location, Vente)</option>
                                <option value="Hygiène & Services">Hygiène & Services (Nettoyage, Sécurité)</option>
                                <option value="Agrobusiness">Agrobusiness (Élevage, Agriculture)</option>
                                <option value="Formation & Comptabilité">Formation & Comptabilité (Sage Saari)</option>
                                <option value="Marketing & Commerce">Marketing & Commerce</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="quote-company" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Entreprise (Optionnel)</label>
                              <Input id="quote-company" {...devisForm.register("company")} className="h-16 rounded-2xl bg-slate-50 border-none px-6 focus:ring-2 focus:ring-sts-green" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="quote-message" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Description détaillée du besoin</label>
                            <textarea 
                              id="quote-message"
                              aria-required="true"
                              {...devisForm.register("message")}
                              className={cn(
                                "w-full min-h-[200px] rounded-[2rem] bg-slate-50 border-none p-8 focus:ring-2 focus:ring-sts-green outline-none transition-all",
                                devisForm.formState.errors.message && "ring-2 ring-red-500"
                              )}
                              placeholder="Détaillez votre projet pour un devis précis..."
                            />
                            {devisForm.formState.errors.message && <p className="text-[10px] text-red-500 font-bold uppercase ml-4">{devisForm.formState.errors.message.message as string}</p>}
                          </div>

                          <Button 
                            type="submit"
                            disabled={submitting}
                            className="w-full h-20 bg-sts-green hover:bg-sts-black text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-sts-green/20 transition-all active:scale-95"
                          >
                            {submitting ? "Analyse en cours..." : "Obtenir mon Devis"} <ArrowRight className="ml-3 w-6 h-6" />
                          </Button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
