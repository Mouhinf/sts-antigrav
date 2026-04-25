"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Plus, MoreVertical, Edit, 
  Trash2, Eye, Filter, ChevronLeft, 
  ChevronRight, X, Image as ImageIcon,
  Check, AlertTriangle, Loader2, Upload
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, startAfter } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema } from "@/lib/validations";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 10;

export default function AdminImmobilierPage() {
  console.error("🏗️ Rendu AdminImmobilierPage");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProp, setCurrentProp] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      city: "Dakar",
      category: "Villa",
      type: "sale",
      area: 0,
      beds: 0,
      baths: 0,
      images: [] as string[],
      featured: false
    }
  });

  const images = watch("images");

  useEffect(() => {
    fetchProperties(true);
  }, []);

  useEffect(() => {
    if (currentProp) {
      reset({
        ...currentProp,
        price: Number(currentProp.price),
        area: Number(currentProp.area || 0),
        beds: Number(currentProp.beds || 0),
        baths: Number(currentProp.baths || 0),
      });
    } else {
      reset({
        title: "",
        description: "",
        price: 0,
        location: "",
        city: "Dakar",
        category: "Villa",
        type: "sale",
        area: 0,
        beds: 0,
        baths: 0,
        images: [],
        featured: false
      });
    }
  }, [currentProp, isModalOpen, reset]);

  const fetchProperties = async (isNew = false) => {
    setLoading(true);
    try {
      console.error("🔍 FETCH START");
      let q = query(collection(db, "properties"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
      
      if (!isNew && lastDoc) {
        q = query(collection(db, "properties"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      console.error(`✅ FETCH SUCCESS: ${snap.size} docs`);
      const newProps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isNew) {
        setProperties(newProps);
      } else {
        setProperties(prev => [...prev, ...newProps]);
      }

      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === ITEMS_PER_PAGE);
    } catch (error: any) {
      console.error("❌ Erreur Firestore détaillée :", error.code, error.message);
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
      const propData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      if (currentProp) {
        await updateDoc(doc(db, "properties", currentProp.id), propData);
        toast.success("Bien mis à jour !");
      } else {
        await addDoc(collection(db, "properties"), {
          ...propData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Bien publié !");
      }
      
      setIsModalOpen(false);
      fetchProperties(true);
    } catch (error: any) {
      toast.error("Erreur de sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Supprimer ce bien ?")) {
      try {
        await deleteDoc(doc(db, "properties", id));
        toast.success("Bien supprimé !");
        fetchProperties(true);
      } catch (error) {
        toast.error("Erreur.");
      }
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "properties", id), { featured: !current });
      toast.success("Statut mis à jour !");
      setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p));
    } catch (error) {
      toast.error("Erreur.");
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-playfair tracking-tight">Gestion Immobilier</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Gérez votre catalogue de biens immobiliers</p>
        </div>
        <Button 
          onClick={() => { setCurrentProp(null); setIsModalOpen(true); }}
          className="h-14 px-8 bg-sts-blue hover:bg-sts-black text-white rounded-2xl shadow-xl shadow-sts-blue/20 flex items-center gap-3 font-bold"
        >
          <Plus className="w-5 h-5" /> Ajouter un Bien
        </Button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/30 border border-slate-50 flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <Input 
            placeholder="Rechercher par titre, ville, prix..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-14 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sts-blue/10"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Bien</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Localisation</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Featured</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && properties.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-20 bg-slate-50/20" />
                  </tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">Aucun bien disponible.</td>
                </tr>
              ) : (
                properties.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase())).map((prop) => (
                  <tr key={prop.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                          <Image src={prop.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"} alt={prop.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-sts-black line-clamp-1">{prop.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{prop.category} · {prop.area}m²</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-slate-600">{prop.location}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{prop.city}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-sts-blue">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(prop.price)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                        prop.type === "sale" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                      )}>
                        {prop.type === "sale" ? "À Vendre" : "À Louer"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                        className={cn(
                          "w-10 h-6 rounded-full transition-all relative p-1",
                          prop.featured ? "bg-sts-green" : "bg-slate-200"
                        )}
                      >
                        <div className={cn("w-4 h-4 rounded-full bg-white transition-all", prop.featured ? "translate-x-4" : "translate-x-0")} />
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setCurrentProp(prop); setIsModalOpen(true); }}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-sts-blue hover:bg-white transition-all shadow-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(prop.id)}
                          className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {hasMore && (
          <div className="p-8 border-t border-slate-50 text-center">
            <Button 
              onClick={() => fetchProperties()} 
              disabled={loading}
              className="h-12 px-8 bg-slate-50 hover:bg-sts-blue hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Charger Plus de Biens"}
            </Button>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-sts-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black font-playfair">{currentProp ? "Modifier le Bien" : "Ajouter un Bien"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-sts-black transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Titre de l'annonce</label>
                <Input 
                  {...register("title")}
                  placeholder="Villa de luxe avec piscine..." 
                  className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.title && "ring-2 ring-red-500")} 
                />
                {errors.title && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.title.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Catégorie</label>
                <select 
                  {...register("category")}
                  className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 text-sm font-medium outline-none"
                >
                  <option>Villa</option>
                  <option>Appartement</option>
                  <option>Terrain</option>
                  <option>Bureau</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Description</label>
                <textarea 
                  {...register("description")}
                  className={cn("w-full min-h-[150px] rounded-[2rem] bg-slate-50 border-none p-8 text-sm outline-none", errors.description && "ring-2 ring-red-500")} 
                  placeholder="Description complète du bien..." 
                />
                {errors.description && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.description.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Prix (XOF)</label>
                <Input 
                  type="number" 
                  {...register("price", { valueAsNumber: true })}
                  placeholder="75000000" 
                  className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.price && "ring-2 ring-red-500")} 
                />
                {errors.price && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.price.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Type d'offre</label>
                <select 
                  {...register("type")}
                  className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 text-sm font-medium outline-none"
                >
                  <option value="sale">Vente</option>
                  <option value="rent">Location</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Surface (m²)</label>
                  <Input type="number" {...register("area", { valueAsNumber: true })} className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Chambres</label>
                  <Input type="number" {...register("beds", { valueAsNumber: true })} className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">SDB</label>
                  <Input type="number" {...register("baths", { valueAsNumber: true })} className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Localisation (Adresse)</label>
                <Input {...register("location")} placeholder="Zac Mbao, Sipres..." className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.location && "ring-2 ring-red-500")} />
                {errors.location && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.location.message as string}</p>}
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Images du bien</label>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg">
                      <Image src={url} alt="Bien" fill className="object-cover" />
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
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full h-16 bg-sts-blue hover:bg-sts-black text-white font-black text-lg rounded-2xl shadow-xl shadow-sts-blue/10"
                >
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : currentProp ? "Mettre à jour" : "Publier le Bien"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
