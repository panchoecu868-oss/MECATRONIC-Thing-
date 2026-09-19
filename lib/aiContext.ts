import { Proyecto, StageId, STAGE_ORDER } from "./types";
import { STAGES_META } from "./stages-meta";
import { costoDirectoBOM, calcularPrecio } from "./calc";

export function construirContextoProyecto(proyecto: Proyecto, stageActual: StageId): string {
  const lineas: string[] = [
    `Nombre del proyecto: ${proyecto.nombre}`,
    `Área mecatrónica: ${proyecto.areaMecatronica}`,
    proyecto.descripcionCorta && `Descripción: ${proyecto.descripcionCorta}`,
    `Etapa actual: ${STAGES_META[stageActual].titulo}`,
  ].filter(Boolean) as string[];

  for (const stageId of STAGE_ORDER) {
    const meta = STAGES_META[stageId];
    const data = proyecto.stages[stageId];
    const camposLlenos = meta.fields
      .map((f) => {
        const valor = data.fields[f.key];
        return valor && valor.trim() ? `  - ${f.label}: ${valor.trim()}` : null;
      })
      .filter(Boolean);
    if (camposLlenos.length > 0) {
      lineas.push(`\n${meta.titulo}:`, ...(camposLlenos as string[]));
    }
  }

  if (proyecto.materiales.length > 0) {
    lineas.push(
      `\nMateriales cargados (${proyecto.materiales.length}): ` +
        proyecto.materiales.map((m) => `${m.nombre} (${m.cantidad} ${m.unidad}, $${m.precioUnitario} c/u)`).join("; "),
      `Costo directo total: $${costoDirectoBOM(proyecto.materiales).toFixed(2)}`
    );
  }

  if (proyecto.materiales.length > 0 && proyecto.precioConfig) {
    const desglose = calcularPrecio(proyecto.materiales, proyecto.precioConfig);
    lineas.push(`Precio final calculado: $${desglose.precioFinal.toFixed(2)}`);
  }

  if (proyecto.bitacora.length > 0) {
    lineas.push(
      `\nÚltimas entradas de bitácora: ` +
        proyecto.bitacora
          .slice(0, 3)
          .map((b) => `"${b.titulo}" (${b.fecha}): ${b.detalle}`)
          .join(" | ")
    );
  }

  if (proyecto.troubleshooting.length > 0) {
    lineas.push(
      `\nProblemas registrados: ` +
        proyecto.troubleshooting
          .slice(0, 3)
          .map((t) => `${t.problema}${t.resuelto ? " (resuelto: " + t.solucion + ")" : " (sin resolver)"}`)
          .join(" | ")
    );
  }

  return lineas.join("\n");
}
