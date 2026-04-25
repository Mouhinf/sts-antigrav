"use client";

import React from "react";
import Image from "next/image";
import { Users, Fuel, Settings, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

interface VehicleCardProps {
  vehicle: any;
  onBook?: (vehicle: any) => void;
}

export const VehicleCard = ({ vehicle, onBook }: VehicleCardProps) => {
  const router = useRouter();

  const handleAction = () => {
    if (vehicle.mode === "sale") {
      router.push(`/contact?service=Transport+%26+Logistique&subject=Achat+Véhicule+${vehicle.brand}+${vehicle.model}`);
    } else {
      onBook?.(vehicle);
    }
  };
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col group"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={vehicle.image || "/placeholder-vehicle.jpg"}
          alt={vehicle.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="px-4 py-1.5 bg-sts-blue text-white text-xs font-bold rounded-full shadow-lg w-fit">
            {vehicle.type || "Berline"}
          </span>
          <span className={cn(
            "px-4 py-1.5 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg w-fit",
            vehicle.mode === 'sale' ? "bg-sts-green" : vehicle.mode === 'both' ? "bg-purple-500" : "bg-sts-black"
          )}>
            {vehicle.mode === 'sale' ? "À Vendre" : vehicle.mode === 'both' ? "Vente & Location" : "À Louer"}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex flex-col gap-1">
          {vehicle.mode !== 'rent' && vehicle.price && (
            <p className="text-white font-black text-lg">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(vehicle.price)}
            </p>
          )}
          {vehicle.mode !== 'sale' && vehicle.pricePerDay && (
            <p className="text-white font-bold text-sm">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(vehicle.pricePerDay)}
              <span className="text-[10px] font-normal opacity-80"> / jour</span>
            </p>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold font-playfair mb-6 group-hover:text-sts-blue transition-colors">
          {vehicle.name}
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sts-blue">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{vehicle.capacity} places</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sts-blue">
              <Fuel className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{vehicle.transmission || "Auto"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sts-blue">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{vehicle.fuelType || "Diesel"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-sts-blue">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Assurance incl.</span>
          </div>
        </div>

        <Button 
          onClick={handleAction}
          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-sts-blue text-white font-bold transition-all mt-auto group/btn"
        >
          {vehicle.mode === "sale" ? "Demander un devis" : vehicle.mode === "both" ? "Voir les options" : "Réserver maintenant"} <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};
