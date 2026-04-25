import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Calendar, User, Tag, Share2,
  ArrowLeft, MessageSquare, Eye, Send
} from "lucide-react";

const FacebookIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);

const LinkedinIcon = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);
import { getAdminDb } from "@/lib/firebase/admin";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { BlogViewCounter } from "./BlogViewCounter";

interface Props {
  params: { slug: string };
}

// SSG Params
export async function generateStaticParams() {
  const db = await getAdminDb();
  if (!db) return [];
  const snapshot = await db.collection("blog_posts").where("published", "==", true).get();
  return snapshot.docs.map((doc: any) => ({
    slug: doc.data().slug || doc.id,
  }));
}

// SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Article non trouvé" };

  return {
    title: `${post.title} | Blog STS SOFITRANS SERVICE`,
    description: post.excerpt || post.content?.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage || "/og-image.jpg" }],
      type: "article",
    },
  };
}

async function getPost(slug: string) {
  const db = await getAdminDb();
  if (!db) return null;
  
  // Query by slug or by ID
  let snapshot = await db.collection("blog_posts").where("slug", "==", slug).get();

  if (snapshot.empty) {
    // Try by ID if slug fails
    const doc = await db.collection("blog_posts").doc(slug).get();
    if (doc.exists) return { id: doc.id, ...doc.data() } as any;
    return null;
  }

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

import ReactMarkdown from "react-markdown";

export default async function BlogDetailPage({ params }: Props) {
  const post = await getPost(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sts-sofitrans.vercel.app";
  const postUrl = `${baseUrl}/blog/${params.slug}`;
  const shareTitle = encodeURIComponent(post?.title || "");
  const shareUrl = encodeURIComponent(postUrl);

  if (!post) {
    notFound();
  }

  const db = await getAdminDb();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const recentPostsSnapshot = await db!
    .collection("blog_posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(3)
    .get();

  const recentPosts = recentPostsSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as any));

  return (
    <div className="bg-white min-h-screen">
      {/* Client component for views increment */}
      <BlogViewCounter postId={post.id} />

      {/* HERO / HEADER ARTICLE */}
      <section className="relative h-[70vh] flex items-end pb-20 overflow-hidden bg-sts-black">
        <Image
          src={post.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000"}
          alt={post.title}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sts-black via-sts-black/20 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumbs />
          <div className="max-w-4xl mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Retour au blog
            </Link>

            <span className="block text-sts-green font-bold text-xs uppercase tracking-[0.3em] mb-4">
              {post.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black font-playfair text-white mb-8 leading-tight tracking-tighter">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold text-white/60 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-sts-green" /> {new Date(post.createdAt).toLocaleDateString("fr-FR")}</span>
              <span className="flex items-center gap-2"><User className="w-4 h-4 text-sts-green" /> Par STS Team</span>
              <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-sts-green" /> {post.views || 0} vues</span>
              <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-sts-green" /> 0 commentaires</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT & SIDEBAR */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Article Content */}
            <article className="lg:w-2/3">
              <div className="prose prose-xl prose-slate max-w-none prose-headings:font-playfair prose-headings:font-black prose-a:text-sts-blue prose-img:rounded-[2.5rem] prose-img:shadow-2xl leading-relaxed text-slate-600">
                <ReactMarkdown>
                  {post.content || "Aucun contenu disponible."}
                </ReactMarkdown>
              </div>

              {/* Tags & Partage */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-wrap gap-2">
                  {(post.tags || ["Business", "Sénégal", "Innovation"]).map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                      # {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partager :</span>
                  <div className="flex gap-2">
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-600 transition-transform hover:scale-110"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                      target="_blank"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-700 transition-transform hover:scale-110"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
                      target="_blank"
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-green-600 transition-transform hover:scale-110"
                    >
                      <Send className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-1/3 space-y-16">
              {/* Articles Récents */}
              <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                <h4 className="text-xl font-black font-playfair mb-8 border-l-4 border-sts-blue pl-4">Articles Récents</h4>
                <div className="space-y-8">
                  {recentPosts.map((rp: any) => (
                    <Link key={rp.id} href={`/blog/${rp.slug || rp.id}`} className="group flex gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                        <Image src={rp.coverImage || "/placeholder-blog.jpg"} alt={rp.title} fill className="object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm leading-snug group-hover:text-sts-blue transition-colors line-clamp-2">{rp.title}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{new Date(rp.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Sidebar */}
              <div className="bg-sts-blue rounded-[2.5rem] p-10 text-white shadow-2xl shadow-sts-blue/20">
                <h4 className="text-2xl font-black font-playfair mb-4">Restez Informé</h4>
                <p className="text-white/60 text-sm mb-8">Abonnez-vous pour recevoir nos derniers articles et actualités par email.</p>
                <div className="space-y-4">
                  <input placeholder="Votre email" className="w-full h-12 rounded-xl bg-white/10 border border-white/20 px-4 outline-none placeholder:text-white/30 text-sm" />
                  <Button className="w-full h-12 bg-white text-sts-blue font-bold hover:bg-sts-black hover:text-white transition-all">S'abonner</Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
