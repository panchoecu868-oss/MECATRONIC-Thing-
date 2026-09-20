"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { AREAS_MECATRONICA } from "@/lib/constants";
import { Proyecto } from "@/lib/types";
import { Pencil, Check, X } from "lucide-react";

export function EditarProyectoMeta({ proyecto }: { proyecto: Proyecto }) {
  const actualizarMetaProyecto = useStore((s) => s.actualizarMetaProyecto);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(proyecto.nombre);
  const [descripcion, setDescripcion] = useState(proyecto.descripcionCorta);
  const [area, setArea] = useState(proyecto.areaMecatronica);

  const abrir = () => {
    setNombre(proyecto.nombre);
    setDescripcion(proyecto.descripcionCorta);
    setArea(proyecto.areaMecatronica);
    setEditando(true);
  };

  const guardar = () => {
    if (!nombre.trim()) return;
    actualizarMetaProyecto(proyecto.id, {
      nombre: nombre.trim(),
      descripcionCorta: descripcion.trim(),
      areaMecatronica: area,
    });
    setEditando(false);
  };

  if (!editando) {
    return (
      <div className="flex items-start gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{proyecto.nombre}</h1>
          <p className="text-sm text-muted">{proyecto.areaMecatronica}</p>
        </div>
        <button
          onClick={abrir}
          className="mt-1 text-muted hover:text-accent transition"
          title="Editar nombre, área o descripción"
        >
          <Pencil size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-panel border border-border rounded-xl p-4 space-y-3 max-w-xl">
      <input
        autoFocus
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del proyecto"
        className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
      >
        {AREAS_MECATRONICA.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción corta"
        rows={2}
        className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-y"
      />
      <div className="flex items-center gap-2">
        <button
          onClick={guardar}
          disabled={!nombre.trim()}
          className="flex items-center gap-1.5 bg-accent text-bg rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:opacity-90"
        >
          <Check size={15} /> Guardar
        </button>
        <button
          onClick={() => setEditando(false)}
          className="flex items-center gap-1.5 text-muted hover:text-text text-sm px-3 py-1.5"
        >
          <X size={15} /> Cancelar
        </button>
      </div>
    </div>
  );
}
