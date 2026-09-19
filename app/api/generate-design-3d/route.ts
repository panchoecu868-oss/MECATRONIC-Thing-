import { NextResponse } from "next/server";
import { MeshyClient, MeshyError } from "@glbforge/meshy";

function getClient(): MeshyClient {
  return new MeshyClient({ apiKey: process.env.MESHY_API_KEY });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const prompt = (body as { prompt?: unknown })?.prompt;
  const artStyle = (body as { artStyle?: unknown })?.artStyle;
  if (typeof prompt !== "string" || prompt.trim().length < 5) {
    return NextResponse.json({ error: "El prompt es demasiado corto o falta." }, { status: 400 });
  }

  try {
    const client = getClient();
    const taskId = await client.createTextTo3DPreview({
      prompt: prompt.slice(0, 800),
      art_style: artStyle === "sculpture" ? "sculpture" : "realistic",
    });
    return NextResponse.json({ taskId });
  } catch (e) {
    if (e instanceof MeshyError) {
      return NextResponse.json({ error: e.message }, { status: e.status ?? 502 });
    }
    return NextResponse.json(
      { error: "No se pudo contactar al proveedor de generación 3D." },
      { status: 502 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json({ error: "Falta taskId." }, { status: 400 });
  }

  try {
    const client = getClient();
    const task = await client.getTask("text-to-3d", taskId);
    return NextResponse.json(task);
  } catch (e) {
    if (e instanceof MeshyError) {
      return NextResponse.json({ error: e.message }, { status: e.status ?? 502 });
    }
    return NextResponse.json(
      { error: "No se pudo consultar el estado de la tarea." },
      { status: 502 }
    );
  }
}
