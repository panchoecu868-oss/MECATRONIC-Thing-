export type StageId =
  | "idea"
  | "investigacion"
  | "requisitos"
  | "diseno"
  | "materiales"
  | "precio"
  | "bitacora"
  | "troubleshooting"
  | "final";

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface BitacoraEntry {
  id: string;
  fecha: string; // ISO date
  titulo: string;
  detalle: string;
  horasInvertidas: number;
}

export interface TroubleshootingEntry {
  id: string;
  fecha: string;
  problema: string;
  hipotesis: string;
  solucion: string;
  resuelto: boolean;
}

export interface MaterialItem {
  id: string;
  nombre: string;
  categoria: "mecanico" | "electronico" | "consumible" | "software" | "otro";
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  proveedor: string;
  linkORef: string;
  recibido: boolean;
}

export interface PrecioConfig {
  costoManoObraHora: number;
  horasManoObra: number;
  costosIndirectosPct: number; // % sobre costo directo (energía, herramienta, depreciación)
  margenGananciaPct: number; // % de ganancia deseado
  ivaPct: number;
}

export interface StageData {
  notes: string;
  checklist: ChecklistItem[];
  fields: Record<string, string>;
}

export interface Proyecto {
  id: string;
  nombre: string;
  descripcionCorta: string;
  areaMecatronica: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  stages: Record<StageId, StageData>;
  materiales: MaterialItem[];
  precioConfig: PrecioConfig;
  bitacora: BitacoraEntry[];
  troubleshooting: TroubleshootingEntry[];
}

export const STAGE_ORDER: StageId[] = [
  "idea",
  "investigacion",
  "requisitos",
  "diseno",
  "materiales",
  "precio",
  "bitacora",
  "troubleshooting",
  "final",
];
