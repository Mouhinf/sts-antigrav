"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ChevronDown, Globe, ShieldCheck, Truck, 
  Sprout, GraduationCap, Briefcase, Ship, Zap, Users, 
  MapPin, Star, Mail, Send, CheckCircle2
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Firebase
import { db, collection, getDocs, limit, query, where, orderBy, doc, getDoc } from "@/lib/firebase/client";

// UI Components
import { Button } from "@/components/ui/Button";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { CountUp } from "@/components/animations/CountUp";
import { ParticleField } from "@/components/animations/ParticleField";
import { TypewriterEffect } from "@/components/animations/TypewriterEffect";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { cn } from "@/lib/utils";

// Variantes d'animation pour le stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState({
    heroTitle: "STS SOFITRANS",
    heroSubtitle: "Bienvenue dans l'univers de STS SOFITRANS SERVICE, une entreprise sénégalaise innovante dirigée par Badara Niang, jeune entrepreneur engagé pour un Sénégal émergent et autonome.",
    vision: "STS, c’est aussi une vision : servir, former, entreprendre, et bâtir l’avenir de notre pays et du continent"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propQuery = query(collection(db, "properties"), where("featured", "==", true), limit(6));
        const propSnapshot = await getDocs(propQuery);
        setFeaturedProperties(propSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const blogQuery = query(collection(db, "blog_posts"), where("published", "==", true), orderBy("createdAt", "desc"), limit(3));
        const blogSnapshot = await getDocs(blogQuery);
        setLatestPosts(blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch Site Settings if they exist
        const settingsDoc = await getDoc(doc(db, "settings", "general"));
        if (settingsDoc.exists()) {
          setSiteSettings(prev => ({ ...prev, ...settingsDoc.data() }));
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* SECTION 1 — HERO ANTIGRAVITY (100vh) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-[#0F3D1F]">
        <ParticleField />
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingElement delay={0} amplitude={25} className="absolute top-[15%] right-[10%]">
            <div className="w-64 h-64 rounded-full bg-sts-blue/20 blur-[100px]" />
            <Globe className="w-32 h-32 md:w-64 md:h-64 text-sts-blue/30 rotate-12" />
          </FloatingElement>

          <FloatingElement delay={1} amplitude={35} className="absolute bottom-[20%] left-[10%]">
            <div className="w-48 h-48 rounded-full bg-sts-green/20 blur-[80px]" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border border-sts-green/20 rounded-[2rem]" 
            />
          </FloatingElement>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container relative z-10 px-6 text-center"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-6 py-2 mb-8 text-xs font-bold tracking-[0.3em] uppercase rounded-full border border-sts-green/30 bg-sts-green/10 text-sts-green backdrop-blur-md shadow-[0_0_20px_rgba(26,140,62,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sts-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sts-green"></span>
              </span>
              🇸🇳 Entreprise Sénégalaise de Confiance
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-6xl md:text-8xl lg:text-9xl font-playfair font-black tracking-tighter leading-none">
            <span className="bg-gradient-to-r from-sts-green via-white to-sts-blue bg-clip-text text-transparent">
              {siteSettings.heroTitle}
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-8 mb-8 text-lg md:text-xl font-medium text-white/80 max-w-3xl mx-auto leading-relaxed">
            {siteSettings.heroSubtitle}
          </motion.p>


          <motion.div variants={itemVariants}>
            <TypewriterEffect words={[
              "Expert en Immobilier",
              "Solutions Transport",
              "Agrobusiness Durable",
              "Formations d'Élite"
            ]} />
          </motion.div>

          <motion.p variants={itemVariants} className="mt-8 text-lg md:text-xl font-medium text-sts-green tracking-widest uppercase mb-12 italic font-playfair">
            "{siteSettings.vision}"
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/services">
              <Button variant="primary" size="lg" className="w-full sm:w-64 h-[64px] text-lg shadow-2xl shadow-sts-green/30 group">
                Découvrir nos services <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-64 h-[64px] text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                Demander un devis
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
          >
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.5em]">Découvrir</span>
            <ChevronDown className="text-white w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2 — STATISTIQUES (Triggered on Scroll) */}
      <section className="py-24 bg-white relative">
        <div className="container px-6 mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <StatCard target={500} suffix="+" label="Clients satisfaits" icon={<Users />} />
            <StatCard target={150} suffix="+" label="Biens immobiliers" icon={<ShieldCheck />} />
            <StatCard target={50} suffix="+" label="Véhicules" icon={<Truck />} />
            <StatCard target={20} suffix="+" label="Formations" icon={<GraduationCap />} />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — SERVICES (3D Tilt) */}
      <section className="py-32 bg-slate-50">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-xs font-bold tracking-[0.5em] text-sts-green uppercase mb-6"
            >
              Expertise Intégrée
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black font-playfair"
            >
              Nos Domaines d'Expertise
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ServiceCard title="Immobilier" desc="De la conception à la gestion locative, STS bâtit des logements modernes et accessibles." icon={<ShieldCheck />} color="green" href="/services/immobilier" />
            <ServiceCard title="Transport & Logistique" desc="Vente et location de véhicules, transport touristique et collectif sur mesure." icon={<Truck />} color="blue" href="/services/transport" />
            <ServiceCard title="Hygiène & Services" desc="Nettoyage, sécurité, maintenance et assistance pour un cadre sain et professionnel." icon={<Zap />} color="green" href="/services/hygiene-services" />
            <ServiceCard title="Agrobusiness" desc="Élevage, transformation et production locale pour la souveraineté alimentaire." icon={<Sprout />} color="blue" href="/services/agrobusiness" />
            <ServiceCard title="Formation & Compta" desc="Modules pratiques en gestion, fiscalité et logiciels comme Sage Saari." icon={<GraduationCap />} color="green" href="/services/formation-comptabilite" />
            <ServiceCard title="Marketing & Commerce" desc="Stratégie, création de marque, et accompagnement des jeunes entrepreneurs." icon={<Briefcase />} color="blue" href="/services/marketing-commerce" />
          </div>
        </div>
      </section>

      {/* SECTION 4 — PROPERTIES (Firebase + Swiper) */}
      <section className="py-32 bg-white">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-widest text-sts-blue uppercase mb-4">Opportunités</h2>
              <p className="text-4xl md:text-5xl font-black font-playfair">Biens Immobiliers en Vedette</p>
            </div>
            <Link href="/immobilier" className="group flex items-center gap-2 font-bold text-sts-green hover:underline">
              Voir tout le catalogue <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 6000 }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-20 !px-4"
          >
            {featuredProperties.map((prop, idx) => (
              <SwiperSlide key={prop.id}>
                <PropertyCard property={prop} priority={idx === 0} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* SECTION 5 — Pourquoi nous choisir */}
      <section className="py-32 bg-[#F8F8F5]">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] text-sts-blue uppercase mb-6">Nos Engagements</h2>
            <p className="text-4xl md:text-6xl font-black font-playfair">Pourquoi Nous Choisir</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <ShieldCheck />, title: "Expertise Locale", desc: "Une connaissance profonde du marché sénégalais et de ses spécificités." },
              { icon: <Zap />, title: "Services Intégrés", desc: "Toutes vos solutions sous un même toit : immobilier, transport, agrobusiness." },
              { icon: <Users />, title: "Confiance & Transparence", desc: "Des processus clairs et une éthique professionnelle rigoureuse." },
              { icon: <Star />, title: "Support Dédié", desc: "Un accompagnement personnalisé 7j/7 pour tous vos projets." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-8 group-hover:bg-sts-green group-hover:text-white transition-all duration-500">
                  {React.cloneElement(item.icon, { className: "w-10 h-10" })}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-playfair">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — Témoignages clients */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] text-sts-green uppercase mb-6">Avis Clients</h2>
            <p className="text-4xl md:text-6xl font-black font-playfair">Ce Que l'On Dit de Nous</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Amadou Diop", role: "Investisseur", text: "STS a transformé ma vision de l'investissement immobilier au Sénégal. Un service d'une qualité rare.", color: "bg-sts-green" },
              { name: "Fatou Sow", role: "Directrice Logistique", text: "La réactivité et le professionnalisme de l'équipe transport sont exceptionnels. Je recommande vivement.", color: "bg-sts-blue" },
              { name: "Moussa Ndiaye", role: "Entrepreneur", text: "L'accompagnement en agrobusiness nous a permis de structurer notre exploitation avec succès.", color: "bg-sts-black" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg italic text-slate-600 mb-8 leading-relaxed">"{item.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold", item.color)}>
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — NEWSLETTER (API /api/newsletter) */}
      <section className="py-24 container px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-sts-green to-[#0A4D21] p-12 md:p-24 text-center shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-black font-playfair text-white">Rejoignez l'élite STS</h2>
            <p className="text-white/70 text-lg md:text-xl">Recevez en priorité nos nouvelles opportunités immobilières et nos offres exclusives.</p>
            
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                try {
                  const res = await fetch("/api/newsletter", {
                    method: "POST",
                    body: JSON.stringify({ email }),
                  });
                  if (res.ok) alert("Inscription réussie !");
                } catch (err) {
                  alert("Erreur lors de l'inscription.");
                }
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <input 
                name="email"
                type="email" 
                required
                placeholder="Votre adresse email professionnelle"
                className="flex-grow h-16 px-8 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:bg-white/20 transition-all text-lg"
              />
              <Button type="submit" className="h-16 px-12 bg-white text-sts-green font-black hover:bg-sts-green hover:text-white transition-all text-lg">
                S'abonner <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* SECTION 8 — BLOG (Firebase) */}
      <section className="py-32 bg-white">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold tracking-[0.5em] text-sts-green uppercase mb-6">Actualités</h2>
            <p className="text-4xl md:text-6xl font-black font-playfair">Derniers Articles</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} priority={idx === 0} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Sub-components optimisés
const StatCard = ({ target, suffix, label, icon }: any) => (
  <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all group">
    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-sts-green/10 transition-colors">
      {React.cloneElement(icon, { className: "w-8 h-8 text-sts-green" })}
    </div>
    <div className="text-5xl font-bold font-playfair mb-3">
      <CountUp target={target} suffix={suffix} />
    </div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">{label}</div>
  </div>
);

const ServiceCard = ({ title, desc, icon, color, href }: any) => (
  <Link href={href || "/services"}>
    <motion.div
      whileHover={{ 
        rotateX: -5, 
        rotateY: 5, 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "p-12 rounded-[3rem] border h-full flex flex-col group cursor-pointer relative overflow-hidden",
        color === "green" ? "bg-white border-slate-100" : "bg-sts-black border-white/5 text-white"
      )}
    >
      <div className={cn(
        "w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6",
        color === "green" ? "bg-sts-green/10 text-sts-green" : "bg-sts-blue/10 text-sts-blue"
      )}>
        {React.cloneElement(icon, { className: "w-10 h-10" })}
      </div>
      <h3 className="text-3xl font-bold mb-6 font-playfair">{title}</h3>
      <p className={cn(
        "text-lg leading-relaxed mb-10 flex-grow",
        color === "green" ? "text-slate-500" : "text-slate-400"
      )}>
        {desc}
      </p>
      <div className={cn(
        "flex items-center font-bold gap-3",
        color === "green" ? "text-sts-green" : "text-sts-blue"
      )}>
        Explorer le service <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
      </div>
    </motion.div>
  </Link>
);
