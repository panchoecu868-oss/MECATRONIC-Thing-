import { NextResponse } from "next/server";

const ALLOWED_HOST = "meshy.ai";

function hostPermitido(hostname: string): boolean {
  return hostname === ALLOWED_HOST || hostname.endsWith(`.${ALLOWED_HOST}`);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Falta el parámetro url." }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "URL inválida." }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !hostPermitido(parsed.hostname)) {
    return NextResponse.json({ error: "Host no permitido." }, { status: 400 });
  }

  let resp: Response;
  try {
    resp = await fetch(parsed.toString());
  } catch {
    return NextResponse.json({ error: "No se pudo contactar al proveedor." }, { status: 502 });
  }

  if (!resp.ok || !resp.body) {
    return NextResponse.json(
      { error: `El proveedor respondió con error (${resp.status}).` },
      { status: 502 }
    );
  }

  return new NextResponse(resp.body, {
    headers: {
      "Content-Type": "model/gltf-binary",
      "Content-Disposition": 'attachment; filename="modelo.glb"',
    },
  });
}
