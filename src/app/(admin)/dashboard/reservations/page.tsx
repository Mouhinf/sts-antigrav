"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, User, Car, Clock, 
  MapPin, CheckCircle2, XCircle, 
  Search, Filter, Eye, MessageSquare,
  Phone, Loader2, ChevronRight, ChevronLeft
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, updateDoc, doc, limit, startAfter } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 10;

export default function AdminReservationsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchBookings(true);
  }, [filter]);

  const fetchBookings = async (isNew = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "bookings"), orderBy("startDate", "desc"), limit(ITEMS_PER_PAGE));
      
      // Note: Filtering in Firebase with different filters usually requires specific indexes.
      // For now we do client-side filtering if filter is not "all", 
      // but in a real production app we'd use multiple queries or composite indexes.
      // Since it's an admin dashboard with relatively low volume, we'll fetch more or handle it simply.

      if (!isNew && lastDoc) {
        q = query(collection(db, "bookings"), orderBy("startDate", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      const newBookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (isNew) {
        setBookings(newBookings);
      } else {
        setBookings(prev => [...prev, ...newBookings]);
      }

      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      toast.error("Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      toast.success(`Réservation ${status} !`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  const filteredBookings = bookings.filter(b => filter === "all" || b.status === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black font-playfair tracking-tight">Réservations Transport</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Gérez les demandes de location de véhicules</p>
      </div>

      {/* TABS / FILTERS */}
      <div className="flex bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/30 border border-slate-50 w-fit">
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
          <button 
            key={f}
            onClick={() => { setFilter(f); setLastDoc(null); }}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              filter === f ? "bg-sts-blue text-white shadow-lg shadow-sts-blue/20" : "text-slate-400 hover:text-sts-black"
            )}
          >
            {f === "all" ? "Toutes" : f === "pending" ? "En attente" : f === "confirmed" ? "Confirmées" : "Annulées"}
          </button>
        ))}
      </div>

      {/* BOOKINGS LIST */}
      <div className="grid grid-cols-1 gap-6">
        {loading && bookings.length === 0 ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white rounded-[2.5rem] animate-pulse shadow-sm" />)
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-50">
            <p className="text-slate-400 font-bold">Aucune réservation trouvée.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <motion.div 
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/30 border border-slate-50 p-8 flex flex-col lg:flex-row justify-between items-center gap-12 group hover:border-sts-blue/20 transition-all"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left flex-1">
                <div className="w-20 h-20 rounded-2xl bg-sts-blue/5 flex items-center justify-center text-sts-blue shrink-0 shadow-inner">
                  <Car className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h3 className="text-xl font-black font-playfair">{booking.vehicleName}</h3>
                    <span className={cn(
                      "text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                      booking.status === "confirmed" ? "bg-sts-green text-white" : 
                      booking.status === "cancelled" ? "bg-red-500 text-white" : "bg-sts-blue text-white"
                    )}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-sts-blue" /> {booking.name}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sts-blue" /> {booking.startDate} → {booking.endDate}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sts-blue" /> {booking.pickup}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total à régler</p>
                  <p className="text-2xl font-black text-sts-black">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(booking.totalPrice)}
                  </p>
                </div>
                <div className="flex gap-3">
                  {booking.status === "pending" && (
                    <>
                      <button 
                        onClick={() => handleStatus(booking.id, "confirmed")}
                        className="w-12 h-12 rounded-2xl bg-green-50 text-sts-green hover:bg-sts-green hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="Confirmer"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </button>
                      <button 
                        onClick={() => handleStatus(booking.id, "cancelled")}
                        className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                        title="Annuler"
                      >
                        <XCircle className="w-6 h-6" />
                      </button>
                    </>
                  )}
                  <a href={`https://wa.me/${booking.phone}`} target="_blank" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center shadow-sm">
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
            onClick={() => fetchBookings()} 
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
