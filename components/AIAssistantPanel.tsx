"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Proyecto, StageId } from "@/lib/types";
import { construirPromptParaPegar } from "@/lib/aiPrompt";
import { construirContextoProyecto } from "@/lib/aiContext";
import {
  Bot,
  Copy,
  Check,
  Save,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Send,
  DollarSign,
} from "lucide-react";

const RESPUESTA_KEY = "respuestaIA";

export function AIAssistantPanel({
  proyecto,
  stageId,
}: {
  proyecto: Proyecto;
  stageId: StageId;
}) {
  const actualizarStageField = useStore((s) => s.actualizarStageField);

  const [pregunta, setPregunta] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [mostrarPrompt, setMostrarPrompt] = useState(false);
  const [respuestaPegada, setRespuestaPegada] = useState(
    proyecto.stages[stageId].fields[RESPUESTA_KEY] || ""
  );
  const [guardado, setGuardado] = useState(false);

  // Camino pago (API), apagado por defecto — cuesta según uso real de tu ANTHROPIC_API_KEY.
  const [usarApiPaga, setUsarApiPaga] = useState(false);
  const [loading, setLoading] = useState<"plan" | "pregunta" | null>(null);
  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [respuestaApi, setRespuestaApi] = useState<string | null>(null);

  const modo: "plan" | "pregunta" = pregunta.trim().length >= 5 ? "pregunta" : "plan";
  const promptCompleto = construirPromptParaPegar(proyecto, stageId, modo, pregunta);

  const copiarPrompt = async () => {
    await navigator.clipboard.writeText(promptCompleto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const guardarRespuesta = () => {
    actualizarStageField(proyecto.id, stageId, RESPUESTA_KEY, respuestaPegada);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2000);
  };

  const llamarApiPaga = async (modoLlamada: "plan" | "pregunta") => {
    setLoading(modoLlamada);
    setErrorApi(null);
    setRespuestaApi(null);
    const contexto = construirContextoProyecto(proyecto, stageId);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modo: modoLlamada,
          contexto,
          pregunta: modoLlamada === "pregunta" ? pregunta : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido.");
      setRespuestaApi(data.respuesta);
    } catch (e) {
      setErrorApi(e instanceof Error ? e.message : "No se pudo contactar al asistente.");
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
        <span className="text-xs text-muted font-normal">— gratis: arma el prompt, vos lo pegás en Claude</span>
      </div>

      <input
        value={pregunta}
        onChange={(e) => setPregunta(e.target.value)}
        placeholder="¿Tenés un problema puntual? Escribilo acá (opcional — si lo dejás vacío, arma un plan de acción general)"
        className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent2"
      />

      <div className="flex flex-wrap items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={copiarPrompt}
          className="flex items-center gap-2 bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          {copiado ? <Check size={16} /> : <Copy size={16} />}
          {copiado ? "¡Copiado!" : "Copiar prompt para pegar en Claude"}
        </motion.button>
        <button
          onClick={() => setMostrarPrompt(!mostrarPrompt)}
          className="flex items-center gap-1 text-xs text-muted hover:text-text"
        >
          {mostrarPrompt ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Ver qué se copia
        </button>
      </div>

      <AnimatePresence>
        {mostrarPrompt && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-panel border border-border rounded-lg p-3 text-xs text-muted whitespace-pre-wrap overflow-hidden max-h-64 overflow-y-auto"
          >
            {promptCompleto}
          </motion.pre>
        )}
      </AnimatePresence>

      <div className="space-y-2 pt-1">
        <label className="block text-sm font-medium">Pegá acá la respuesta de Claude</label>
        <textarea
          value={respuestaPegada}
          onChange={(e) => setRespuestaPegada(e.target.value)}
          placeholder="Pegá lo que te respondió Claude Code o claude.ai..."
          rows={4}
          className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-accent resize-y"
        />
        <button
          onClick={guardarRespuesta}
          disabled={!respuestaPegada.trim()}
          className="flex items-center gap-2 border border-border text-muted hover:text-text hover:border-accent/50 px-3 py-2 rounded-lg transition text-sm disabled:opacity-40"
        >
          {guardado ? <Check size={15} /> : <Save size={15} />}
          {guardado ? "Guardado" : "Guardar en el proyecto"}
        </button>
      </div>

      <div className="pt-2 border-t border-border">
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={usarApiPaga}
            onChange={(e) => setUsarApiPaga(e.target.checked)}
          />
          <DollarSign size={13} />
          Automatizar con la API (opcional — consume tu propia ANTHROPIC_API_KEY, tiene costo)
        </label>

        {usarApiPaga && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => llamarApiPaga("plan")}
                disabled={loading !== null}
                className="flex items-center gap-2 bg-accent2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
              >
                {loading === "plan" ? <RotateCw size={15} className="animate-spin" /> : <Send size={15} />}
                Generar plan
              </button>
              <button
                onClick={() => llamarApiPaga("pregunta")}
                disabled={loading !== null || pregunta.trim().length < 5}
                className="flex items-center gap-2 bg-accent2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40 text-sm"
              >
                {loading === "pregunta" ? <RotateCw size={15} className="animate-spin" /> : <Send size={15} />}
                Preguntar
              </button>
            </div>
            {errorApi && (
              <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                {errorApi}
              </p>
            )}
            {respuestaApi && (
              <div className="bg-panel border border-border rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                {respuestaApi}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
