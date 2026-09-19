"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Proyecto } from "@/lib/types";
import { construirPromptDiseno } from "@/lib/designPrompt";
import { Box, Download, RotateCw, Sparkles } from "lucide-react";

const Design3DModelViewer = dynamic(() => import("./Design3DModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-muted text-sm">
      Cargando visor...
    </div>
  ),
});

interface TaskState {
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED";
  progress: number;
  glbUrl?: string;
  errorMessage?: string;
}

const POLL_INTERVAL_MS = 4000;
const MAX_POLL_MS = 6 * 60 * 1000;

export function Design3DAIGenerator({ proyecto }: { proyecto: Proyecto }) {
  const [detalles, setDetalles] = useState("");
  const [artStyle, setArtStyle] = useState<"realistic" | "sculpture">("realistic");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<TaskState | null>(null);
  const pollDeadline = useRef<number>(0);

  const poll = async (taskId: string) => {
    if (Date.now() > pollDeadline.current) {
      setError("Se agotó el tiempo de espera (6 min) sin resultado. Probá de nuevo.");
      setTask(null);
      return;
    }
    try {
      const res = await fetch(`/api/generate-design-3d?taskId=${encodeURIComponent(taskId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error consultando la tarea.");

      if (data.status === "SUCCEEDED") {
        setTask({ status: "SUCCEEDED", progress: 100, glbUrl: data.model_urls?.glb });
        return;
      }
      if (data.status === "FAILED" || data.status === "CANCELED") {
        setError(data.task_error?.message || `La tarea terminó en estado ${data.status}.`);
        setTask(null);
        return;
      }
      setTask({ status: data.status, progress: data.progress ?? 0 });
      setTimeout(() => poll(taskId), POLL_INTERVAL_MS);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo consultar el estado de la tarea.");
      setTask(null);
    }
  };

  const generar = async () => {
    setCreando(true);
    setError(null);
    setTask(null);
    const base = construirPromptDiseno(proyecto);
    const prompt = [base, detalles.trim() && `Detalles adicionales: ${detalles.trim()}.`]
      .filter(Boolean)
      .join(" ");

    try {
      const res = await fetch("/api/generate-design-3d", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, artStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido creando la tarea.");
      pollDeadline.current = Date.now() + MAX_POLL_MS;
      setTask({ status: "PENDING", progress: 0 });
      poll(data.taskId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar la generación.");
    } finally {
      setCreando(false);
    }
  };

  const enProgreso = task && task.status !== "SUCCEEDED";
  const proxiedUrl = task?.glbUrl
    ? `/api/generate-design-3d/download?url=${encodeURIComponent(task.glbUrl)}`
    : null;

  return (
    <section className="bg-panel2/50 border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-accent">
        <Box size={18} />
        <h3 className="font-medium">Modelo 3D generado por IA (malla real)</h3>
      </div>
      <p className="text-sm text-muted">
        A diferencia de la vista paramétrica de arriba, esto genera una malla 3D real a partir
        del texto (proveedor: Meshy). Tarda entre 30 segundos y unos minutos, y consume créditos
        de la cuenta cuya API key esté configurada en el servidor.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <textarea
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
          placeholder="Detalles adicionales para el modelo 3D (forma, proporciones, acabado)..."
          rows={2}
          disabled={creando || !!enProgreso}
          className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent resize-y text-sm disabled:opacity-50"
        />
        <select
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value as "realistic" | "sculpture")}
          disabled={creando || !!enProgreso}
          className="bg-panel border border-border rounded-lg px-2 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
        >
          <option value="realistic">Estilo realista</option>
          <option value="sculpture">Estilo escultura (sin textura)</option>
        </select>
      </div>

      <button
        onClick={generar}
        disabled={creando || !!enProgreso}
        className="flex items-center gap-2 bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {creando || enProgreso ? (
          <RotateCw size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {creando
          ? "Iniciando..."
          : enProgreso
          ? `Generando... ${task?.progress ?? 0}%`
          : task?.status === "SUCCEEDED"
          ? "Regenerar modelo 3D"
          : "Generar modelo 3D"}
      </button>

      {error && (
        <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {enProgreso && (
        <div className="w-full h-1.5 bg-panel rounded-full overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${task?.progress ?? 0}%` }}
          />
        </div>
      )}

      {task?.status === "SUCCEEDED" && proxiedUrl && (
        <>
          <div className="rounded-lg overflow-hidden border border-border" style={{ height: 360 }}>
            <Design3DModelViewer url={proxiedUrl} />
          </div>
          <a
            href={proxiedUrl}
            download={`${proyecto.nombre.replace(/\s+/g, "-").toLowerCase()}-modelo.glb`}
            className="flex items-center gap-2 border border-border text-muted hover:text-text hover:border-accent/50 px-3 py-2 rounded-lg transition text-sm w-fit"
          >
            <Download size={15} /> Descargar .glb
          </a>
        </>
      )}

      <p className="text-xs text-muted">
        Requiere MESHY_API_KEY configurada en el servidor (ver README). El modelo no se guarda
        en tu proyecto — descargalo si lo querés conservar.
      </p>
    </section>
  );
}
