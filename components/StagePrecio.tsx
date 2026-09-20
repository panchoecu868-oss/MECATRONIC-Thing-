"use client";

import { useStore } from "@/lib/store";
import { Proyecto, PrecioConfig } from "@/lib/types";
import { calcularPrecio } from "@/lib/calc";
import { STAGES_META } from "@/lib/stages-meta";
import { StageChecklist } from "./StageChecklist";
import { Lightbulb } from "lucide-react";

function NumField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function StagePrecio({ proyecto }: { proyecto: Proyecto }) {
  const meta = STAGES_META.precio;
  const updatePrecioConfig = useStore((s) => s.updatePrecioConfig);
  const cfg = proyecto.precioConfig;
  const desglose = calcularPrecio(proyecto.materiales, cfg);

  const patch = (p: Partial<PrecioConfig>) => updatePrecioConfig(proyecto.id, p);

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

      <StageChecklist proyecto={proyecto} stage="precio" />

      <section className="grid gap-4 sm:grid-cols-2">
        <NumField
          label="Tarifa de mano de obra"
          value={cfg.costoManoObraHora}
          onChange={(v) => patch({ costoManoObraHora: v })}
          suffix="/hora"
        />
        <NumField
          label="Horas invertidas"
          value={cfg.horasManoObra}
          onChange={(v) => patch({ horasManoObra: v })}
          suffix="h"
        />
        <NumField
          label="Costos indirectos"
          value={cfg.costosIndirectosPct}
          onChange={(v) => patch({ costosIndirectosPct: v })}
          suffix="%"
        />
        <NumField
          label="Margen de ganancia"
          value={cfg.margenGananciaPct}
          onChange={(v) => patch({ margenGananciaPct: v })}
          suffix="%"
        />
        <NumField
          label="IVA / impuesto aplicable"
          value={cfg.ivaPct}
          onChange={(v) => patch({ ivaPct: v })}
          suffix="%"
        />
      </section>

      <section>
        <h3 className="font-medium mb-3">Desglose de precio</h3>
        <div className="bg-panel border border-border rounded-xl divide-y divide-border/60 text-sm">
          <Row label="Costo directo (BOM)" value={desglose.costoDirecto} />
          <Row label={`Costo indirecto (${cfg.costosIndirectosPct}%)`} value={desglose.costoIndirecto} />
          <Row label="Mano de obra" value={desglose.costoManoObra} />
          <Row label="Costo total" value={desglose.costoTotal} bold />
          <Row label={`Ganancia (${cfg.margenGananciaPct}%)`} value={desglose.ganancia} />
          <Row label="Subtotal" value={desglose.subtotal} />
          <Row label={`IVA (${cfg.ivaPct}%)`} value={desglose.iva} />
          <Row label="Precio final de venta" value={desglose.precioFinal} bold accent />
        </div>
        {proyecto.materiales.length === 0 && (
          <p className="text-xs text-muted mt-2">
            Todavía no cargaste materiales en la etapa anterior — el costo directo está en $0.
          </p>
        )}
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: number;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className={bold ? "font-medium" : "text-muted"}>{label}</span>
      <span className={`${bold ? "font-semibold" : ""} ${accent ? "text-accent text-lg" : ""}`}>
        ${value.toFixed(2)}
      </span>
    </div>
  );
}
