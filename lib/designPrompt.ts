import { Proyecto } from "./types";

export function construirPromptDiseno(proyecto: Proyecto): string {
  const diseno = proyecto.stages.diseno.fields;
  const partes = [
    `Concepto de producto mecatrónico: "${proyecto.nombre}".`,
    proyecto.descripcionCorta && `Descripción: ${proyecto.descripcionCorta}.`,
    proyecto.areaMecatronica && `Área: ${proyecto.areaMecatronica}.`,
    diseno.cinematica && `Mecanismo: ${diseno.cinematica}.`,
    diseno.materiales && `Materiales: ${diseno.materiales}.`,
    diseno.electronica && `Electrónica visible: ${diseno.electronica}.`,
  ].filter(Boolean);
  return partes.join(" ");
}
