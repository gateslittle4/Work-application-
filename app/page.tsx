"use client";

import { useEffect, useMemo, useState } from "react";
import ApplicationCard from "@/components/ApplicationCard";
import ApplicationModal from "@/components/ApplicationModal";
import { APPLICATION_STATUSES, STATUS_LABELS, type ApplicationStatus } from "@/lib/status";
import type { Application, ApplicationInput } from "@/lib/types";

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Application | null>(null);
  const [search, setSearch] = useState("");

  async function loadApplications() {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  }

  useEffect(() => {
    let ignore = false;
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setApplications(data);
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((a) =>
      [a.company, a.position, a.sector, a.location]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [applications, search]);

  const columns = useMemo(() => {
    const byStatus: Record<ApplicationStatus, Application[]> = {
      WISHLIST: [],
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      REJECTED: [],
    };
    for (const app of filtered) {
      byStatus[app.status]?.push(app);
    }
    return byStatus;
  }, [filtered]);

  async function handleCreate(data: ApplicationInput) {
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("failed");
    await loadApplications();
  }

  async function handleUpdate(id: string, data: ApplicationInput) {
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("failed");
    await loadApplications();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette candidature ?")) return;
    setApplications((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
  }

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Mon suivi de candidatures</h1>
            <p className="text-sm text-slate-500">
              Trouve ton prochain poste, ailleurs que là où tu es aujourd&apos;hui.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (entreprise, poste, secteur...)"
              className="rounded border border-slate-300 px-3 py-1.5 text-sm w-64 max-w-full"
            />
            <button
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
              className="rounded bg-slate-900 text-white px-3 py-1.5 text-sm hover:bg-slate-800"
            >
              + Ajouter
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-3 text-xs text-slate-600">
          {APPLICATION_STATUSES.map((status) => (
            <span key={status} className="rounded-full bg-slate-100 px-2.5 py-1">
              {STATUS_LABELS[status]}: <strong>{columns[status].length}</strong>
            </span>
          ))}
          <span className="rounded-full bg-slate-100 px-2.5 py-1">
            Total: <strong>{applications.length}</strong>
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {loading ? (
          <p className="text-slate-500 text-sm">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {APPLICATION_STATUSES.map((status) => (
              <div key={status} className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-slate-700 px-1">
                  {STATUS_LABELS[status]}
                </h2>
                <div className="flex flex-col gap-2 min-h-[80px]">
                  {columns[status].length === 0 && (
                    <p className="text-xs text-slate-400 px-1">Aucune candidature</p>
                  )}
                  {columns[status].map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onEdit={(a) => {
                        setEditing(a);
                        setModalOpen(true);
                      }}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <ApplicationModal
          key={editing?.id ?? "new"}
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={(data) => (editing ? handleUpdate(editing.id, data) : handleCreate(data))}
        />
      )}
    </div>
  );
}
