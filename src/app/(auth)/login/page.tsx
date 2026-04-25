"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { loginMetadata } from "@/lib/seo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { signIn, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginInput) => {
    if (attempts >= 5) {
      toast.error("Compte temporairement bloqué. Veuillez patienter 15 minutes.");
      return;
    }

    try {
      await signIn(data.email, data.password);
      // La redirection est gérée par le hook useAuth
    } catch {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 5) {
        toast.error("Trop de tentatives. Veuillez patienter 15 minutes.");
      } else {
        toast.error(`Identifiants incorrects. ${5 - newAttempts} tentatives restantes.`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sts-primary to-sts-primary/80 text-white mb-6 shadow-xl"
            >
              <ShieldCheck className="w-10 h-10" />
            </motion.div>
            <h1 className="text-3xl font-black font-playfair mb-2 tracking-tight">
              Espace Admin
            </h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
              STS SOFITRANS SERVICE
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sts-primary transition-colors" />
                <Input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="admin@sts.sn"
                  disabled={isLoading || attempts >= 5}
                  className={cn(
                    "h-14 pl-12 rounded-xl bg-slate-50 border-2 border-transparent",
                    "focus:border-sts-primary focus:bg-white transition-all",
                    "text-sts-black placeholder:text-slate-400",
                    errors.email && "border-red-500 bg-red-50",
                    (isLoading || attempts >= 5) && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sts-primary transition-colors" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  disabled={isLoading || attempts >= 5}
                  className={cn(
                    "h-14 pl-12 pr-12 rounded-xl bg-slate-50 border-2 border-transparent",
                    "focus:border-sts-primary focus:bg-white transition-all",
                    "text-sts-black placeholder:text-slate-400",
                    errors.password && "border-red-500 bg-red-50",
                    (isLoading || attempts >= 5) && "opacity-60 cursor-not-allowed"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Attempts Warning */}
            {attempts > 0 && attempts < 5 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-3 text-amber-700 bg-amber-50 border border-amber-200 p-4 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Attention : {5 - attempts} tentatives restantes
                </p>
              </motion.div>
            )}

            {/* Blocked Message */}
            {attempts >= 5 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-3 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Compte temporairement bloqué. Réessayez dans 15 minutes.
                </p>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || attempts >= 5}
              className={cn(
                "w-full h-14 bg-sts-black hover:bg-sts-primary text-white font-bold text-base rounded-xl",
                "shadow-lg shadow-sts-primary/20 transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se Connecter
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-medium text-slate-400 uppercase tracking-widest">
              Accès sécurisé · Sénégal
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-slate-500">Système opérationnel</span>
            </div>
          </div>
        </div>

        {/* Back to site link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-sts-primary transition-colors"
          >
            ← Retour au site
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Export metadata
export { loginMetadata as metadata };
