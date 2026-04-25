"use client";

import React, { useState, useEffect } from "react";
import { 
  MessageSquare, User, Mail, 
  Phone, Clock, CheckCircle, 
  Trash2, Eye, Reply, ExternalLink,
  Search, Filter, Loader2, X
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, updateDoc, doc, deleteDoc, limit, startAfter } from "@/lib/firebase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 15;

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages(true);
  }, []);

  const fetchMessages = async (isNew = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));
      
      if (!isNew && lastDoc) {
        q = query(collection(db, "messages"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      const newMessages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isNew) {
        setMessages(newMessages);
      } else {
        setMessages(prev => [...prev, ...newMessages]);
      }

      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      toast.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "messages", id), { 
        status: "read",
        read: true // For backward compatibility
      });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "read", read: true } : m));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce message ?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        toast.success("Message supprimé.");
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMsg?.id === id) setSelectedMsg(null);
      } catch (error) {
        toast.error("Erreur.");
      }
    }
  };

  const filteredMessages = messages.filter(m => 
    m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black font-playfair tracking-tight">Messagerie</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Gérez les demandes de contact de vos clients</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-280px)] min-h-[600px]">
        {/* LIST */}
        <div className="lg:w-1/3 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 relative">
            <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un message..." 
              className="w-full h-14 pl-12 pr-6 rounded-2xl bg-slate-50 border-none text-[13px] font-bold text-sts-black placeholder:text-slate-300 outline-none focus:ring-2 ring-sts-blue/10 transition-all" 
            />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading && messages.length === 0 ? (
              [...Array(5)].map((_, i) => <div key={i} className="h-24 bg-slate-50/50 animate-pulse border-b border-white" />)
            ) : filteredMessages.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Aucun message</p>
              </div>
            ) : (
              <>
                {filteredMessages.map((msg) => (
                  <button 
                    key={msg.id}
                    onClick={() => { setSelectedMsg(msg); markAsRead(msg.id); }}
                    className={cn(
                      "w-full p-8 text-left border-b border-slate-50 transition-all group relative",
                      selectedMsg?.id === msg.id ? "bg-sts-blue/5" : "hover:bg-slate-50/50"
                    )}
                  >
                    {msg.status !== "read" && (
                      <div className="absolute top-8 right-8 w-2.5 h-2.5 rounded-full bg-sts-blue shadow-lg shadow-sts-blue/40 animate-pulse" />
                    )}
                    <p className={cn("text-sm mb-1 uppercase tracking-tight", msg.status !== "read" ? "font-black text-sts-black" : "font-bold text-slate-500")}>
                      {msg.firstName} {msg.lastName}
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 line-clamp-1 mb-3">{msg.subject}</p>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {msg.createdAt ? (typeof msg.createdAt === 'string' ? new Date(msg.createdAt).toLocaleDateString() : msg.createdAt.toDate().toLocaleDateString()) : "N/A"}
                    </span>
                  </button>
                ))}
                {hasMore && (
                  <button 
                    onClick={() => fetchMessages()}
                    disabled={loading}
                    className="w-full py-6 text-[10px] font-black text-sts-blue uppercase tracking-widest hover:bg-slate-50 transition-colors"
                  >
                    {loading ? "Chargement..." : "Charger plus de messages"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* DETAIL */}
        <div className="lg:w-2/3 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div 
                key={selectedMsg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col p-12 overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-sts-blue text-white flex items-center justify-center font-black text-3xl shadow-xl shadow-sts-blue/20">
                      {selectedMsg.firstName[0]}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black font-playfair">{selectedMsg.firstName} {selectedMsg.lastName}</h2>
                      <div className="flex flex-wrap gap-6 mt-3">
                        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><Mail className="w-4 h-4 text-sts-blue" /> {selectedMsg.email}</span>
                        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest"><Phone className="w-4 h-4 text-sts-blue" /> {selectedMsg.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleDelete(selectedMsg.id)} className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[3rem] p-12 flex-1 mb-10 border border-slate-100 shadow-inner">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-px flex-1 bg-slate-200" />
                    <p className="text-[10px] font-black text-sts-blue uppercase tracking-widest whitespace-nowrap">Sujet : {selectedMsg.subject}</p>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                    {selectedMsg.message}
                  </div>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={`mailto:${selectedMsg.email}`}
                    className="h-16 px-10 bg-sts-black text-white rounded-2xl shadow-2xl flex items-center gap-4 text-sm font-black uppercase tracking-widest hover:bg-sts-blue hover:-translate-y-1 transition-all"
                  >
                    <Reply className="w-5 h-5" /> Répondre par Email
                  </a>
                  <a 
                    href={`https://wa.me/${selectedMsg.phone}`}
                    target="_blank"
                    className="h-16 px-10 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex items-center gap-4 text-sm font-black uppercase tracking-widest hover:bg-green-600 hover:text-white hover:-translate-y-1 transition-all shadow-xl shadow-green-100"
                  >
                    <MessageSquare className="w-5 h-5" /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-32 h-32 rounded-[3rem] bg-slate-50 flex items-center justify-center text-slate-200 mb-8 border border-slate-50 shadow-inner">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black font-playfair text-slate-400">Sélectionnez un message</h3>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-3">Cliquez sur un message dans la liste pour afficher le contenu</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
