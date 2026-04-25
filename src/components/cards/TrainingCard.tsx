"use client";

import React from "react";
import Image from "next/image";
import { Clock, Users, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface TrainingCardProps {
  training: any;
  onSelect?: (training: any) => void;
}

export const TrainingCard = ({ training, onSelect }: TrainingCardProps) => {
  const isFull = training.enrolled >= training.seats;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full group"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={training.image || "/placeholder-training.jpg"}
          alt={training.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-sts-green text-white border-none">
            {training.category}
          </Badge>
          {isFull && (
            <Badge className="bg-red-500 text-white border-none">
              Complet
            </Badge>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-4 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-sts-green" /> {training.duration}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-sts-green" /> {training.nextSession}
          </div>
        </div>
        
        <h3 className="text-xl font-bold font-playfair mb-4 line-clamp-2 group-hover:text-sts-green transition-colors">
          {training.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {training.description}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Prix</span>
              <span className="text-xl font-black text-sts-black">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(training.price)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Disponibilité</span>
              <span className={cn(
                "text-sm font-bold",
                isFull ? "text-red-500" : "text-sts-green"
              )}>
                {isFull ? "Aucune place" : `${training.seats - training.enrolled} places`}
              </span>
            </div>
          </div>

          <Button 
            onClick={() => onSelect?.(training)}
            disabled={isFull}
            className={cn(
              "w-full h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
              isFull 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-sts-green text-white hover:bg-sts-black shadow-lg shadow-sts-green/20"
            )}
          >
            {isFull ? "Session complète" : "En savoir plus"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
