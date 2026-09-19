"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Proyecto } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { Lightbulb, Plus, Trash2, Clock } from "lucide-react";

const today = () => new Date().toISOString().slice(0, 10);

export function StageBitacora({ proyecto }: { proyecto: Proyecto }) {
  const meta = STAGES_META.bitacora;
  const addBitacora = useStore((s) => s.addBitacora);
  const removeBitacora = useStore((s) => s.removeBitacora);
  const [fecha, setFecha] = useState(today());
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [horas, setHoras] = useState("1");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    addBitacora(proyecto.id, {
      fecha,
      titulo: titulo.trim(),
      detalle: detalle.trim(),
      horasInvertidas: parseFloat(horas) || 0,
    });
    setTitulo("");
    setDetalle("");
    setHoras("1");
    setFecha(today());
  };

  const totalHoras = proyecto.bitacora.reduce((a, b) => a + b.horasInvertidas, 0);

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
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            className="sm:col-span-2 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Título de la sesión"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="number"
            step="any"
            placeholder="Horas"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            className="bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <textarea
          placeholder="Qué hiciste, qué decidiste, qué falló"
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          rows={2}
          className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-y"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-accent text-bg rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          <Plus size={16} /> Registrar entrada
        </button>
      </form>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Historial ({proyecto.bitacora.length})</h3>
          <span className="text-sm text-muted flex items-center gap-1">
            <Clock size={14} /> {totalHoras}h invertidas en total
          </span>
        </div>
        <div className="space-y-3">
          {proyecto.bitacora.length === 0 && (
            <p className="text-sm text-muted">Sin entradas todavía.</p>
          )}
          {proyecto.bitacora.map((b) => (
            <div key={b.id} className="bg-panel border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span className="text-xs text-accent2 font-mono">{b.fecha}</span>
                  <h4 className="font-medium">{b.titulo}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{b.horasInvertidas}h</span>
                  <button
                    onClick={() => removeBitacora(proyecto.id, b.id)}
                    className="text-muted hover:text-danger"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {b.detalle && <p className="text-sm text-muted whitespace-pre-wrap">{b.detalle}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
