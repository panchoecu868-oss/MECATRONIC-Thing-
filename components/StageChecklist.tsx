"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Proyecto, StageId } from "@/lib/types";
import { Check } from "lucide-react";

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeInItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0 },
};

export function StageChecklist({ proyecto, stage }: { proyecto: Proyecto; stage: StageId }) {
  const data = proyecto.stages[stage];
  const toggleChecklistItem = useStore((s) => s.toggleChecklistItem);

  if (data.checklist.length === 0) return null;

  return (
    <section>
      <h3 className="font-medium mb-3">Checklist de la etapa</h3>
      <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" animate="show">
        {data.checklist.map((item) => (
          <motion.label
            key={item.id}
            variants={fadeInItem}
            className="flex items-center gap-3 bg-panel border border-border rounded-lg px-3 py-2.5 cursor-pointer hover:border-accent/40 transition"
          >
            <motion.span
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.preventDefault();
                toggleChecklistItem(proyecto.id, stage, item.id);
              }}
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                item.done ? "bg-accent border-accent text-bg" : "border-border"
              }`}
            >
              {item.done && <Check size={14} />}
            </motion.span>
            <span className={`text-sm ${item.done ? "text-muted line-through" : ""}`}>
              {item.label}
            </span>
          </motion.label>
        ))}
      </motion.div>
    </section>
  );
}
