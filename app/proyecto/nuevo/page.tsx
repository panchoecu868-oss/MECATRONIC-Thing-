"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

const AREAS = [
  "Robótica / Manipuladores",
  "Automatización industrial",
  "Instrumentación y sensores",
  "Vehículos autónomos / móviles",
  "Domótica / IoT",
  "Bioingeniería / prótesis",
  "Energía / control de potencia",
  "Otro",
];

export default function NuevoProyectoPage() {
  const router = useRouter();
  const crearProyecto = useStore((s) => s.crearProyecto);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [area, setArea] = useState(AREAS[0]);

  const puedeCrear = nombre.trim().length > 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeCrear) return;
    const id = crearProyecto(nombre.trim(), descripcion.trim(), area);
    router.push(`/proyecto/${id}`);
  };

  return (
    <main className="min-h-screen max-w-2xl mx-auto px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-text text-sm mb-8">
        <ArrowLeft size={16} /> Volver
      </Link>

      <h1 className="text-xl font-semibold mb-1">Nuevo proyecto</h1>
      <p className="text-sm text-muted mb-8">
        Con el nombre y área definimos el punto de partida; el resto lo vamos completando en cada etapa.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nombre del proyecto</label>
          <input
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Clasificador automático de PET por color"
            className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Área mecatrónica dominante</label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Descripción corta (opcional)</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Una o dos líneas de contexto"
            rows={3}
            className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!puedeCrear}
          className="w-full bg-accent text-bg font-medium py-2.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
        >
          Crear y empezar por la Idea
        </button>
      </form>
    </main>
  );
}
