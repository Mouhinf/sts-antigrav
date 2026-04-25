"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Building2, Car, GraduationCap, 
  CalendarCheck, FileText, MessageSquare, Newspaper, 
  LogOut, Bell, User, Search, Menu, X, ChevronRight, Settings2,
  Sprout, Zap, Briefcase
} from "lucide-react";
import { db, collection, query, where, onSnapshot } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

const menuItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", href: "/dashboard" },
  { icon: <Building2 className="w-5 h-5" />, label: "Immobilier", href: "/dashboard/immobilier" },
  { icon: <Car className="w-5 h-5" />, label: "Transport", href: "/dashboard/vehicules" },
  { icon: <Zap className="w-5 h-5" />, label: "Hygiène", href: "/dashboard/hygiene" },
  { icon: <Sprout className="w-5 h-5" />, label: "Agrobusiness", href: "/dashboard/agrobusiness" },
  { icon: <GraduationCap className="w-5 h-5" />, label: "Formations", href: "/dashboard/formations" },
  { icon: <Briefcase className="w-5 h-5" />, label: "Marketing", href: "/dashboard/marketing" },
  { icon: <CalendarCheck className="w-5 h-5" />, label: "Réservations", href: "/dashboard/reservations" },
  { icon: <FileText className="w-5 h-5" />, label: "Devis", href: "/dashboard/devis" },
  { icon: <MessageSquare className="w-5 h-5" />, label: "Messages", href: "/dashboard/messages", badge: true },
  { icon: <Newspaper className="w-5 h-5" />, label: "Blog", href: "/dashboard/blog" },
  { icon: <Settings2 className="w-5 h-5" />, label: "Paramètres", href: "/dashboard/parametres" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const q = query(collection(db, "messages"), where("status", "==", "new"));
      const unsubscribeMessages = onSnapshot(q, (snap) => setUnreadCount(snap.size), () => {});
      return () => unsubscribeMessages();
    } catch {}
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/login", { method: "DELETE", credentials: "include" });
    } catch {}
    Cookies.remove("sts_session");
    Cookies.remove("sts_auth");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sts-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">Vérification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-[#0A0A0A] text-white transition-all duration-500 ease-in-out",
          sidebarOpen ? "w-[280px]" : "w-20"
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sts-blue to-sts-green flex items-center justify-center shrink-0 shadow-lg">
              <span className="font-black text-xl italic">S</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-black font-playfair text-xl">STS ADMIN</p>
                <span className="text-[8px] font-bold text-sts-green uppercase tracking-[0.2em]">Espace Sécurisé</span>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300",
                  pathname === item.href 
                    ? "bg-sts-blue text-white shadow-lg" 
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="shrink-0">{item.icon}</div>
                {sidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
                {item.badge && unreadCount > 0 && (
                  <span className={cn(
                    "flex items-center justify-center bg-red-500 text-[10px] font-bold text-white rounded-full",
                    sidebarOpen ? "px-2 py-0.5" : "w-5 h-5"
                  )}>
                    {sidebarOpen ? unreadCount : "!"}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all",
                !sidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="font-semibold text-sm">Déconnexion</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className={cn("flex-1 transition-all duration-500", sidebarOpen ? "ml-[280px]" : "ml-20")}>
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-sts-black capitalize">{pathname.split("/").pop()?.replace(/-/g, " ")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input placeholder="Rechercher..." className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-sts-blue/10" />
            </div>
            
            <button className="relative p-2.5 rounded-xl bg-slate-100 text-slate-500">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}
            </button>

            <div className="w-px h-8 bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-sts-black">Administrateur</p>
                <p className="text-[10px] font-bold text-sts-green uppercase">Super Admin</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sts-blue to-sts-green flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}