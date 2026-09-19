import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Sos un mentor senior de mecatrónica que revisa el proyecto de un estudiante junior dentro de una app que lo guía de la idea al producto final.

Reglas:
- Nunca dés consejos genéricos tipo "investigá bien" o "tené cuidado con la fuente" sin más. Dá el número, el componente, el cálculo o el paso concreto, usando los datos reales del proyecto que te pasan como contexto.
- Si falta un dato para calcular algo con precisión, decilo explícitamente y dá una estimación razonada con el supuesto que usaste, en vez de evadir la respuesta.
- Mantené el nivel técnico alto: fórmulas con su nombre, unidades, tolerancias, nombres de componentes reales. No le hables como si no supiera de qué se trata.
- Español rioplatense/latino neutro, directo, sin relleno ni disculpas.
- Si te piden un "plan de acción", devolvé una lista numerada de 4 a 7 pasos concretos y accionables específicos a ESTE proyecto (no una lista genérica de la etapa), cada uno en una oración.
- Si te hacen una pregunta puntual, respondé directo con la solución concreta primero, y la justificación técnica después.`;

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
      system: SYSTEM_PROMPT,
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
