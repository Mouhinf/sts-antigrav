"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { db, collection, getDocs, query, where, orderBy, limit } from "@/lib/firebase/client";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const categories = ["Tout", "Immobilier", "Transport", "Agrobusiness", "Formation", "Actualités"];

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, "blog_posts"),
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(20) // For simplicity, we fetch a batch and filter locally if needed
      );

      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      if (selectedCategory !== "Tout") {
        results = results.filter(p => p.category === selectedCategory);
      }

      setPosts(results);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 bg-sts-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000"
            alt="Blog Hero"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sts-black via-sts-black/60 to-white" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mt-12"
          >
            <h1 className="text-6xl md:text-8xl font-black font-playfair mb-8 tracking-tighter">
              Notre <span className="text-sts-blue">Blog</span> & <br />
              Actualités
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Décryptages, conseils d'experts et actualités du secteur multisectoriel au Sénégal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTERS & SEARCH */}
      <section className="relative z-20 -mt-10 px-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setPage(1); }}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all",
                      selectedCategory === cat 
                        ? "bg-sts-blue text-white shadow-lg shadow-sts-blue/20" 
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Rechercher un article..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 rounded-full border-slate-100 bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POSTS GRID */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-6">
                  <div className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
                  <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
                  <div className="h-8 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl font-bold font-playfair text-slate-400">Aucun article trouvé.</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-sts-blue font-bold"
                onClick={() => { setSearchTerm(""); setSelectedCategory("Tout"); }}
              >
                Voir tous les articles
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredPosts.map((post, idx) => (
                  <motion.article 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug || post.id}`}>
                      <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-6 shadow-xl">
                        <Image 
                          src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"} 
                          alt={post.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-6 left-6">
                          <span className="bg-white/90 backdrop-blur-md text-sts-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="space-y-4 px-2">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
                        <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Par STS Team</span>
                      </div>
                      
                      <Link href={`/blog/${post.slug || post.id}`}>
                        <h3 className="text-2xl font-bold font-playfair group-hover:text-sts-blue transition-colors leading-snug">
                          {post.title}
                        </h3>
                      </Link>
                      
                      <p className="text-slate-500 line-clamp-2 italic">
                        {post.excerpt || "Découvrez notre analyse détaillée sur ce sujet clé pour votre développement."}
                      </p>

                      <Link 
                        href={`/blog/${post.slug || post.id}`}
                        className="inline-flex items-center gap-2 text-sts-blue font-bold text-sm group/btn"
                      >
                        Lire la suite <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="mt-20 flex justify-center items-center gap-4">
                <Button variant="outline" className="rounded-full w-12 h-12 p-0" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="font-bold text-slate-400">Page {page}</span>
                <Button variant="outline" className="rounded-full w-12 h-12 p-0" disabled={filteredPosts.length < 8} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
