"use client";

import { useEffect } from "react";
import { db, doc, updateDoc, increment } from "@/lib/firebase/client";

interface Props {
  postId: string;
}

export function BlogViewCounter({ postId }: Props) {
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const postRef = doc(db, "blog_posts", postId);
        await updateDoc(postRef, {
          views: increment(1)
        });
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };

    incrementViews();
  }, [postId]);

  return null;
}
