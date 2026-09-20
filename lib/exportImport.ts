import { Proyecto, StageData, StageId, STAGE_ORDER } from "./types";
import { emptyStages } from "./store";

interface ExportFile {
  app: "mecatronic-thing";
  version: 1;
  exportedAt: string;
  proyectos: Proyecto[];
}

export function exportarProyectos(proyectos: Proyecto[]): void {
  const payload: ExportFile = {
    app: "mecatronic-thing",
    version: 1,
    exportedAt: new Date().toISOString(),
    proyectos,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `mecatronic-thing-backup-${fecha}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function esProyectoValido(p: unknown): p is Proyecto {
  if (typeof p !== "object" || p === null) return false;
  const o = p as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.nombre === "string" &&
    typeof o.stages === "object" &&
    o.stages !== null &&
    Array.isArray(o.materiales) &&
    Array.isArray(o.bitacora) &&
    Array.isArray(o.troubleshooting) &&
    typeof o.precioConfig === "object" &&
    o.precioConfig !== null
  );
}

function repararStages(stages: unknown): Record<StageId, StageData> {
  const base = emptyStages();
  if (typeof stages !== "object" || stages === null) return base;
  const o = stages as Record<string, unknown>;
  for (const id of STAGE_ORDER) {
    const s = o[id];
    if (
      typeof s === "object" &&
      s !== null &&
      typeof (s as StageData).notes === "string" &&
      Array.isArray((s as StageData).checklist) &&
      typeof (s as StageData).fields === "object" &&
      (s as StageData).fields !== null
    ) {
      base[id] = s as StageData;
    }
  }
  return base;
}

export function parsearArchivoImportado(raw: string): Proyecto[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("El archivo no es un JSON válido.");
  }
  const candidatos = Array.isArray((data as { proyectos?: unknown })?.proyectos)
    ? (data as { proyectos: unknown[] }).proyectos
    : Array.isArray(data)
    ? (data as unknown[])
    : null;

  if (!candidatos) {
    throw new Error("El archivo no tiene el formato esperado (falta 'proyectos').");
  }
  const validos = candidatos.filter(esProyectoValido);
  if (validos.length === 0) {
    throw new Error("No se encontró ningún proyecto válido dentro del archivo.");
  }
  return validos.map((p) => ({
    ...p,
    stages: repararStages(p.stages),
    pasosArmado: p.pasosArmado || [],
  }));
}
