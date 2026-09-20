"use client";

import { Proyecto, StageId, STAGE_ORDER } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { stageProgresoById } from "@/lib/calc";

export function StageSidebar({
  proyecto,
  active,
  onSelect,
}: {
  proyecto: Proyecto;
  active: StageId;
  onSelect: (s: StageId) => void;
}) {
  return (
    <nav className="space-y-1">
      {STAGE_ORDER.map((s) => {
        const meta = STAGES_META[s];
        const pct = stageProgresoById(proyecto, s);
        const isActive = s === active;
        return (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition ${
              isActive ? "bg-panel2 border border-accent/40" : "hover:bg-panel2/60 border border-transparent"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                pct === 100
                  ? "bg-accent text-bg"
                  : isActive
                  ? "bg-accent2/20 text-accent2 border border-accent2/50"
                  : "bg-panel2 text-muted border border-border"
              }`}
            >
              {meta.numero}
            </span>
            <span className={`text-sm flex-1 ${isActive ? "text-text" : "text-muted"}`}>
              {meta.titulo}
            </span>
            {pct > 0 && (
              <span className="text-[10px] text-muted">{pct}%</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
