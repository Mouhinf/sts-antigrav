"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log l'erreur vers un service de monitoring en production
    if (process.env.NODE_ENV === "production") {
      // Envoyer vers Sentry ou autre service
      console.error("Error caught by boundary:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Une erreur est survenue
        </h2>

        <p className="text-gray-600 mb-6">
          Nous sommes désolés, mais quelque chose s&apos;est mal passé.
          Veuillez réessayer ou contacter le support si le problème persiste.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
            <p className="text-sm font-mono text-red-600">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="primary">
            Réessayer
          </Button>
          <Button
            onClick={() => window.location.href = "/"}
            variant="outline"
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
