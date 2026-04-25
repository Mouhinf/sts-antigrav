"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ApiResponse } from "@/types";

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Vérifier la session au chargement
  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data: ApiResponse<{ user: User }> = await response.json();
        if (data.success && data.data?.user) {
          setState({
            user: data.data.user,
            isLoading: false,
            isAuthenticated: true,
          });
          return;
        }
      }

      // Session invalide
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Connexion via API (cookies httpOnly)
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data: ApiResponse<{ user: User }> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur de connexion");
      }

      setState({
        user: data.data?.user || null,
        isLoading: false,
        isAuthenticated: true,
      });

      toast.success("Connexion réussie");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      const message = error instanceof Error ? error.message : "Erreur de connexion";
      toast.error(message);
      throw error;
    }
  };

  // Déconnexion via API
  const signOut = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch("/api/auth/login", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur de déconnexion");
      }

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });

      toast.success("Déconnexion réussie");
      router.push("/login");
      router.refresh();
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error("Erreur lors de la déconnexion");
      throw error;
    }
  };

  // Rafraîchir la session
  const refreshSession = async (): Promise<void> => {
    await checkSession();
  };

  return {
    ...state,
    signIn,
    signOut,
    refreshSession,
  };
}

// Hook pour vérifier les permissions admin
export function useAdmin() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return {
    isAdmin: isAuthenticated && !!user,
    isLoading,
    user,
  };
}

// Hook pour protéger une route côté client
export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isLoading, isAuthenticated };
}
