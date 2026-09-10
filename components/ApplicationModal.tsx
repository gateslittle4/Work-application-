"use client";

import { useState } from "react";
import type { Application, ApplicationInput } from "@/lib/types";
import { APPLICATION_STATUSES, STATUS_LABELS } from "@/lib/status";

type Props = {
  initial: Application | null;
  onClose: () => void;
  onSubmit: (data: ApplicationInput) => Promise<void>;
};

const EMPTY: ApplicationInput = {
  company: "",
  position: "",
  url: "",
  location: "",
  sector: "",
  salaryRange: "",
  status: "WISHLIST",
  appliedDate: "",
  notes: "",
};

function toFormState(initial: Application | null): ApplicationInput {
  if (!initial) return EMPTY;
  return {
    company: initial.company,
    position: initial.position,
    url: initial.url ?? "",
    location: initial.location ?? "",
    sector: initial.sector ?? "",
    salaryRange: initial.salaryRange ?? "",
    status: initial.status,
    appliedDate: initial.appliedDate ? initial.appliedDate.slice(0, 10) : "",
    notes: initial.notes ?? "",
  };
}

export default function ApplicationModal({ initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<ApplicationInput>(() => toFormState(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = (key: keyof ApplicationInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) {
      setError("Entreprise et poste sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      setError("Une erreur est survenue, réessaie.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {initial ? "Modifier la candidature" : "Nouvelle candidature"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Entreprise *</label>
              <input
                value={form.company}
                onChange={field("company")}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Poste *</label>
              <input
                value={form.position}
                onChange={field("position")}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Lien de l&apos;offre</label>
            <input
              value={form.url}
              onChange={field("url")}
              placeholder="https://..."
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Lieu</label>
              <input
                value={form.location}
                onChange={field("location")}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Secteur</label>
              <input
                value={form.sector}
                onChange={field("sector")}
                placeholder="ex: Santé, Tech, Design..."
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Salaire visé</label>
              <input
                value={form.salaryRange}
                onChange={field("salaryRange")}
                placeholder="ex: 35-40k€"
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date de candidature</label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={field("appliedDate")}
                className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Statut</label>
            <select
              value={form.status}
              onChange={field("status")}
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={field("notes")}
              rows={3}
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 text-sm rounded bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
