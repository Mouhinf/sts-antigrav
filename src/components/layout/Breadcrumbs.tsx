"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const paths = pathname.split("/").filter((path) => path !== "");

  // Map paths to readable names
  const routeMap: Record<string, string> = {
    services: "Services",
    immobilier: "Immobilier",
    transport: "Transport",
    agrobusiness: "Agrobusiness",
    formation: "Formation",
    blog: "Blog",
    contact: "Contact",
    "a-propos": "À Propos",
  };

  return (
    <nav className="flex py-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-sts-green transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Link>
        </li>
        {paths.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const label = routeMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

          return (
            <li key={path}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-slate-400 mx-1" />
                <Link
                  href={href}
                  className={cn(
                    "ml-1 text-sm font-medium md:ml-2 transition-colors",
                    isLast
                      ? "text-sts-green cursor-default pointer-events-none"
                      : "text-slate-500 hover:text-sts-green"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {label}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
