"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { Proyecto } from "@/lib/types";
import { redimensionarImagen } from "@/lib/image";
import { hablar, detenerVoz, vozDisponible } from "@/lib/voz";
import { Plus, Trash2, ImagePlus, Volume2, VolumeX, ChevronUp, ChevronDown, ListChecks } from "lucide-react";

export function GuiaArmado({ proyecto }: { proyecto: Proyecto }) {
  const addPasoArmado = useStore((s) => s.addPasoArmado);
  const updatePasoArmado = useStore((s) => s.updatePasoArmado);
  const removePasoArmado = useStore((s) => s.removePasoArmado);
  const moverPasoArmado = useStore((s) => s.moverPasoArmado);
  const [hablando, setHablando] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const activeVoiceId = useRef<string | null>(null);

  const pasos = proyecto.pasosArmado || [];

  const handleFoto = async (pasoId: string, file: File | undefined) => {
    if (!file) return;
    try {
      const dataUrl = await redimensionarImagen(file);
      updatePasoArmado(proyecto.id, pasoId, { foto: dataUrl });
    } catch {
      alert("No se pudo procesar la imagen.");
    }
  };

  const iniciarVoz = (id: string, texto: string) => {
    activeVoiceId.current = id;
    hablar(texto, () => {
      if (activeVoiceId.current === id) setHablando(null);
    });
    setHablando(id);
  };

  const escucharPaso = (id: string, texto: string) => {
    if (hablando === id) {
      activeVoiceId.current = null;
      detenerVoz();
      setHablando(null);
      return;
    }
    iniciarVoz(id, texto);
  };

  const escucharTodo = () => {
    const texto = pasos.map((p, i) => `Paso ${i + 1}. ${p.texto}`).join(". ");
    iniciarVoz("todo", texto);
  };

  return (
    <section className="bg-panel2/50 border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-accent">
          <ListChecks size={18} />
          <h3 className="font-medium">Guía de armado paso a paso</h3>
        </div>
        {vozDisponible() && pasos.length > 0 && (
          <button
            onClick={escucharTodo}
            className="flex items-center gap-1.5 text-xs text-accent2 hover:opacity-80"
          >
            <Volume2 size={14} /> Escuchar toda la guía
          </button>
        )}
      </div>
      <p className="text-sm text-muted">
        Cada paso es texto + una foto opcional (subida por vos, no generada por IA) — esto es lo
        que termina en el PDF exportable y se puede escuchar en voz alta con el lector nativo del
        navegador, gratis.
      </p>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {pasos.map((paso, i) => (
            <motion.div
              key={paso.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-panel border border-border rounded-lg p-4 overflow-hidden"
            >
              <div className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm flex items-center justify-center shrink-0 font-mono">
                  {i + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <textarea
                    value={paso.texto}
                    onChange={(e) => updatePasoArmado(proyecto.id, paso.id, { texto: e.target.value })}
                    placeholder="Describí este paso del armado..."
                    rows={2}
                    className="w-full bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent resize-y"
                  />
                  {paso.foto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={paso.foto}
                      alt={`Foto del paso ${i + 1}`}
                      className="max-h-40 rounded-lg border border-border"
                    />
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      ref={(el) => {
                        fileInputs.current[paso.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFoto(paso.id, e.target.files?.[0])}
                    />
                    <button
                      onClick={() => fileInputs.current[paso.id]?.click()}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-text"
                    >
                      <ImagePlus size={14} /> {paso.foto ? "Cambiar foto" : "Agregar foto"}
                    </button>
                    {vozDisponible() && paso.texto.trim() && (
                      <button
                        onClick={() => escucharPaso(paso.id, paso.texto)}
                        className="flex items-center gap-1.5 text-xs text-accent2 hover:opacity-80"
                      >
                        {hablando === paso.id ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        {hablando === paso.id ? "Detener" : "Escuchar"}
                      </button>
                    )}
                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        disabled={i === 0}
                        onClick={() => moverPasoArmado(proyecto.id, paso.id, "up")}
                        className="text-muted hover:text-text disabled:opacity-30"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        disabled={i === pasos.length - 1}
                        onClick={() => moverPasoArmado(proyecto.id, paso.id, "down")}
                        className="text-muted hover:text-text disabled:opacity-30"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => removePasoArmado(proyecto.id, paso.id)}
                        className="text-muted hover:text-danger ml-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => addPasoArmado(proyecto.id)}
        className="flex items-center gap-2 border border-dashed border-border text-muted hover:text-accent hover:border-accent/50 px-4 py-2 rounded-lg transition text-sm w-full justify-center"
      >
        <Plus size={16} /> Agregar paso
      </button>
    </section>
  );
}
