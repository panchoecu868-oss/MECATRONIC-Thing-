import { MaterialItem, PrecioConfig, StageId, Proyecto } from "./types";
import { STAGES_META } from "./stages-meta";
import { STAGE_ORDER } from "./types";

export function costoDirectoBOM(materiales: MaterialItem[]): number {
  return materiales.reduce((acc, m) => acc + m.cantidad * m.precioUnitario, 0);
}

export interface DesglosePrecio {
  costoDirecto: number;
  costoIndirecto: number;
  costoManoObra: number;
  costoTotal: number;
  ganancia: number;
  subtotal: number;
  iva: number;
  precioFinal: number;
}

export function calcularPrecio(materiales: MaterialItem[], cfg: PrecioConfig): DesglosePrecio {
  const costoDirecto = costoDirectoBOM(materiales);
  const costoIndirecto = costoDirecto * (cfg.costosIndirectosPct / 100);
  const costoManoObra = cfg.costoManoObraHora * cfg.horasManoObra;
  const costoTotal = costoDirecto + costoIndirecto + costoManoObra;
  const ganancia = costoTotal * (cfg.margenGananciaPct / 100);
  const subtotal = costoTotal + ganancia;
  const iva = subtotal * (cfg.ivaPct / 100);
  const precioFinal = subtotal + iva;
  return { costoDirecto, costoIndirecto, costoManoObra, costoTotal, ganancia, subtotal, iva, precioFinal };
}

export function stageProgresoById(p: Proyecto, stage: StageId): number {
  const data = p.stages[stage];
  const meta = STAGES_META[stage];
  const totalCampos = meta.fields.length;
  const camposLlenos = meta.fields.filter((f) => (data.fields[f.key] || "").trim().length > 0).length;
  const totalChecklist = data.checklist.length;
  const doneChecklist = data.checklist.filter((c) => c.done).length;

  const totalItems = totalCampos + totalChecklist;
  if (totalItems === 0) return 0;
  return Math.round(((camposLlenos + doneChecklist) / totalItems) * 100);
}

export function progresoTotal(p: Proyecto): number {
  const porcentajes = STAGE_ORDER.map((s) => stageProgresoById(p, s));
  return Math.round(porcentajes.reduce((a, b) => a + b, 0) / porcentajes.length);
}
