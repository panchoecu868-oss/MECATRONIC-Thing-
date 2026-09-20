"use client";

import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { Proyecto } from "@/lib/types";
import { parseVista3DConfig, VISTA3D_COLORES, Vista3DConfig } from "@/lib/vista3d";
import { Box } from "lucide-react";

const Design3DScene = dynamic(() => import("./Design3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video rounded-lg border border-border bg-panel flex items-center justify-center text-muted text-sm">
      Cargando visor 3D...
    </div>
  ),
});

export function Design3DViewer({ proyecto }: { proyecto: Proyecto }) {
  const actualizarStageField = useStore((s) => s.actualizarStageField);
  const raw = proyecto.stages.diseno.fields["vista3dConfig"];
  const config = parseVista3DConfig(raw);

  const patch = (p: Partial<Vista3DConfig>) => {
    const nuevo = { ...config, ...p };
    actualizarStageField(proyecto.id, "diseno", "vista3dConfig", JSON.stringify(nuevo));
  };

  return (
    <section className="bg-panel2/50 border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-accent2">
        <Box size={18} />
        <h3 className="font-medium">Vista 3D paramétrica</h3>
      </div>
      <p className="text-sm text-muted">
        No es un render generado por IA ni tu geometría real — es un armado rotable a partir
        de las medidas y cantidad de eslabones que definas, para tener una primera referencia
        de proporciones y volumen mientras avanzás con el CAD de verdad.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NumField label="Ancho (cm)" value={config.ancho} onChange={(v) => patch({ ancho: v })} />
        <NumField label="Profundidad (cm)" value={config.profundidad} onChange={(v) => patch({ profundidad: v })} />
        <NumField label="Alto (cm)" value={config.alto} onChange={(v) => patch({ alto: v })} />
        <div>
          <label className="block text-xs text-muted mb-1">Eslabones</label>
          <select
            value={config.numEslabones}
            onChange={(e) => patch({ numEslabones: parseInt(e.target.value, 10) })}
            className="w-full bg-panel border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-accent"
          >
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {VISTA3D_COLORES.map((c) => (
            <button
              key={c.hex}
              title={c.label}
              onClick={() => patch({ color: c.hex })}
              className={`w-6 h-6 rounded-full border-2 ${
                config.color === c.hex ? "border-text" : "border-transparent"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={config.plataforma}
            onChange={(e) => patch({ plataforma: e.target.checked })}
          />
          Mostrar plataforma base
        </label>
      </div>

      <div className="rounded-lg overflow-hidden border border-border" style={{ height: 360 }}>
        <Design3DScene config={config} />
      </div>
      <p className="text-xs text-muted">Arrastrá para rotar, scroll para acercar/alejar.</p>
    </section>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input
        type="number"
        min={5}
        max={100}
        value={value}
        onChange={(e) => onChange(Math.min(100, Math.max(5, parseFloat(e.target.value) || 5)))}
        className="w-full bg-panel border border-border rounded-lg px-2 py-1.5 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
