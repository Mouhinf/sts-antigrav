"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, User, Mail, 
  Phone, Clock, CheckCircle2, 
  XCircle, Search, Filter, Eye,
  Building, Briefcase, Calendar,
  MessageSquare, ExternalLink, Loader2
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, updateDoc, doc, limit, startAfter } from "@/lib/firebase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const ITEMS_PER_PAGE = 10;

export default function AdminDevisPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchQuotes(true);
  }, [filter]);

  const fetchQuotes = async (isNew = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "quotes"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
      
      if (!isNew && lastDoc) {
        q = query(collection(db, "quotes"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      const newQuotes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isNew) {
        setQuotes(newQuotes);
      } else {
        setQuotes(prev => [...prev, ...newQuotes]);
      }

      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      toast.error("Erreur.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "quotes", id), { status });
      toast.success(`Statut mis à jour : ${status}`);
      setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    } catch (error) {
      toast.error("Erreur.");
    }
  };

  const filteredQuotes = quotes.filter(q => filter === "all" || q.status === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black font-playfair tracking-tight">Demandes de Devis</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Analysez et traitez les demandes commerciales</p>
      </div>

      {/* FILTERS */}
      <div className="flex bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-50 w-fit">
        {["all", "new", "processing", "completed"].map((f) => (
          <button 
            key={f}
            onClick={() => { setFilter(f); setLastDoc(null); }}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              filter === f ? "bg-sts-blue text-white shadow-lg shadow-sts-blue/20" : "text-slate-400 hover:text-sts-black"
            )}
          >
            {f === "all" ? "Tous" : f === "new" ? "Nouveaux" : f === "processing" ? "En cours" : "Traités"}
          </button>
        ))}
      </div>

      {/* QUOTES LIST */}
      <div className="space-y-6">
        {loading && quotes.length === 0 ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse shadow-sm" />)
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-50">
            <p className="text-slate-400 font-bold">Aucun devis trouvé.</p>
          </div>
        ) : (
          filteredQuotes.map((quote) => (
            <motion.div 
              key={quote.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 p-10 group hover:border-sts-blue/20 transition-all"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-12">
                {/* Info Client */}
                <div className="flex-1 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-sts-blue/5 flex items-center justify-center text-sts-blue shadow-inner">
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black font-playfair">{quote.firstName} {quote.lastName}</h3>
                        <p className="text-xs font-bold text-sts-blue uppercase tracking-widest mt-1">{quote.company || "Particulier"}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest h-fit",
                      quote.status === "completed" ? "bg-sts-green text-white" : 
                      quote.status === "processing" ? "bg-sts-blue text-white" : "bg-sts-black text-white"
                    )}>
                      {quote.status || "Nouveau"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] font-bold uppercase tracking-tight text-slate-400">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-sts-blue" /> {quote.email}
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-sts-blue" /> {quote.phone}
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-sts-blue" /> <span className="text-slate-500">Service :</span> <span className="text-sts-black font-black">{quote.service}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-sts-blue" /> <span className="text-slate-500">Reçu le :</span> {new Date(quote.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Message / Besoin */}
                <div className="lg:w-1/3 bg-slate-50 rounded-[2rem] p-8 relative border border-slate-100 shadow-inner">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Besoin exprimé :</p>
                  <p className="text-sm text-slate-600 line-clamp-4 italic leading-relaxed font-medium">
                    "{quote.message}"
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col justify-center gap-3">
                  <button 
                    onClick={() => handleStatus(quote.id, "processing")}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-sts-blue hover:border-sts-blue transition-all flex items-center justify-center shadow-sm"
                    title="En cours"
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleStatus(quote.id, "completed")}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-sts-green hover:border-sts-green transition-all flex items-center justify-center shadow-sm"
                    title="Terminé"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={`https://wa.me/${quote.phone}`} 
                    target="_blank"
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-green-600 hover:border-green-600 transition-all flex items-center justify-center shadow-sm"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="text-center py-8">
          <Button 
            onClick={() => fetchQuotes()} 
            disabled={loading}
            className="h-12 px-8 bg-white border border-slate-100 hover:bg-sts-blue hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Charger Plus"}
          </Button>
        </div>
      )}
    </div>
  );
}
