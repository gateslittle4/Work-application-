"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

type Suggestion = {
  id: string;
  source: string;
  sourceUrl: string;
  title: string;
  company: string | null;
  location: string | null;
  matchedKeywords: string | null;
  foundAt: string;
};

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/suggestions")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setSuggestions(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function handleConvert(id: string) {
    setBusyId(id);
    await fetch(`/api/suggestions/${id}/convert`, { method: "POST" });
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setBusyId(null);
  }

  async function handleDismiss(id: string) {
    setBusyId(id);
    await fetch(`/api/suggestions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DISMISSED" }),
    });
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    setBusyId(null);
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Suggestions</h1>
            <p className="text-sm text-slate-500">
              Offres trouvées automatiquement, filtrées selon ton profil.
            </p>
          </div>
          <NavBar />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {loading ? (
          <p className="text-slate-500 text-sm">Chargement...</p>
        ) : suggestions.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Aucune suggestion pour le moment. Le robot cherche automatiquement chaque jour.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{s.title}</p>
                    <p className="text-sm text-slate-600">
                      {[s.company, s.location].filter(Boolean).join(" · ")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Source : {s.source}
                      {s.matchedKeywords ? ` · mots-clés : ${s.matchedKeywords}` : ""}
                    </p>
                  </div>
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                  >
                    Voir l&apos;offre
                  </a>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleConvert(s.id)}
                    disabled={busyId === s.id}
                    className="rounded bg-slate-900 text-white px-3 py-1.5 text-xs hover:bg-slate-800 disabled:opacity-50"
                  >
                    Ajouter à mon suivi
                  </button>
                  <button
                    onClick={() => handleDismiss(s.id)}
                    disabled={busyId === s.id}
                    className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Ignorer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
