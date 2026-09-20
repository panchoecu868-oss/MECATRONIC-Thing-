"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Proyecto, StageId } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { StageChecklist } from "./StageChecklist";
import { Lightbulb } from "lucide-react";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeInItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function StageGeneric({ proyecto, stage }: { proyecto: Proyecto; stage: StageId }) {
  const meta = STAGES_META[stage];
  const data = proyecto.stages[stage];
  const actualizarStageField = useStore((s) => s.actualizarStageField);

  return (
    <div className="space-y-8">
      <section className="bg-panel2/50 border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-accent">
          <Lightbulb size={18} />
          <h3 className="font-medium">Guía técnica</h3>
        </div>
        <motion.ul
          className="space-y-2.5"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {meta.guia.map((g, i) => (
            <motion.li
              key={i}
              variants={fadeInItem}
              className="text-sm text-muted leading-relaxed flex gap-2"
            >
              <span className="text-accent2 shrink-0">›</span>
              <span>{g}</span>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <StageChecklist proyecto={proyecto} stage={stage} />

      {meta.fields.length > 0 && (
        <section className="space-y-5">
          <h3 className="font-medium">Documentación de la etapa</h3>
          {meta.fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1.5">{f.label}</label>
              {f.type === "text" ? (
                <input
                  value={data.fields[f.key] || ""}
                  onChange={(e) => actualizarStageField(proyecto.id, stage, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent text-sm"
                />
              ) : (
                <textarea
                  value={data.fields[f.key] || ""}
                  onChange={(e) => actualizarStageField(proyecto.id, stage, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className="w-full bg-panel border border-border rounded-lg px-3 py-2.5 outline-none focus:border-accent resize-y text-sm"
                />
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
