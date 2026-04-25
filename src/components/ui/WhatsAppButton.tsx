"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "221XXXXXXXXX";

  return (
    <motion.a
      href={`https://wa.me/${phoneNumber.replace(/\+/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#1A8C3E] text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer group"
    >
      {/* Pulse Effect */}
      <div className="absolute inset-0 rounded-full bg-[#1A8C3E] animate-ping opacity-20 group-hover:opacity-40 transition-opacity"></div>
      
      <MessageCircle className="w-8 h-8 relative z-10" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-white text-sts-black px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap border border-slate-100">
        Contactez-nous sur WhatsApp
      </div>
    </motion.a>
  );
};
