"use client";

import { useStore } from "@/lib/store";
import { Proyecto, StageId } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { Lightbulb, Check } from "lucide-react";

export function StageGeneric({ proyecto, stage }: { proyecto: Proyecto; stage: StageId }) {
  const meta = STAGES_META[stage];
  const data = proyecto.stages[stage];
  const actualizarStageField = useStore((s) => s.actualizarStageField);
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem);

  return (
    <div className="space-y-8">
      <section className="bg-panel2/50 border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-accent">
          <Lightbulb size={18} />
          <h3 className="font-medium">Guía técnica</h3>
        </div>
        <ul className="space-y-2.5">
          {meta.guia.map((g, i) => (
            <li key={i} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-accent2 shrink-0">›</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </section>

      {meta.checklistDefault.length > 0 && (
        <section>
          <h3 className="font-medium mb-3">Checklist de la etapa</h3>
          <div className="space-y-2">
            {data.checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 bg-panel border border-border rounded-lg px-3 py-2.5 cursor-pointer hover:border-accent/40 transition"
              >
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    toggleChecklistItem(proyecto.id, stage, item.id);
                  }}
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                    item.done ? "bg-accent border-accent text-bg" : "border-border"
                  }`}
                >
                  {item.done && <Check size={14} />}
                </span>
                <span className={`text-sm ${item.done ? "text-muted line-through" : ""}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </section>
      )}

      {meta.fields.length > 0 && (
        <section className="space-y-5">
          <h3 className="font-medium">Documentación de la etapa</h3>
          {meta.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1.5">{f.label}</label>
              <textarea
                value={data.fields[f.key] || ""}
                onChange={(e) => actualizarStageField(proyecto.id, stage, f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
                className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent resize-y text-sm"
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
