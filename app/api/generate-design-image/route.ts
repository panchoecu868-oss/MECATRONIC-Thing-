import { NextResponse } from "next/server";

const OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations";
const MAX_PROMPT_LENGTH = 4000;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta configurar OPENAI_API_KEY en el servidor. Agregá esa variable de entorno (ver README) para habilitar la generación de imágenes.",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const prompt = (body as { prompt?: unknown })?.prompt;
  if (typeof prompt !== "string" || prompt.trim().length < 5) {
    return NextResponse.json({ error: "El prompt es demasiado corto o falta." }, { status: 400 });
  }

  let resp: Response;
  try {
    resp = await fetch(OPENAI_IMAGES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt.slice(0, MAX_PROMPT_LENGTH),
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo contactar al proveedor de generación de imágenes." },
      { status: 502 }
    );
  }

  if (!resp.ok) {
    const errBody = await resp.json().catch(() => null);
    const message =
      (errBody as { error?: { message?: string } } | null)?.error?.message ||
      `El proveedor respondió con error (${resp.status}).`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const data = await resp.json();
  const b64 = (data as { data?: { b64_json?: string }[] })?.data?.[0]?.b64_json;
  if (!b64) {
    return NextResponse.json({ error: "El proveedor no devolvió ninguna imagen." }, { status: 502 });
  }

  return NextResponse.json({ image: `data:image/png;base64,${b64}` });
}
