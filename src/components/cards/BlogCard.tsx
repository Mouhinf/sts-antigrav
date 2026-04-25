"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: any;
  priority?: boolean;
}

export const BlogCard = ({ post, priority = false }: BlogCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full group"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={post.image || "/placeholder-blog.jpg"}
          alt={post.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-sts-green text-[10px] font-bold rounded-full uppercase tracking-widest">
            {post.category || "Actualités"}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {new Date(post.createdAt?.seconds * 1000).toLocaleDateString('fr-FR')}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" /> Par STS
          </div>
        </div>
        
        <h3 className="text-xl font-bold font-playfair mb-4 line-clamp-2 group-hover:text-sts-green transition-colors">
          {post.title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        <Link 
          href={`/blog/${post.slug || post.id}`}
          className="flex items-center text-sts-blue font-bold text-sm hover:gap-3 transition-all group/link"
        >
          Lire la suite <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};
