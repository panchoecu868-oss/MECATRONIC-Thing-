import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ASISTENTE_SYSTEM_PROMPT } from "@/lib/aiPrompt";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Falta configurar ANTHROPIC_API_KEY en el servidor. Agregá esa variable de entorno (ver README) para habilitar el asistente IA.",
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

  const { modo, contexto, pregunta } = body as {
    modo?: unknown;
    contexto?: unknown;
    pregunta?: unknown;
  };

  if (modo !== "plan" && modo !== "pregunta") {
    return NextResponse.json({ error: "modo debe ser 'plan' o 'pregunta'." }, { status: 400 });
  }
  if (typeof contexto !== "string" || contexto.trim().length < 5) {
    return NextResponse.json({ error: "Falta el contexto del proyecto." }, { status: 400 });
  }
  if (modo === "pregunta" && (typeof pregunta !== "string" || pregunta.trim().length < 5)) {
    return NextResponse.json({ error: "Escribí una pregunta más específica." }, { status: 400 });
  }

  const userContent =
    modo === "plan"
      ? `Contexto del proyecto:\n${contexto}\n\nGenerá el plan de acción para esta etapa.`
      : `Contexto del proyecto:\n${contexto}\n\nPregunta puntual del estudiante: ${pregunta}`;

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      system: ASISTENTE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );

    if (!textBlock) {
      return NextResponse.json(
        { error: "El modelo no devolvió una respuesta de texto." },
        { status: 502 }
      );
    }

    return NextResponse.json({ respuesta: textBlock.text });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY inválida." }, { status: 401 });
    }
    if (e instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Límite de uso de la API alcanzado, probá de nuevo en un momento." },
        { status: 429 }
      );
    }
    if (e instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Error de la API (${e.status}): ${e.message}` }, { status: 502 });
    }
    return NextResponse.json(
      { error: "No se pudo contactar al asistente IA." },
      { status: 502 }
    );
  }
}
