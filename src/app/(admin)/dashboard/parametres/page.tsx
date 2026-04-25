"use client";

import React, { useState, useEffect } from "react";
import { db, doc, getDoc, updateDoc } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, Settings2, Globe } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ParametresPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    heroTitle: "STS SOFITRANS",
    heroSubtitle: "Bienvenue dans l'univers de STS SOFITRANS SERVICE, une entreprise sénégalaise innovante dirigée par Badara Niang, jeune entrepreneur engagé pour un Sénégal émergent et autonome.",
    vision: "STS, c’est aussi une vision : servir, former, entreprendre, et bâtir l’avenir de notre pays et du continent"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des paramètres :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "settings", "general");
      await updateDoc(docRef, settings).catch(async (error) => {
        // If document doesn't exist, setDoc should be used, but since we are lazy loading we can use a workaround or use setDoc.
        // Let's import setDoc dynamically or just assume updateDoc works if the document is created.
        // Actually, we should use setDoc with merge: true to avoid "No document to update" error.
        const { setDoc } = await import("firebase/firestore");
        await setDoc(docRef, settings, { merge: true });
      });
      toast.success("Paramètres mis à jour avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement des paramètres.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500 animate-pulse">Chargement des paramètres...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-sts-blue/10 text-sts-blue flex items-center justify-center">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-playfair">Paramètres du Site</h1>
          <p className="text-slate-500">Gérez le texte d'accueil et la vision de STS.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-8">
        <div className="flex items-center gap-2 text-sts-green font-bold text-lg border-b border-slate-100 pb-4">
          <Globe className="w-5 h-5" />
          <span>Textes de la Page d'Accueil</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Titre Principal (Hero)</label>
            <Input 
              name="heroTitle" 
              value={settings.heroTitle} 
              onChange={handleChange} 
              className="h-14 bg-slate-50 border-none font-bold text-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sous-titre / Bienvenue</label>
            <textarea 
              name="heroSubtitle" 
              value={settings.heroSubtitle} 
              onChange={handleChange} 
              className="w-full min-h-[120px] p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sts-blue"
            />
            <p className="text-xs text-slate-400">Ce texte apparaît en haut de la page d'accueil (ex: "Bienvenue dans l'univers de STS...").</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vision (Citation animée)</label>
            <textarea 
              name="vision" 
              value={settings.vision} 
              onChange={handleChange} 
              className="w-full min-h-[80px] p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-sts-green italic font-medium"
            />
            <p className="text-xs text-slate-400">Citation affichée sous l'animation machine à écrire.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="h-14 px-8 bg-sts-blue hover:bg-sts-black text-white font-bold"
          >
            {saving ? "Enregistrement..." : "Enregistrer les modifications"} <Save className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
