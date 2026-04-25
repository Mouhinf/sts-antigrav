"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, onDrag, onDragStart, onDragEnd, ...props }, ref) => {
    const variants = {
      primary: "bg-[#1A8C3E] text-white hover:bg-[#1A8C3E]/90 shadow-lg shadow-sts-green/20",
      secondary: "bg-[#1A5FA8] text-white hover:bg-[#1A5FA8]/90 shadow-lg shadow-sts-blue/20",
      outline: "border-2 border-[#1A8C3E] text-[#1A8C3E] bg-transparent hover:bg-[#1A8C3E]/5",
      ghost: "text-[#1A8C3E] bg-transparent hover:bg-[#1A8C3E]/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    const MotionButton = motion.button as any;

    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sts-green/50 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";
