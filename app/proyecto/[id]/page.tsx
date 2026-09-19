"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { StageId, STAGE_ORDER } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { progresoTotal } from "@/lib/calc";
import { ProgressBar } from "@/components/ProgressBar";
import { StageSidebar } from "@/components/StageSidebar";
import { StageGeneric } from "@/components/StageGeneric";
import { StageMateriales } from "@/components/StageMateriales";
import { StagePrecio } from "@/components/StagePrecio";
import { StageBitacora } from "@/components/StageBitacora";
import { StageTroubleshooting } from "@/components/StageTroubleshooting";
import { EditarProyectoMeta } from "@/components/EditarProyectoMeta";
import { DesignImageGenerator } from "@/components/DesignImageGenerator";
import { Design3DViewer } from "@/components/Design3DViewer";
import { Design3DAIGenerator } from "@/components/Design3DAIGenerator";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProyectoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const proyectos = useStore((s) => s.proyectos);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const proyecto = proyectos.find((p) => p.id === params.id);

  const stageParam = searchParams.get("etapa") as StageId | null;
  const stage: StageId = stageParam && STAGE_ORDER.includes(stageParam) ? stageParam : "idea";

  const setStage = (s: StageId) => {
    router.push(`/proyecto/${params.id}?etapa=${s}`);
  };

  if (!mounted) return null;

  if (!proyecto) {
    return (
      <main className="min-h-screen max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-muted mb-4">Proyecto no encontrado.</p>
        <Link href="/" className="text-accent hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  const idx = STAGE_ORDER.indexOf(stage);
  const pct = progresoTotal(proyecto);

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-text text-sm">
          <ArrowLeft size={16} /> Proyectos
        </Link>
        <div className="flex items-center gap-3 w-64">
          <ProgressBar pct={pct} />
          <span className="text-xs text-muted w-10 text-right">{pct}%</span>
        </div>
      </div>

      <div className="mb-8">
        <EditarProyectoMeta proyecto={proyecto} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
        <aside>
          <StageSidebar proyecto={proyecto} active={stage} onSelect={setStage} />
        </aside>

        <section>
          <div className="mb-6">
            <span className="text-xs text-accent2 font-mono">
              Etapa {STAGES_META[stage].numero} / {STAGE_ORDER.length}
            </span>
            <h2 className="text-lg font-semibold">{STAGES_META[stage].titulo}</h2>
            <p className="text-sm text-muted">{STAGES_META[stage].resumen}</p>
          </div>

          {stage === "materiales" ? (
            <StageMateriales proyecto={proyecto} />
          ) : stage === "precio" ? (
            <StagePrecio proyecto={proyecto} />
          ) : stage === "bitacora" ? (
            <StageBitacora proyecto={proyecto} />
          ) : stage === "troubleshooting" ? (
            <StageTroubleshooting proyecto={proyecto} />
          ) : stage === "diseno" ? (
            <div className="space-y-8">
              <StageGeneric proyecto={proyecto} stage={stage} />
              <Design3DViewer proyecto={proyecto} />
              <Design3DAIGenerator proyecto={proyecto} />
              <DesignImageGenerator proyecto={proyecto} />
            </div>
          ) : (
            <StageGeneric proyecto={proyecto} stage={stage} />
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <button
              disabled={idx === 0}
              onClick={() => setStage(STAGE_ORDER[idx - 1])}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <button
              disabled={idx === STAGE_ORDER.length - 1}
              onClick={() => setStage(STAGE_ORDER[idx + 1])}
              className="flex items-center gap-1.5 text-sm text-accent hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
