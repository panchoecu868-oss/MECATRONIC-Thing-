"use client";

import { useState } from "react";
import { Proyecto } from "@/lib/types";
import { construirPromptDiseno } from "@/lib/designPrompt";
import { Sparkles, Download, RotateCw, ImageIcon } from "lucide-react";

export function DesignImageGenerator({ proyecto }: { proyecto: Proyecto }) {
  const [detalles, setDetalles] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagen, setImagen] = useState<string | null>(null);

  const generar = async () => {
    setLoading(true);
    setError(null);
    const base = construirPromptDiseno(proyecto);
    const prompt = [
      base,
      detalles.trim() && `Detalles visuales adicionales: ${detalles.trim()}.`,
      "Render de producto tipo concept art industrial, fondo neutro, iluminación de estudio, alta fidelidad, sin texto ni marcas de agua.",
    ]
      .filter(Boolean)
      .join(" ");

    try {
      const res = await fetch("/api/generate-design-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido generando la imagen.");
      setImagen(data.image);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo generar la imagen.");
    } finally {
      setLoading(false);
    }
  };

  const descargar = () => {
    if (!imagen) return;
    const a = document.createElement("a");
    a.href = imagen;
    a.download = `${proyecto.nombre.replace(/\s+/g, "-").toLowerCase()}-concepto.png`;
    a.click();
  };

  return (
    <section className="bg-panel2/50 border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-accent">
        <Sparkles size={18} />
        <h3 className="font-medium">Imagen conceptual generada por IA</h3>
      </div>
      <p className="text-sm text-muted">
        Arma el prompt automáticamente a partir de lo que ya documentaste en esta etapa
        (mecanismo, materiales, electrónica). Agregá detalles visuales opcionales si querés
        dirigir el estilo o algo puntual que no quedó en el texto.
      </p>

      <textarea
        value={detalles}
        onChange={(e) => setDetalles(e.target.value)}
        placeholder="Detalles visuales opcionales: color, acabado, punto de vista, contexto de uso..."
        rows={2}
        className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent resize-y text-sm"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={generar}
          disabled={loading}
          className="flex items-center gap-2 bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? <RotateCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {loading ? "Generando..." : imagen ? "Regenerar" : "Generar imagen conceptual"}
        </button>
        {imagen && (
          <button
            onClick={descargar}
            className="flex items-center gap-2 border border-border text-muted hover:text-text hover:border-accent/50 px-3 py-2 rounded-lg transition text-sm"
          >
            <Download size={15} /> Descargar
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {imagen ? (
        <img
          src={imagen}
          alt={`Concepto visual de ${proyecto.nombre}`}
          className="w-full max-w-md rounded-lg border border-border"
        />
      ) : (
        !error && (
          <div className="flex items-center gap-2 text-muted text-sm">
            <ImageIcon size={16} /> Todavía no generaste ninguna imagen para este proyecto.
          </div>
        )
      )}

      <p className="text-xs text-muted">
        La imagen no se guarda en tu proyecto (para no inflar el almacenamiento local) —
        descargala si la querés conservar. Cada generación tiene un costo pequeño en la cuenta
        que provee la API key configurada en el servidor.
      </p>
    </section>
  );
}
