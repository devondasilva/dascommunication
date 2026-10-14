import type { ReactNode } from "react";

export function EntetePage({ titre, description, actions }: { titre: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-encre">{titre}</h1>
        {description && <p className="mt-1 text-sm text-encre-muette">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
