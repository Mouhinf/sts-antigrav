"use client";

import React from "react";
import { Sprout, Plus, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminAgrobusinessPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-playfair flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sts-green/10 flex items-center justify-center text-sts-green">
              <Sprout className="w-5 h-5" />
            </div>
            Catalogue Agrobusiness
          </h1>
          <p className="text-slate-500 mt-2">
            Gérez vos offres de volailles, céréales et produits transformés.
          </p>
        </div>
        
        <Button className="h-12 bg-sts-green hover:bg-sts-black text-white font-bold px-6 shadow-lg shadow-sts-green/20">
          <Plus className="w-5 h-5 mr-2" /> Ajouter un produit
        </Button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Rechercher un produit..." 
            className="pl-10 h-10 bg-slate-50 border-none"
          />
        </div>
        <select className="h-10 px-4 rounded-xl bg-slate-50 border-none text-sm font-medium outline-none cursor-pointer">
          <option>Toutes les catégories</option>
          <option>Élevage (Volailles)</option>
          <option>Agriculture (Céréales)</option>
          <option>Transformation</option>
        </select>
      </div>

      {/* CONTENT PLACEHOLDER */}
      <div className="bg-white rounded-3xl p-12 border border-slate-100 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold font-playfair mb-2">Module en cours de configuration</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Ce module est prêt à accueillir vos produits et offres agrobusiness. Une fois configuré avec la base de données, vos produits s'afficheront ici.
        </p>
        <Button variant="outline" className="h-12 px-8 border-slate-200 text-slate-600 hover:bg-slate-50">
          Contacter le support technique
        </Button>
      </div>
    </div>
  );
}
