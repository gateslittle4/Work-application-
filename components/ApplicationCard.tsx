"use client";

import type { Application } from "@/lib/types";
import { APPLICATION_STATUSES, STATUS_LABELS } from "@/lib/status";

type Props = {
  application: Application;
  onEdit: (application: Application) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Application["status"]) => void;
};

export default function ApplicationCard({ application, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-slate-900">{application.position}</p>
          <p className="text-sm text-slate-600">{application.company}</p>
        </div>
        <button
          onClick={() => onDelete(application.id)}
          aria-label="Supprimer"
          className="text-slate-400 hover:text-red-600 text-sm leading-none"
        >
          ✕
        </button>
      </div>

      {(application.location || application.sector) && (
        <p className="mt-1 text-xs text-slate-500">
          {[application.location, application.sector].filter(Boolean).join(" · ")}
        </p>
      )}

      {application.salaryRange && (
        <p className="mt-1 text-xs text-slate-500">{application.salaryRange}</p>
      )}

      {application.notes && (
        <p className="mt-2 text-xs text-slate-600 line-clamp-2">{application.notes}</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <select
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as Application["status"])}
          className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-slate-50"
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          {application.url && (
            <a
              href={application.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              Offre
            </a>
          )}
          <button
            onClick={() => onEdit(application)}
            className="text-xs text-slate-600 hover:underline"
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}
