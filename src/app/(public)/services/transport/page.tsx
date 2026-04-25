"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Truck, ShieldCheck, Clock, MapPin, 
  ArrowRight, Calendar, Users, Calculator,
  ChevronRight, Star, CheckCircle2, Phone, X
} from "lucide-react";
import { db, collection, getDocs, query, where } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { VehicleCard } from "@/components/cards/VehicleCard";
import { CTASection } from "@/components/sections/CTASection";
import { cn } from "@/lib/utils";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "@/lib/validations";
import { toast } from "sonner";

export default function TransportPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [selectedMode, setSelectedMode] = useState("Tout");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingVehicle, setBookingVehicle] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulaire de réservation
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      startDate: "",
      endDate: "",
      serviceType: "vehicle" as const,
      pickup: "",
      destination: "",
      notes: "",
      vehicleId: "",
      vehicleName: "",
      totalPrice: 0
    }
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "vehicles"));
        setVehicles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;
    
    if (selectedMode === "Location") {
      filtered = filtered.filter(v => v.mode === "rent" || v.mode === "both");
    } else if (selectedMode === "Vente") {
      filtered = filtered.filter(v => v.mode === "sale" || v.mode === "both");
    }

    if (selectedCategory !== "Tout") {
      filtered = filtered.filter(v => v.type === selectedCategory);
    }
    
    return filtered;
  }, [vehicles, selectedCategory, selectedMode]);

  const categories = ["Tout", "SUV / 4x4", "Berline", "Bus / Minibus", "Utilitaire"];

  // Calcul du prix total
  const totalPrice = useMemo(() => {
    if (!bookingVehicle || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const price = diffDays * (bookingVehicle.pricePerDay || 0);
    
    // Mettre à jour la valeur dans le formulaire
    setValue("totalPrice", price);
    return price;
  }, [bookingVehicle, startDate, endDate, setValue]);

  const handleBook = (vehicle: any) => {
    setBookingVehicle(vehicle);
    setValue("vehicleId", vehicle.id);
    setValue("vehicleName", vehicle.name);
    setIsBookingOpen(true);
  };

  const onBookingSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Réservation envoyée avec succès !");
        setIsBookingOpen(false);
        reset();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Erreur lors de la réservation.");
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
      <section className="relative h-[70vh] flex items-center overflow-hidden bg-sts-black">
        <Image 
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=2000"
          alt="Transport Hero"
          fill
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sts-black via-sts-black/60 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mt-12"
          >
            <span className="inline-block px-6 py-2 rounded-full bg-sts-blue/20 border border-sts-blue/30 text-sts-blue text-xs font-bold uppercase tracking-widest mb-8">
              Logistique & Vente
            </span>
            <h1 className="text-6xl md:text-8xl font-black font-playfair text-white mb-8 tracking-tighter">
              Transport & <br />
              <span className="text-sts-blue">Logistique</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed max-w-xl">
              Vente et location de véhicules, transport touristique et collectif, solutions sur mesure pour particuliers et entreprises.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FLOTTE GRID */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="text-sm font-bold tracking-[0.5em] text-sts-blue uppercase mb-4">Notre Flotte</h2>
              <p className="text-4xl md:text-5xl font-black font-playfair mb-6">Véhicules Disponibles</p>
              
              {/* Mode Filter */}
              <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-2xl w-fit">
                {["Tout", "Location", "Vente"].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={cn(
                      "px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                      selectedMode === mode 
                        ? "bg-white text-sts-blue shadow-sm" 
                        : "text-slate-400 hover:text-sts-blue"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all",
                    selectedCategory === cat 
                      ? "bg-sts-blue text-white shadow-lg shadow-sts-blue/20" 
                      : "bg-white text-slate-400 hover:text-sts-blue border border-slate-100"
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
                <div key={i} className="h-[500px] bg-slate-200 animate-pulse rounded-[3rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} onBook={handleBook} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CALCULATEUR / BOOKING MODAL */}
      <AnimatePresence>
        {isBookingOpen && bookingVehicle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="absolute inset-0 bg-sts-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setIsBookingOpen(false)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-2/5 p-8 md:p-12 bg-slate-50 flex flex-col">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-lg">
                  <Image src={bookingVehicle.image} alt={bookingVehicle.name} fill className="object-cover" />
                </div>
                <h3 className="text-3xl font-black font-playfair mb-4">{bookingVehicle.name}</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Prix par jour</span>
                    <span className="font-bold">{new Intl.NumberFormat('fr-FR').format(bookingVehicle.pricePerDay)} FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Capacité</span>
                    <span className="font-bold">{bookingVehicle.capacity} places</span>
                  </div>
                </div>

                <div className="mt-auto p-6 rounded-3xl bg-sts-blue text-white shadow-xl shadow-sts-blue/20">
                  <div className="flex items-center gap-3 mb-2 opacity-80">
                    <Calculator className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Estimation Totale</span>
                  </div>
                  <div className="text-4xl font-black">
                    {new Intl.NumberFormat('fr-FR').format(totalPrice)} <span className="text-lg">FCFA</span>
                  </div>
                  <p className="text-[10px] mt-2 opacity-60">* Hors carburant et frais additionnels éventuels</p>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto">
                <h4 className="text-2xl font-bold mb-8 flex items-center gap-2">
                   Finaliser votre réservation
                </h4>
                <form onSubmit={handleSubmit(onBookingSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nom complet</label>
                    <Input {...register("clientName")} className={cn(errors.clientName && "border-red-500")} />
                    {errors.clientName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.clientName.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</label>
                    <Input type="email" {...register("clientEmail")} className={cn(errors.clientEmail && "border-red-500")} />
                    {errors.clientEmail && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.clientEmail.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléphone</label>
                    <Input {...register("clientPhone")} className={cn(errors.clientPhone && "border-red-500")} />
                    {errors.clientPhone && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.clientPhone.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date de début</label>
                    <Input type="date" {...register("startDate")} className={cn(errors.startDate && "border-red-500")} />
                    {errors.startDate && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.startDate.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date de fin</label>
                    <Input type="date" {...register("endDate")} className={cn(errors.endDate && "border-red-500")} />
                    {errors.endDate && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.endDate.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lieu de départ</label>
                    <Input placeholder="Ex: Dakar" {...register("pickup")} className={cn(errors.pickup && "border-red-500")} />
                    {errors.pickup && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.pickup.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination</label>
                    <Input placeholder="Ex: Saint-Louis" {...register("destination")} className={cn(errors.destination && "border-red-500")} />
                    {errors.destination && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.destination.message as string}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes (Optionnel)</label>
                    <textarea 
                      className="w-full min-h-[100px] p-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-sts-blue outline-none transition-all"
                      {...register("notes")}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="md:col-span-2 h-16 bg-sts-blue hover:bg-sts-black text-white font-bold text-lg shadow-xl shadow-sts-blue/20 disabled:opacity-50"
                  >
                    {submitting ? "Réservation en cours..." : "Confirmer la réservation"} <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CTASection title="Besoin d'un transport spécifique ?" description="Pour les convois industriels ou les demandes particulières, contactez notre pôle logistique." />
    </div>
  );
}
