"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: any;
  priority?: boolean;
}

export const PropertyCard = ({ property, priority = false }: PropertyCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-sts-green text-white text-xs font-bold rounded-full shadow-lg">
            {property.type === "sale" ? "À Vendre" : "À Louer"}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-white font-bold text-lg">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(property.price)}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-1 text-slate-400 text-xs mb-2">
          <MapPin className="w-3 h-3" /> {property.location}
        </div>
        <h3 className="text-xl font-bold font-playfair mb-4 line-clamp-1">{property.title}</h3>
        
        <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-4 mb-6">
          <div className="flex flex-col items-center gap-1">
            <Bed className="w-4 h-4 text-sts-blue" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">{property.beds} Lits</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="w-4 h-4 text-sts-blue" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">{property.baths} Bains</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="w-4 h-4 text-sts-blue" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">{property.area} m²</span>
          </div>
        </div>

        <Link 
          href={`/immobilier/${property.id}`}
          className="w-full h-12 rounded-xl border border-slate-100 flex items-center justify-center gap-2 font-bold text-sm text-sts-black hover:bg-sts-black hover:text-white transition-all group/btn"
        >
          Voir les détails <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
