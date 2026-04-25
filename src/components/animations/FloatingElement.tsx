"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  amplitude?: number;
  className?: string;
}

export const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 4, 
  amplitude = 20,
  className = ""
}: FloatingElementProps) => {
  return (
    <motion.div
      className={cn("", className)}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    >
      {children}
    </motion.div>
  );
};
