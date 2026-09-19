"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Proyecto, StageId } from "@/lib/types";
import { construirContextoProyecto } from "@/lib/aiContext";
import { Bot, Sparkles, Send, RotateCw } from "lucide-react";

export function AIAssistantPanel({
  proyecto,
  stageId,
}: {
  proyecto: Proyecto;
  stageId: StageId;
}) {
  const [pregunta, setPregunta] = useState("");
  const [loading, setLoading] = useState<"plan" | "pregunta" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);

  const llamar = async (modo: "plan" | "pregunta") => {
    setLoading(modo);
    setError(null);
    setRespuesta(null);
    const contexto = construirContextoProyecto(proyecto, stageId);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo, contexto, pregunta: modo === "pregunta" ? pregunta : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido.");
      setRespuesta(data.respuesta);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo contactar al asistente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border border-accent/40 bg-gradient-to-br from-accent/10 via-panel to-accent2/10 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2 text-accent">
        <Bot size={19} />
        <h3 className="font-medium">Asistente IA</h3>
        <span className="text-xs text-muted font-normal">— genera contenido para TU proyecto, no una lista genérica</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => llamar("plan")}
          disabled={loading !== null}
          className="flex items-center gap-2 bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading === "plan" ? <RotateCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Generar plan de acción para esta etapa
        </motion.button>
      </div>

      <div className="flex gap-2">
        <input
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pregunta.trim() && llamar("pregunta")}
          placeholder="¿Tenés un problema puntual? Preguntale al asistente..."
          disabled={loading !== null}
          className="flex-1 bg-panel border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent2 disabled:opacity-50"
        />
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => llamar("pregunta")}
          disabled={loading !== null || pregunta.trim().length < 5}
          className="flex items-center gap-2 bg-accent2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40"
        >
          {loading === "pregunta" ? <RotateCw size={16} className="animate-spin" /> : <Send size={16} />}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2"
          >
            {error}
          </motion.p>
        )}
        {respuesta && (
          <motion.div
            key="respuesta"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-panel border border-border rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed overflow-hidden"
          >
            {respuesta}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted">
        Requiere ANTHROPIC_API_KEY configurada en el servidor (ver README). Usa todo lo que ya
        cargaste en el proyecto como contexto real, no genera contenido genérico.
      </p>
    </motion.section>
  );
}
