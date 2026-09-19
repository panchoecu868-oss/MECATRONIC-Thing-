"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { progresoTotal } from "@/lib/calc";
import { exportarProyectos, parsearArchivoImportado } from "@/lib/exportImport";
import { ProgressBar } from "@/components/ProgressBar";
import { Cpu, Plus, Wrench, Download, Upload } from "lucide-react";

export default function HomePage() {
  const proyectos = useStore((s) => s.proyectos);
  const eliminarProyecto = useStore((s) => s.eliminarProyecto);
  const importarProyectos = useStore((s) => s.importarProyectos);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const raw = await file.text();
      const importados = parsearArchivoImportado(raw);
      const { agregados, reemplazados } = importarProyectos(importados);
      alert(
        `Importación completa: ${agregados} proyecto(s) nuevo(s), ${reemplazados} actualizado(s).`
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "No se pudo importar el archivo.");
    }
  };

  return (
    <main className="min-h-screen max-w-5xl mx-auto px-6 py-10">
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-panel2 border border-border flex items-center justify-center">
            <Cpu className="text-accent" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">MECATRONIC Thing</h1>
            <p className="text-sm text-muted">Tu guía paso a paso, de la idea al producto final</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mounted && proyectos.length > 0 && (
            <button
              onClick={() => exportarProyectos(proyectos)}
              title="Descargar backup de todos tus proyectos"
              className="flex items-center gap-2 border border-border text-muted hover:text-text hover:border-accent/50 px-3 py-2 rounded-lg transition text-sm"
            >
              <Download size={16} /> Exportar
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Restaurar proyectos desde un archivo de backup"
            className="flex items-center gap-2 border border-border text-muted hover:text-text hover:border-accent/50 px-3 py-2 rounded-lg transition text-sm"
          >
            <Upload size={16} /> Importar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          <Link
            href="/proyecto/nuevo"
            className="flex items-center gap-2 bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            <Plus size={18} /> Nuevo proyecto
          </Link>
        </div>
      </header>

      {!mounted ? null : proyectos.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl p-12 text-center text-muted">
          <Wrench className="mx-auto mb-4 text-muted" size={32} />
          <p className="mb-2">Todavía no tienes proyectos.</p>
          <p className="text-sm">
            Crea el primero y te guío por las 9 etapas: idea, investigación, requisitos,
            diseño, materiales, precio, bitácora, resolución de problemas y producto final.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {proyectos.map((p) => {
            const pct = progresoTotal(p);
            return (
              <Link
                key={p.id}
                href={`/proyecto/${p.id}`}
                className="group border border-border bg-panel rounded-xl p-5 hover:border-accent/60 transition block"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-text group-hover:text-accent transition">
                    {p.nombre}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) {
                        eliminarProyecto(p.id);
                      }
                    }}
                    className="text-xs text-muted hover:text-danger"
                  >
                    Eliminar
                  </button>
                </div>
                <p className="text-sm text-muted mb-1">{p.areaMecatronica}</p>
                <p className="text-sm text-muted line-clamp-2 mb-4">{p.descripcionCorta}</p>
                <div className="flex items-center gap-3">
                  <ProgressBar pct={pct} />
                  <span className="text-xs text-muted w-10 text-right">{pct}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
