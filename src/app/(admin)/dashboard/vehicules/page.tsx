"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Search, Filter, X, 
  Car, Users, Shield, Clock, ImageIcon, Upload, Loader2
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, startAfter } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/lib/validations";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 9;

export default function AdminVehiculesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      type: "SUV / 4x4",
      capacity: 5,
      mode: "rent",
      pricePerDay: 0,
      price: 0,
      features: "",
      images: [] as string[],
      available: true
    }
  });

  const images = watch("images");

  useEffect(() => {
    fetchVehicles(true);
  }, []);

  useEffect(() => {
    if (currentVehicle) {
      reset({
        ...currentVehicle,
        year: Number(currentVehicle.year),
        capacity: Number(currentVehicle.capacity),
        pricePerDay: Number(currentVehicle.pricePerDay || 0),
        price: Number(currentVehicle.price || 0),
      });
    } else {
      reset({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        type: "SUV / 4x4",
        capacity: 5,
        mode: "rent",
        pricePerDay: 0,
        price: 0,
        features: "",
        images: [],
        available: true
      });
    }
  }, [currentVehicle, isModalOpen, reset]);

  const fetchVehicles = async (isNew = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
      
      if (!isNew && lastDoc) {
        q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      const newVehicles = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isNew) {
        setVehicles(newVehicles);
      } else {
        setVehicles(prev => [...prev, ...newVehicles]);
      }

      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      toast.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setValue("images", [...images, data.url]);
        toast.success("Image ajoutée !");
      } else {
        toast.error(data.error || "Erreur d'upload.");
      }
    } catch (error) {
      toast.error("Erreur d'upload.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const vehicleData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      if (currentVehicle) {
        await updateDoc(doc(db, "vehicles", currentVehicle.id), vehicleData);
        toast.success("Véhicule mis à jour !");
      } else {
        await addDoc(collection(db, "vehicles"), {
          ...vehicleData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Véhicule ajouté !");
      }
      
      setIsModalOpen(false);
      fetchVehicles(true);
    } catch (error: any) {
      toast.error("Erreur de sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce véhicule ?")) {
      try {
        await deleteDoc(doc(db, "vehicles", id));
        toast.success("Véhicule supprimé.");
        fetchVehicles(true);
      } catch (error) {
        toast.error("Erreur.");
      }
    }
  };

  const handleToggleAvailable = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "vehicles", id), { available: !current });
      toast.success("Disponibilité mise à jour !");
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, available: !current } : v));
    } catch (error) {
      toast.error("Erreur.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-playfair tracking-tight">Flotte Automobile</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Gérez vos véhicules et tarifs de location</p>
        </div>
        <Button 
          onClick={() => { setCurrentVehicle(null); setIsModalOpen(true); }}
          className="h-14 px-8 bg-sts-blue hover:bg-sts-black text-white rounded-2xl shadow-xl flex items-center gap-3 font-bold"
        >
          <Plus className="w-5 h-5" /> Ajouter un Véhicule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && vehicles.length === 0 ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-80 bg-white rounded-3xl animate-pulse shadow-sm" />)
        ) : vehicles.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold bg-white rounded-3xl">Aucun véhicule.</div>
        ) : (
          vehicles.map((v) => (
            <div key={v.id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 overflow-hidden group">
              <div className="relative h-56">
                <Image src={v.images?.[0] || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600"} alt={v.brand} fill className="object-cover transition-transform group-hover:scale-105" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className={cn(
                    "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-lg",
                    v.mode === 'sale' ? "bg-sts-blue text-white" : v.mode === 'both' ? "bg-purple-500 text-white" : "bg-white text-sts-black"
                  )}>
                    {v.mode === 'sale' ? "À Vendre" : v.mode === 'both' ? "Vente & Location" : "À Louer"}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <button 
                    onClick={() => handleToggleAvailable(v.id, v.available)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-lg",
                      v.available ? "bg-sts-green text-white" : "bg-red-500 text-white"
                    )}
                  >
                    {v.available ? "Disponible" : "Indisponible"}
                  </button>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black font-playfair mb-1">{v.brand} {v.model}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{v.type} · {v.capacity} places</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div>
                    {v.mode !== 'rent' && <p className="text-lg font-black text-sts-blue">{v.price ? new Intl.NumberFormat('fr-FR').format(v.price) : 0} XOF</p>}
                    {v.mode !== 'sale' && <p className="text-sm font-bold text-sts-black">{v.pricePerDay ? new Intl.NumberFormat('fr-FR').format(v.pricePerDay) : 0} XOF <span className="text-[10px] text-slate-400">/ jour</span></p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setCurrentVehicle(v); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-sts-blue hover:bg-white transition-all shadow-sm">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="text-center py-8">
          <Button 
            onClick={() => fetchVehicles()} 
            disabled={loading}
            className="h-12 px-8 bg-white border border-slate-100 hover:bg-sts-blue hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Charger Plus"}
          </Button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-sts-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black font-playfair">{currentVehicle ? "Modifier le Véhicule" : "Ajouter un Véhicule"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-sts-black transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Marque</label>
                <Input {...register("brand")} placeholder="Toyota, Hyundai..." className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.brand && "ring-2 ring-red-500")} />
                {errors.brand && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.brand.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Modèle</label>
                <Input {...register("model")} placeholder="Prado, Tucson..." className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.model && "ring-2 ring-red-500")} />
                {errors.model && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.model.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Année</label>
                <Input type="number" {...register("year", { valueAsNumber: true })} placeholder="2023" className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Type de véhicule</label>
                <select {...register("type")} className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 text-sm font-medium outline-none">
                  <option>SUV / 4x4</option>
                  <option>Berline</option>
                  <option>Bus / Minibus</option>
                  <option>Utilitaire</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Mode d'offre</label>
                <select {...register("mode")} className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 text-sm font-medium outline-none">
                  <option value="rent">Location uniquement</option>
                  <option value="sale">Vente uniquement</option>
                  <option value="both">Location & Vente</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Capacité (Places)</label>
                <Input type="number" {...register("capacity", { valueAsNumber: true })} placeholder="5" className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
              </div>
              
              {watch("mode") !== "sale" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Prix par jour (Location - XOF)</label>
                  <Input type="number" {...register("pricePerDay", { valueAsNumber: true })} placeholder="50000" className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.pricePerDay && "ring-2 ring-red-500")} />
                  {errors.pricePerDay && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.pricePerDay.message as string}</p>}
                </div>
              )}

              {watch("mode") !== "rent" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Prix de vente total (Achat - XOF)</label>
                  <Input type="number" {...register("price", { valueAsNumber: true })} placeholder="15000000" className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.price && "ring-2 ring-red-500")} />
                  {errors.price && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.price.message as string}</p>}
                </div>
              )}

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Équipements (séparés par des virgules)</label>
                <textarea {...register("features")} className="w-full min-h-[100px] rounded-[2rem] bg-slate-50 border-none p-8 text-sm outline-none" placeholder="Climatisation, GPS, Bluetooth, Assurance incluse..." />
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Images du véhicule</label>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg">
                      <Image src={url} alt="Véhicule" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => setValue("images", images.filter((_: any, idx: number) => idx !== i))}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-sts-blue hover:bg-sts-blue/5 transition-all group">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-sts-blue animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-slate-300 group-hover:text-sts-blue transition-colors" />
                        <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Ajouter</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
                {errors.images && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.images.message as string}</p>}
              </div>

              <div className="md:col-span-2 pt-6">
                <Button type="submit" disabled={submitting} className="w-full h-16 bg-sts-blue hover:bg-sts-black text-white font-black text-lg rounded-2xl shadow-xl">
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : currentVehicle ? "Mettre à jour" : "Ajouter au Parc"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
