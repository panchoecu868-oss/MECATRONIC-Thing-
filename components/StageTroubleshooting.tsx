"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Proyecto } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { Lightbulb, Plus, Trash2, Check, AlertTriangle } from "lucide-react";

const today = () => new Date().toISOString().slice(0, 10);

export function StageTroubleshooting({ proyecto }: { proyecto: Proyecto }) {
  const meta = STAGES_META.troubleshooting;
  const addTroubleshooting = useStore((s) => s.addTroubleshooting);
  const updateTroubleshooting = useStore((s) => s.updateTroubleshooting);
  const removeTroubleshooting = useStore((s) => s.removeTroubleshooting);

  const [problema, setProblema] = useState("");
  const [hipotesis, setHipotesis] = useState("");
  const [solucion, setSolucion] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problema.trim()) return;
    addTroubleshooting(proyecto.id, {
      fecha: today(),
      problema: problema.trim(),
      hipotesis: hipotesis.trim(),
      solucion: solucion.trim(),
      resuelto: false,
    });
    setProblema("");
    setHipotesis("");
    setSolucion("");
  };

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

      <form onSubmit={handleAdd} className="bg-panel border border-border rounded-xl p-4 space-y-3">
        <textarea
          placeholder="Problema observado (qué falla y en qué condición)"
          value={problema}
          onChange={(e) => setProblema(e.target.value)}
          rows={2}
          className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-y"
        />
        <textarea
          placeholder="Hipótesis (qué crees que lo causa, antes de tocar nada)"
          value={hipotesis}
          onChange={(e) => setHipotesis(e.target.value)}
          rows={2}
          className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-y"
        />
        <textarea
          placeholder="Solución aplicada / causa raíz confirmada"
          value={solucion}
          onChange={(e) => setSolucion(e.target.value)}
          rows={2}
          className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-y"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-accent text-bg rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Registrar caso
        </button>
      </form>

      <section>
        <h3 className="font-medium mb-3">Casos registrados ({proyecto.troubleshooting.length})</h3>
        <div className="space-y-3">
          {proyecto.troubleshooting.length === 0 && (
            <p className="text-sm text-muted">Sin casos registrados todavía.</p>
          )}
          {proyecto.troubleshooting.map((t) => (
            <div key={t.id} className="bg-panel border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    size={15}
                    className={t.resuelto ? "text-accent" : "text-warn"}
                  />
                  <span className="text-xs text-muted font-mono">{t.fecha}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateTroubleshooting(proyecto.id, t.id, { resuelto: !t.resuelto })
                    }
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded border ${
                      t.resuelto
                        ? "border-accent text-accent"
                        : "border-border text-muted"
                    }`}
                  >
                    <Check size={12} /> {t.resuelto ? "Resuelto" : "Marcar resuelto"}
                  </button>
                  <button
                    onClick={() => removeTroubleshooting(proyecto.id, t.id)}
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium mb-1">{t.problema}</p>
              {t.hipotesis && (
                <p className="text-sm text-muted mb-1">
                  <span className="text-accent2">Hipótesis: </span>
                  {t.hipotesis}
                </p>
              )}
              {t.solucion && (
                <p className="text-sm text-muted">
                  <span className="text-accent2">Solución: </span>
                  {t.solucion}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
