"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Sprout, Leaf, Globe, Ship, Store, 
  ArrowRight, CheckCircle2, TrendingUp, Handshake, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quoteSchema } from "@/lib/validations";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const domains = [
  {
    title: "Production Agricole",
    desc: "Exploitation de terres fertiles avec des techniques modernes et durables pour une productivité optimale.",
    icon: <Sprout className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Distribution & Logistique",
    desc: "Chaîne d'approvisionnement optimisée pour garantir la fraîcheur des produits du champ jusqu'au consommateur.",
    icon: <Store className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Export & International",
    desc: "Valorisation des produits locaux sur les marchés internationaux avec le respect des normes de qualité.",
    icon: <Ship className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000"
  }
];

export default function AgrobusinessPage() {
  const [submitting, setSubmitting] = useState(false);

  // Formulaire de partenariat
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      email: "",
      service: "Agrobusiness",
      message: ""
    }
  });

  const onPartnershipSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        toast.success("Votre proposition de partenariat a été envoyée !");
        reset();
      } else {
        toast.error("Erreur lors de l'envoi de la proposition.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-sts-green">
        <Image 
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000"
          alt="Agriculture Sénégal"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sts-green/80 via-transparent to-sts-green/20" />
        
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mt-12"
          >
            <h1 className="text-6xl md:text-9xl font-black font-playfair text-white mb-8 tracking-tighter">
              Agro<span className="text-sts-blue">business</span>
            </h1>
            <p className="text-2xl text-white font-medium leading-relaxed max-w-2xl italic">
              "Cultiver l'avenir, nourrir la nation."
            </p>
          </motion.div>
        </div>
      </section>

      {/* DOMAINES D'ACTIVITÉ */}
      <section className="py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] text-sts-green uppercase mb-6">Expertise Agricole</h2>
            <p className="text-4xl md:text-6xl font-black font-playfair">Solutions Agricoles Innovantes</p>
            <p className="text-slate-500 mt-8 text-lg">
              Nous combinons savoir-faire ancestral et technologies modernes pour transformer le secteur agricole sénégalais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {domains.map((domain, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col h-full"
              >
                <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-8 shadow-xl">
                  <Image src={domain.image} alt={domain.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-sts-green/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-sts-green/10 flex items-center justify-center text-sts-green mb-6 group-hover:bg-sts-green group-hover:text-white transition-all duration-500">
                  {domain.icon}
                </div>
                <h3 className="text-2xl font-bold font-playfair mb-4">{domain.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-8 flex-grow">{domain.desc}</p>
                <div className="flex items-center gap-2 font-bold text-sts-green group-hover:gap-4 transition-all cursor-pointer">
                  En savoir plus <ArrowRight className="w-5 h-5" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CONTENT GRID */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black font-playfair">Nourrir le présent, cultiver l'avenir.</h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                STS SOFITRANS SERVICE s'engage dans le développement d'une agriculture moderne et durable, contribuant activement à l'autonomie alimentaire du continent.
              </p>
              
              <div className="grid gap-6">
                {[
                  { title: "Élevage de volailles & Aviculture", icon: <CheckCircle2 /> },
                  { title: "Transformation d'aliments locaux", icon: <CheckCircle2 /> },
                  { title: "Culture de céréales & maraîchage", icon: <CheckCircle2 /> },
                  { title: "Distribution et circuits courts", icon: <CheckCircle2 /> }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-sts-green/10 text-sts-green flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="font-bold text-slate-700">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-sts-green/10 border border-slate-100"
              >
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <Handshake className="w-6 h-6 text-sts-green" /> Formulaire de Partenariat
                </h3>
                <form className="space-y-6" onSubmit={handleSubmit(onPartnershipSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Input placeholder="Nom complet" {...register("name")} className={cn("h-14", errors.name && "border-red-500")} />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Input placeholder="Email professionnel" {...register("email")} className={cn("h-14", errors.email && "border-red-500")} />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message as string}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <textarea 
                      placeholder="Décrivez votre projet ou votre demande..."
                      {...register("message")}
                      className={cn(
                        "w-full min-h-[150px] p-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-sts-green outline-none transition-all",
                        errors.message && "border-red-500"
                      )}
                    />
                    {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.message.message as string}</p>}
                  </div>
                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="w-full h-16 bg-sts-green hover:bg-sts-black text-white font-black text-lg disabled:opacity-50"
                  >
                    {submitting ? "Envoi en cours..." : "Envoyer ma proposition"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Prêt à investir dans la terre ?" description="Découvrez nos opportunités d'investissement en agrobusiness dès aujourd'hui." />
    </div>
  );
}
