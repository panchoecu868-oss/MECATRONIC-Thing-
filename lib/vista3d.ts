export interface Vista3DConfig {
  ancho: number;
  profundidad: number;
  alto: number;
  numEslabones: number;
  color: string;
  plataforma: boolean;
}

export const VISTA3D_DEFAULT: Vista3DConfig = {
  ancho: 20,
  profundidad: 20,
  alto: 15,
  numEslabones: 2,
  color: "#1bf2dd",
  plataforma: true,
};

export const VISTA3D_COLORES = [
  { label: "Turquesa", hex: "#1bf2dd" },
  { label: "Cian", hex: "#0fdbf2" },
  { label: "Magenta", hex: "#a6175a" },
  { label: "Teal oscuro", hex: "#096873" },
  { label: "Vino", hex: "#590a2f" },
];

export function parseVista3DConfig(raw: string | undefined): Vista3DConfig {
  if (!raw) return { ...VISTA3D_DEFAULT };
  try {
    const parsed = JSON.parse(raw);
    return {
      ancho: Number(parsed.ancho) || VISTA3D_DEFAULT.ancho,
      profundidad: Number(parsed.profundidad) || VISTA3D_DEFAULT.profundidad,
      alto: Number(parsed.alto) || VISTA3D_DEFAULT.alto,
      numEslabones: Math.min(4, Math.max(0, Number(parsed.numEslabones) || 0)),
      color: typeof parsed.color === "string" ? parsed.color : VISTA3D_DEFAULT.color,
      plataforma: Boolean(parsed.plataforma),
    };
  } catch {
    return { ...VISTA3D_DEFAULT };
  }
}
