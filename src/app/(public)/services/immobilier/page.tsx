"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, Home, Building2, LandPlot, 
  Filter, SlidersHorizontal, X, ArrowRight,
  Phone, Calendar, Info, CheckCircle2
} from "lucide-react";
import { db, collection, getDocs, query, where, orderBy } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { CTASection } from "@/components/sections/CTASection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/validations";
import { toast } from "sonner";

// Types
type PropertyType = "Appartement" | "Maison" | "Terrain" | "Bureau" | "Villa" | "Tout";
type City = "Dakar" | "Thiès" | "Saint-Louis" | "Mbour" | "Ziguinchor" | "Tout";
type Status = "À vendre" | "À louer" | "Tout";

export default function ImmobilierPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Filtres
  const [type, setType] = useState<PropertyType>("Tout");
  const [city, setCity] = useState<City>("Tout");
  const [status, setStatus] = useState<Status>("Tout");
  const [maxPrice, setMaxPrice] = useState<number>(500000000);
  const [searchTerm, setSearchTerm] = useState("");

  // Formulaire de visite
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "Demande de visite immobilière",
      message: "Je souhaite visiter ce bien d'exception.",
      type: "visite_immobiliere"
    }
  });

  const onVisitSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subject: `Demande de visite: ${selectedProperty?.title}`,
          property: selectedProperty?.id
        })
      });

      if (res.ok) {
        toast.success("Votre demande de visite a été envoyée !");
        reset();
        setSelectedProperty(null);
      } else {
        toast.error("Erreur lors de l'envoi de la demande.");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [type, city, status, maxPrice]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, "properties"));
      
      // Note: On Firebase filtering is limited in basic queries without composite indexes.
      // For this demo, we'll fetch and filter locally or apply basic where clauses.
      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      // Filtrage local pour la flexibilité
      results = results.filter(p => {
        const matchType = type === "Tout" || p.category === type;
        const matchCity = city === "Tout" || p.location?.includes(city);
        const matchStatus = status === "Tout" || (status === "À vendre" ? p.type === "sale" : p.type === "rent");
        const matchPrice = p.price <= maxPrice;
        const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchType && matchCity && matchStatus && matchPrice && matchSearch;
      });

      setProperties(results);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-sts-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000"
            alt="Real Estate Hero"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sts-black via-sts-black/60 to-white" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-3xl"
            >
              <h1 className="text-6xl md:text-8xl font-black font-playfair mb-8 tracking-tighter">
                Notre Catalogue <br />
                <span className="text-sts-green">Immobilier</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed max-w-xl">
                Trouvez le bien de vos rêves parmi notre sélection exclusive de terrains, villas et appartements au Sénégal.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex items-center gap-12"
            >
              <div className="text-center">
                <p className="text-4xl font-black text-white">{properties.length}</p>
                <p className="text-xs font-bold text-sts-green uppercase tracking-widest mt-2">Biens Dispos</p>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <p className="text-4xl font-black text-white">5</p>
                <p className="text-xs font-bold text-sts-green uppercase tracking-widest mt-2">Villes</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FILTERS BAR */}
      <section className="relative z-20 -mt-10 px-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Search className="w-3 h-3" /> Recherche
                </label>
                <Input 
                  placeholder="Quartier, mot-clé..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl border-slate-100 bg-slate-50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> Type de bien
                </label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as PropertyType)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-sts-green outline-none"
                >
                  <option value="Tout">Tous les types</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison</option>
                  <option value="Villa">Villa</option>
                  <option value="Terrain">Terrain</option>
                  <option value="Bureau">Bureau</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Ville
                </label>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value as City)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-sts-green outline-none"
                >
                  <option value="Tout">Toutes les villes</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Mbour">Mbour</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info className="w-3 h-3" /> Statut
                </label>
                <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                  {["Tout", "À vendre", "À louer"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s as Status)}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                        status === s ? "bg-white text-sts-green shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={fetchProperties}
                className="h-12 rounded-xl bg-sts-green hover:bg-sts-black text-white font-bold"
              >
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[500px] bg-slate-100 animate-pulse rounded-[2rem]" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem]">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-bold font-playfair">Aucun bien trouvé</h3>
              <p className="text-slate-500 mt-2">Essayez de modifier vos critères de recherche.</p>
              <Button 
                variant="outline" 
                className="mt-8"
                onClick={() => {
                  setType("Tout");
                  setCity("Tout");
                  setStatus("Tout");
                  setSearchTerm("");
                  setMaxPrice(500000000);
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <div key={prop.id} onClick={() => setSelectedProperty(prop)} className="cursor-pointer">
                  <PropertyCard property={prop} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-sts-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-sts-black transition-all flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Galerie Images */}
              <div className="w-full lg:w-3/5 h-64 lg:h-auto relative bg-slate-100">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  className="h-full w-full"
                >
                  {(selectedProperty.images || ["/placeholder-property.jpg"]).map((img: string, i: number) => (
                    <SwiperSlide key={i}>
                      <Image src={img} alt={selectedProperty.title} fill className="object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Infos & Formulaire */}
              <div className="w-full lg:w-2/5 p-8 md:p-12 overflow-y-auto bg-white">
                <div className="mb-8">
                  <span className="text-xs font-bold text-sts-green uppercase tracking-[0.2em]">
                    {selectedProperty.category} · {selectedProperty.location}
                  </span>
                  <h2 className="text-3xl font-black font-playfair mt-2 mb-4">{selectedProperty.title}</h2>
                  <p className="text-3xl font-black text-sts-blue">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(selectedProperty.price)}
                    {selectedProperty.type === "rent" && <span className="text-sm font-normal text-slate-400"> / mois</span>}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Surfaces</p>
                    <p className="font-bold">{selectedProperty.area} m²</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chambres</p>
                    <p className="font-bold">{selectedProperty.beds || 0}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Douches</p>
                    <p className="font-bold">{selectedProperty.baths || 0}</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Info className="w-5 h-5 text-sts-green" /> Description
                  </h4>
                  <p className="text-slate-500 leading-relaxed italic">
                    {selectedProperty.description || "Aucune description détaillée n'a été fournie pour ce bien d'exception."}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sts-green" /> Demander une visite
                  </h4>
                  <form className="space-y-4" onSubmit={handleSubmit(onVisitSubmit)}>
                    <div className="space-y-1">
                      <Input 
                        placeholder="Votre nom complet" 
                        {...register("name")}
                        className={cn("bg-white border-slate-200", errors.name && "border-red-500")} 
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.name.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                      <Input 
                        placeholder="Votre email" 
                        type="email"
                        {...register("email")}
                        className={cn("bg-white border-slate-200", errors.email && "border-red-500")} 
                      />
                      {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.email.message as string}</p>}
                    </div>

                    <div className="space-y-1">
                      <Input 
                        placeholder="Votre téléphone" 
                        {...register("phone")}
                        className="bg-white border-slate-200" 
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={submitting}
                      className="w-full h-14 bg-sts-green hover:bg-sts-black text-white font-bold disabled:opacity-50"
                    >
                      {submitting ? "Envoi en cours..." : "Envoyer ma demande"} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    
                    <Link href={`https://wa.me/221338601234?text=Bonjour, je suis intéressé par le bien: ${selectedProperty.title}`} target="_blank" className="block">
                      <Button type="button" variant="outline" className="w-full h-14 border-slate-200 hover:bg-white flex items-center gap-2 text-green-600">
                        <Phone className="w-4 h-4" /> Discuter sur WhatsApp
                      </Button>
                    </Link>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CTASection />
    </div>
  );
}
