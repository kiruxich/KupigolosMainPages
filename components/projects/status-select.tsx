"use client";

import { useEffect, useState } from "react";
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
  const [status, setStatus] = useState<ProjectStatus>(defaultStatus);
  const storageKey = `kupigolos-project-status:${projectId}`;

  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem(storageKey);
      if (savedStatus && isProjectStatus(savedStatus)) setStatus(savedStatus);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }, [storageKey]);

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
