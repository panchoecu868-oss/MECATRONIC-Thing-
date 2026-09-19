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
  color: "#3ddc97",
  plataforma: true,
};

export const VISTA3D_COLORES = [
  { label: "Verde", hex: "#3ddc97" },
  { label: "Azul", hex: "#4fb0ff" },
  { label: "Naranja", hex: "#ffb454" },
  { label: "Gris", hex: "#8b98a5" },
  { label: "Rojo", hex: "#ff6b6b" },
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
