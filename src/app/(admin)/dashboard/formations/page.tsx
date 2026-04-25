"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Edit, Trash2, Search, Filter, X, 
  GraduationCap, Clock, User, Calendar, ImageIcon,
  Tag, BookOpen, Layers, Upload, Loader2
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, startAfter } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trainingSchema } from "@/lib/validations";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 10;

export default function AdminFormationsPage() {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTraining, setCurrentTraining] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: "",
      category: "Management",
      description: "",
      duration: "",
      price: 0,
      instructor: "",
      sessionDate: "",
      totalPlaces: 20,
      program: "",
      images: [] as string[]
    }
  });

  const images = watch("images");

  useEffect(() => {
    fetchTrainings(true);
  }, []);

  useEffect(() => {
    if (currentTraining) {
      reset({
        ...currentTraining,
        price: Number(currentTraining.price),
        totalPlaces: Number(currentTraining.totalPlaces),
      });
    } else {
      reset({
        title: "",
        category: "Management",
        description: "",
        duration: "",
        price: 0,
        instructor: "",
        sessionDate: "",
        totalPlaces: 20,
        program: "",
        images: []
      });
    }
  }, [currentTraining, isModalOpen, reset]);

  const fetchTrainings = async (isNew = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "trainings"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
      
      if (!isNew && lastDoc) {
        q = query(collection(db, "trainings"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      const newTrainings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isNew) {
        setTrainings(newTrainings);
      } else {
        setTrainings(prev => [...prev, ...newTrainings]);
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
        setValue("images", [data.url]); // Training usually has one main image
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
      const trainingData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      if (currentTraining) {
        await updateDoc(doc(db, "trainings", currentTraining.id), trainingData);
        toast.success("Formation mise à jour !");
      } else {
        await addDoc(collection(db, "trainings"), {
          ...trainingData,
          createdAt: new Date().toISOString(),
        });
        toast.success("Formation ajoutée !");
      }
      
      setIsModalOpen(false);
      fetchTrainings(true);
    } catch (error: any) {
      toast.error("Erreur de sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette formation ?")) {
      try {
        await deleteDoc(doc(db, "trainings", id));
        toast.success("Formation supprimée.");
        fetchTrainings(true);
      } catch (error) {
        toast.error("Erreur.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-playfair tracking-tight">Gestion Formations</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Gérez vos programmes de formation certifiants</p>
        </div>
        <Button 
          onClick={() => { setCurrentTraining(null); setIsModalOpen(true); }}
          className="h-14 px-8 bg-sts-green hover:bg-sts-black text-white rounded-2xl shadow-xl shadow-sts-green/20 flex items-center gap-3 font-bold"
        >
          <Plus className="w-5 h-5" /> Nouvelle Formation
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Formation</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Durée</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Session</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && trainings.length === 0 ? (
                [...Array(3)].map((_, i) => <tr key={i} className="h-20 animate-pulse"><td colSpan={6} className="bg-slate-50/20" /></tr>)
              ) : trainings.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">Aucune formation.</td></tr>
              ) : (
                trainings.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                          <Image src={t.images?.[0] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200"} alt={t.title} fill className="object-cover" />
                        </div>
                        <p className="font-bold text-sm text-sts-black">{t.title}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-sts-blue bg-sts-blue/5 px-2.5 py-1 rounded-full uppercase tracking-widest">{t.category}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{t.duration}</td>
                    <td className="px-8 py-6 text-sm font-black text-sts-black">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(t.price)}</td>
                    <td className="px-8 py-6 text-xs font-medium text-slate-400">{t.sessionDate}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setCurrentTraining(t); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-sts-blue transition-all shadow-sm"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
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
            <Button onClick={() => fetchTrainings()} disabled={loading} className="h-12 px-8 bg-slate-50 hover:bg-sts-green hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Charger Plus"}
            </Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-sts-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl bg-white rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black font-playfair">{currentTraining ? "Modifier la Formation" : "Ajouter une Formation"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-sts-black transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Titre de la formation</label>
                <Input {...register("title")} placeholder="Gestion de Projet, Marketing Digital..." className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.title && "ring-2 ring-red-500")} />
                {errors.title && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.title.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Catégorie</label>
                <select {...register("category")} className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 text-sm font-medium outline-none">
                  <option>Management</option>
                  <option>Digital</option>
                  <option>Logistique</option>
                  <option>Soft Skills</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Description courte</label>
                <textarea {...register("description")} className={cn("w-full min-h-[100px] rounded-[2rem] bg-slate-50 border-none p-8 text-sm outline-none", errors.description && "ring-2 ring-red-500")} placeholder="Objectifs et public visé..." />
                {errors.description && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.description.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Durée (ex: 3 jours, 40h)</label>
                <Input {...register("duration")} placeholder="5 jours" className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Prix (XOF)</label>
                <Input type="number" {...register("price", { valueAsNumber: true })} placeholder="150000" className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.price && "ring-2 ring-red-500")} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Formateur / Expert</label>
                <Input {...register("instructor")} placeholder="Nom du formateur" className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Date de la session</label>
                <Input type="date" {...register("sessionDate")} className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Places totales</label>
                <Input type="number" {...register("totalPlaces", { valueAsNumber: true })} placeholder="20" className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Programme détaillé (Markdown supporté)</label>
                <textarea {...register("program")} className={cn("w-full min-h-[200px] rounded-[2rem] bg-slate-50 border-none p-8 text-sm outline-none", errors.program && "ring-2 ring-red-500")} placeholder="Module 1: ... \nModule 2: ..." />
                {errors.program && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.program.message as string}</p>}
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Image de couverture</label>
                {images.length > 0 ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl group max-w-md mx-auto">
                    <Image src={images[0]} alt="Formation" fill className="object-cover" />
                    <button type="button" onClick={() => setValue("images", [])} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <label className="w-full h-48 rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-sts-green hover:bg-sts-green/5 transition-all group">
                    {uploading ? <Loader2 className="w-8 h-8 text-sts-green animate-spin" /> : <><Upload className="w-8 h-8 text-slate-300 group-hover:text-sts-green transition-colors" /><span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Uploader l'image</span></>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  </label>
                )}
                {errors.images && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase text-center">{errors.images.message as string}</p>}
              </div>

              <div className="md:col-span-2 pt-6">
                <Button type="submit" disabled={submitting} className="w-full h-16 bg-sts-green hover:bg-sts-black text-white font-black text-lg rounded-2xl shadow-xl shadow-sts-green/10">
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : currentTraining ? "Mettre à jour" : "Publier la Formation"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
