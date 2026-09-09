"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { ProjectStatus } from "./project-data";

const statuses: readonly { value: ProjectStatus; label: string }[] = [
  { value: "in-progress", label: "В работе" },
  { value: "completed", label: "Завершён" },
  { value: "deferred", label: "Отложен" },
];

function isProjectStatus(value: string): value is ProjectStatus {
  return statuses.some((status) => status.value === value);
}

export function StatusSelect({ projectId, defaultStatus }: Readonly<{ projectId: string; defaultStatus: ProjectStatus }>) {
  const storageKey = `kupigolos-project-status:${projectId}`;
  const [status, setStatus] = useState<ProjectStatus>(() => {
    try {
      if (typeof window === "undefined") return defaultStatus;
      const savedStatus = localStorage.getItem(storageKey);
      return savedStatus && isProjectStatus(savedStatus) ? savedStatus : defaultStatus;
    } catch {
      return defaultStatus;
    }
  });

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.currentTarget.value;
    if (!isProjectStatus(nextStatus)) return;
    setStatus(nextStatus);
    try {
      localStorage.setItem(storageKey, nextStatus);
    } catch {
      // The selected value still works for the current session.
    }
  }

  return (
    <label className="status-control" data-state={status}>
      <span>Статус</span>
      <select value={status} onChange={handleChange}>
        {statuses.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
    </label>
  );
}
