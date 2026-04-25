"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Edit, Trash2,
  Eye, Filter, X, ImageIcon,
  Check, FileText, Share2, Calendar, Upload, Loader2
} from "lucide-react";
import { db, collection, getDocs, query, orderBy, limit, addDoc, updateDoc, deleteDoc, doc, startAfter, where } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema } from "@/lib/validations";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 8;

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Actualités",
      author: "Admin STS",
      coverImage: "",
      tags: [] as string[],
      published: false,
      featured: false
    }
  });

  const coverImage = watch("coverImage");
  const title = watch("title");

  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Auto-slug
  useEffect(() => {
    if (!currentPost && title) {
      const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      setValue("slug", slug);
    }
  }, [title, setValue, currentPost]);

  useEffect(() => {
    if (currentPost) {
      reset(currentPost);
    } else {
      reset({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Actualités",
        author: "Admin STS",
        coverImage: "",
        tags: [],
        published: false,
        featured: false
      });
    }
  }, [currentPost, isModalOpen, reset]);

  const fetchPosts = async (isNew = false) => {
    setLoading(true);
    try {
      let q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"), limit(ITEMS_PER_PAGE));

      if (!isNew && lastDoc) {
        q = query(collection(db, "blog_posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(ITEMS_PER_PAGE));
      }

      const snap = await getDocs(q);
      const newPosts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (isNew) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
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
        setValue("coverImage", data.url);
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
      const postData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      if (currentPost) {
        await updateDoc(doc(db, "blog_posts", currentPost.id), postData);
        toast.success("Article mis à jour !");
      } else {
        await addDoc(collection(db, "blog_posts"), {
          ...postData,
          createdAt: new Date().toISOString(),
          views: 0
        });
        toast.success("Article publié !");
      }

      setIsModalOpen(false);
      fetchPosts(true);
    } catch (error: any) {
      toast.error("Erreur de sauvegarde.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cet article ?")) {
      try {
        await deleteDoc(doc(db, "blog_posts", id));
        toast.success("Article supprimé.");
        fetchPosts(true);
      } catch (error) {
        toast.error("Erreur.");
      }
    }
  };

  const handleTogglePublished = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "blog_posts", id), { published: !current });
      toast.success("Statut mis à jour !");
      setPosts(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p));
    } catch (error) {
      toast.error("Erreur.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-playfair tracking-tight">Gestion Blog</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Publiez des actualités et conseils</p>
        </div>
        <Button
          onClick={() => { setCurrentPost(null); setIsModalOpen(true); }}
          className="h-14 px-8 bg-sts-black hover:bg-sts-blue text-white rounded-2xl shadow-xl flex items-center gap-3 font-bold"
        >
          <Plus className="w-5 h-5" /> Nouvel Article
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading && posts.length === 0 ? (
          [...Array(2)].map((_, i) => <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse shadow-sm" />)
        ) : posts.length === 0 ? (
          <div className="lg:col-span-2 bg-white p-20 rounded-[3rem] text-center border border-slate-50">
            <p className="text-slate-400 font-bold">Aucun article.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/30 border border-slate-50 flex flex-col sm:flex-row gap-8 group">
              <div className="relative w-full sm:w-40 h-40 rounded-3xl overflow-hidden shrink-0 shadow-lg">
                <Image src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400"} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-sts-blue bg-sts-blue/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {post.category}
                    </span>
                    <button
                      onClick={() => handleTogglePublished(post.id, post.published)}
                      className={cn(
                        "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest transition-all",
                        post.published ? "bg-sts-green text-white" : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {post.published ? "Publié" : "Brouillon"}
                    </button>
                  </div>
                  <h3 className="text-xl font-black font-playfair line-clamp-2 mb-2">{post.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.views || 0} vues</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 sm:mt-0">
                  <button onClick={() => { setCurrentPost(post); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-sts-blue transition-all shadow-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && (
        <div className="text-center py-8">
          <Button onClick={() => fetchPosts()} disabled={loading} className="h-12 px-8 bg-white hover:bg-sts-black hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Charger Plus"}
          </Button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-sts-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-5xl bg-white rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black font-playfair">{currentPost ? "Modifier l'article" : "Nouvel Article"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-sts-black transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Titre de l'article</label>
                  <Input {...register("title")} placeholder="Titre accrocheur..." className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.title && "ring-2 ring-red-500")} />
                  {errors.title && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.title.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Slug (URL)</label>
                  <Input {...register("slug")} placeholder="mon-article-seo" className={cn("h-16 rounded-2xl bg-slate-50 border-none px-6", errors.slug && "ring-2 ring-red-500")} />
                  {errors.slug && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.slug.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Catégorie</label>
                  <select {...register("category")} className="w-full h-16 rounded-2xl bg-slate-50 border-none px-6 text-sm font-medium outline-none">
                    <option>Immobilier</option>
                    <option>Transport</option>
                    <option>Conseils</option>
                    <option>Actualités</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Auteur</label>
                  <Input {...register("author")} placeholder="Admin STS" className="h-16 rounded-2xl bg-slate-50 border-none px-6" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Résumé (Excerpt)</label>
                <textarea {...register("excerpt")} className={cn("w-full min-h-[80px] rounded-2xl bg-slate-50 border-none p-6 text-sm outline-none", errors.excerpt && "ring-2 ring-red-500")} placeholder="Résumé court pour la liste..." />
                {errors.excerpt && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.excerpt.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Contenu (Markdown)</label>
                <textarea {...register("content")} className={cn("w-full min-h-[400px] rounded-[2rem] bg-slate-50 border-none p-8 text-sm outline-none font-mono", errors.content && "ring-2 ring-red-500")} placeholder="# Votre article ici..." />
                {errors.content && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase">{errors.content.message as string}</p>}
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Image de couverture</label>
                {coverImage ? (
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl group max-w-2xl mx-auto">
                    <Image src={coverImage} alt="Blog" fill className="object-cover" />
                    <button type="button" onClick={() => setValue("coverImage", "")} className="absolute top-6 right-6 p-2.5 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-5 h-5" /></button>
                  </div>
                ) : (
                  <label className="w-full h-64 rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-sts-blue hover:bg-sts-blue/5 transition-all group">
                    {uploading ? <Loader2 className="w-10 h-10 text-sts-blue animate-spin" /> : <><Upload className="w-10 h-10 text-slate-300 group-hover:text-sts-blue transition-colors" /><span className="text-[10px] font-bold text-slate-400 uppercase mt-4">Uploader l'image de couverture</span></>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                  </label>
                )}
                {errors.coverImage && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase text-center">{errors.coverImage.message as string}</p>}
              </div>

              <div className="flex items-center gap-8 px-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn("w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all", watch("published") ? "bg-sts-green border-sts-green" : "border-slate-200 group-hover:border-sts-blue")}>
                    {watch("published") && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <input type="checkbox" {...register("published")} className="hidden" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Publier immédiatement</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={cn("w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all", watch("featured") ? "bg-sts-blue border-sts-blue" : "border-slate-200 group-hover:border-sts-blue")}>
                    {watch("featured") && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <input type="checkbox" {...register("featured")} className="hidden" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Mettre en avant (Featured)</span>
                </label>
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-20 bg-sts-black hover:bg-sts-blue text-white font-black text-xl rounded-2xl shadow-2xl transition-all">
                {submitting ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : currentPost ? "Mettre à jour l'Article" : "Publier l'Article"}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
