"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MessageSquare, CalendarCheck, FileText, 
  Building2, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Users, Clock
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { db, collection, getDocs, query, where, limit, orderBy, getCountFromServer } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

// Generate mock data based on real trends
const generateActivityData = (stats: any) => [
  { name: "Lun", messages: Math.floor(stats.messages * 0.1) + 2, bookings: 1, quotes: 3 },
  { name: "Mar", messages: Math.floor(stats.messages * 0.2) + 1, bookings: 2, quotes: 1 },
  { name: "Mer", messages: Math.floor(stats.messages * 0.15) + 3, bookings: 0, quotes: 4 },
  { name: "Jeu", messages: Math.floor(stats.messages * 0.25) + 2, bookings: 3, quotes: 2 },
  { name: "Ven", messages: Math.floor(stats.messages * 0.3) + 4, bookings: 1, quotes: 5 },
  { name: "Sam", messages: Math.floor(stats.messages * 0.1) + 1, bookings: 4, quotes: 2 },
  { name: "Dim", messages: Math.floor(stats.messages * 0.05) + 0, bookings: 2, quotes: 1 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    messages: 0,
    bookings: 0,
    quotes: 0,
    properties: 0
  });
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Corrected queries using getCountFromServer for performance
      const [msgCount, bookCount, quoteCount, propCount] = await Promise.all([
        getCountFromServer(query(collection(db, "messages"), where("status", "==", "new"))),
        getCountFromServer(query(collection(db, "bookings"), where("status", "==", "pending"))),
        getCountFromServer(query(collection(db, "quotes"), where("status", "==", "new"))),
        getCountFromServer(collection(db, "properties"))
      ]);

      const currentStats = {
        messages: msgCount.data().count,
        bookings: bookCount.data().count,
        quotes: quoteCount.data().count,
        properties: propCount.data().count
      };
      
      setStats(currentStats);
      setActivityData(generateActivityData(currentStats));

      // Fetch recent messages
      const recentMsgSnap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(5)));
      setRecentItems(recentMsgSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "message" })));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const serviceData = [
    { name: "Immobilier", value: stats.properties > 0 ? 45 : 0, color: "#007AFF" },
    { name: "Transport", value: 30, color: "#1A8C3E" },
    { name: "Formation", value: 15, color: "#000000" },
    { name: "Agrobusiness", value: 10, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-10">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Messages Non Lus", value: stats.messages, icon: <MessageSquare />, color: "bg-sts-blue", trend: "+12%" },
          { label: "Réservations Attente", value: stats.bookings, icon: <CalendarCheck />, color: "bg-sts-green", trend: "+5%" },
          { label: "Nouveaux Devis", value: stats.quotes, icon: <FileText />, color: "bg-sts-black", trend: "+8%" },
          { label: "Biens Publiés", value: stats.properties, icon: <Building2 />, color: "bg-amber-500", trend: "+3%" },
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50 relative overflow-hidden group"
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-full transition-transform group-hover:scale-110", card.color)} />
            
            <div className="flex justify-between items-start mb-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", card.color)}>
                {card.icon}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-sts-green bg-green-50 px-2.5 py-1 rounded-full">
                {card.trend} <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{card.label}</p>
            <p className="text-4xl font-black font-playfair text-sts-black">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black font-playfair">Activité Récente</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Interactions des 7 derniers jours</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sts-blue" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Messages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sts-green" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Réservations</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
                  itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="messages" stroke="#007AFF" strokeWidth={4} dot={{ r: 4, fill: "#007AFF" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="bookings" stroke="#1A8C3E" strokeWidth={4} dot={{ r: 4, fill: "#1A8C3E" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50">
          <h3 className="text-2xl font-black font-playfair mb-2">Répartition Services</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Volume de demandes par pôle</p>
          
          <div className="h-[250px] w-full mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {serviceData.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full")} style={{ backgroundColor: s.color }} />
                  <span className="text-xs font-bold text-slate-600">{s.name}</span>
                </div>
                <span className="text-xs font-black text-sts-black">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50 overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black font-playfair">Dernières Interactions</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Messages et demandes entrantes</p>
          </div>
          <Link href="/dashboard/messages" className="px-6 py-2 rounded-full bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-sts-blue hover:text-white transition-all">
            Tout Voir
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Contact</th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-10 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-10 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-12 text-center text-slate-400 font-bold">Aucune activité récente.</td>
                </tr>
              ) : (
                recentItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sts-blue/10 flex items-center justify-center text-sts-blue font-bold text-xs uppercase">
                          {item.firstName?.[0] || item.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-sts-black">{item.firstName} {item.lastName || item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-[10px] font-black text-sts-blue bg-sts-blue/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {item.createdAt ? (typeof item.createdAt === 'string' ? new Date(item.createdAt).toLocaleDateString("fr-FR") : item.createdAt.toDate().toLocaleDateString("fr-FR")) : "N/A"}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", (item.read || item.status === "read") ? "bg-slate-300" : "bg-sts-green")} />
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", (item.read || item.status === "read") ? "text-slate-400" : "text-sts-green")}>
                          {(item.read || item.status === "read") ? "Lu" : "Nouveau"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <Link href={`/dashboard/messages?id=${item.id}`} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-sts-blue hover:bg-white transition-all shadow-sm">
                        <TrendingUp className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
