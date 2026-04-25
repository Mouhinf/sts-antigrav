"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export const CTASection = ({
  title = "Prêt à lancer votre projet ?",
  description = "Nos experts sont à votre disposition pour vous accompagner dans vos investissements immobiliers, solutions de transport et formations professionnelles.",
  buttonText = "Demander un devis gratuit",
  href = "/contact",
}: CTASectionProps) => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-sts-black to-[#0F3D1F] p-12 md:p-24 text-center shadow-2xl"
        >
          {/* Background patterns */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-sts-green/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-sts-blue/20 blur-[100px] rounded-full" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black font-playfair text-white leading-tight">
              {title}
            </h2>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link href={href}>
                <Button variant="primary" size="lg" className="h-16 px-12 text-lg shadow-2xl shadow-sts-green/30 group">
                  {buttonText} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="https://wa.me/221338601234">
                <Button variant="outline" size="lg" className="h-16 px-12 text-lg border-white/20 text-white hover:bg-white/10 backdrop-blur-md">
                  Nous appeler directement
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
