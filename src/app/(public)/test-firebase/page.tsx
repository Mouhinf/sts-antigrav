"use client";

import { useEffect, useState } from "react";
import { db, collection, addDoc, getDocs, limit, query } from "@/lib/firebase/client";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error" | "warning";
  message: string;
}

export default function TestFirebasePage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      const newResults: TestResult[] = [];

      // --- TEST 1: LECTURE PUBLIQUE ---
      try {
        const propSnap = await getDocs(query(collection(db, "properties"), limit(1)));
        const vehicSnap = await getDocs(query(collection(db, "vehicles"), limit(1)));
        newResults.push({
          name: "TEST 1 — LECTURE PUBLIQUE",
          status: "success",
          message: `✅ Lecture OK (${propSnap.size} prop, ${vehicSnap.size} vehic)`,
        });
      } catch (error: any) {
        newResults.push({
          name: "TEST 1 — LECTURE PUBLIQUE",
          status: "error",
          message: `❌ Erreur: ${error.message}`,
        });
      }

      // --- TEST 2: ÉCRITURE PUBLIQUE ---
      try {
        await addDoc(collection(db, "messages"), {
          name: "Test",
          email: "test@test.com",
          subject: "Test",
          message: "Test Firebase",
          createdAt: new Date(),
        });
        newResults.push({
          name: "TEST 2 — ÉCRITURE PUBLIQUE",
          status: "success",
          message: "✅ Écritures messages OK",
        });
      } catch (error: any) {
        newResults.push({
          name: "TEST 2 — ÉCRITURE PUBLIQUE",
          status: "error",
          message: `❌ Erreur: ${error.message}`,
        });
      }

      // --- TEST 3: BLOCAGE ÉCRITURE ADMIN (PROPERTIES) ---
      try {
        await addDoc(collection(db, "properties"), {
          title: "Test Frauduleux",
          price: 0,
        });
        newResults.push({
          name: "TEST 3 — BLOCAGE ÉCRITURE ADMIN",
          status: "error",
          message: "❌ PROBLÈME : écriture autorisée dans 'properties' sans auth !",
        });
      } catch (error: any) {
        newResults.push({
          name: "TEST 3 — BLOCAGE ÉCRITURE ADMIN",
          status: "success",
          message: "✅ Écritures properties bloquée (normal - permission denied)",
        });
      }

      setResults(newResults);
      setLoading(false);
    }

    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          🔥 Audit de Sécurité Firebase
        </h1>

        {loading ? (
          <div className="flex items-center gap-3 text-slate-400">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500"></div>
            Tests en cours...
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((res, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border ${
                  res.status === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  {res.name}
                </h2>
                <p className={`text-lg ${res.status === "success" ? "text-emerald-400" : "text-red-400"}`}>
                  {res.message}
                </p>
              </div>
            ))}

            <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h3 className="text-blue-400 font-bold mb-2">💡 Note de nettoyage</h3>
              <ul className="text-sm text-slate-400 list-disc ml-5 space-y-1">
                <li>Supprimer le document test dans la collection <strong>"messages"</strong>.</li>
                <li>Supprimer ce fichier <code>src/app/(public)/test-firebase/page.tsx</code>.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
