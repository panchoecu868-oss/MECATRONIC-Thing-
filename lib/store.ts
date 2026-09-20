import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  Proyecto,
  StageId,
  STAGE_ORDER,
  StageData,
  MaterialItem,
  BitacoraEntry,
  TroubleshootingEntry,
  PrecioConfig,
  PasoArmado,
} from "./types";
import { STAGES_META } from "./stages-meta";

function emptyStageData(id: StageId): StageData {
  return {
    notes: "",
    checklist: STAGES_META[id].checklistDefault.map((label, i) => ({
      id: `${id}-c${i}`,
      label,
      done: false,
    })),
    fields: {},
  };
}

export function emptyStages(): Record<StageId, StageData> {
  const out = {} as Record<StageId, StageData>;
  for (const s of STAGE_ORDER) out[s] = emptyStageData(s);
  return out;
}

const defaultPrecioConfig: PrecioConfig = {
  costoManoObraHora: 0,
  horasManoObra: 0,
  costosIndirectosPct: 15,
  margenGananciaPct: 30,
  ivaPct: 0,
};

interface State {
  proyectos: Proyecto[];
  crearProyecto: (nombre: string, descripcionCorta: string, areaMecatronica: string) => string;
  eliminarProyecto: (id: string) => void;
  getProyecto: (id: string) => Proyecto | undefined;
  importarProyectos: (proyectos: Proyecto[]) => { agregados: number; reemplazados: number };
  actualizarMetaProyecto: (
    pid: string,
    patch: Partial<Pick<Proyecto, "nombre" | "descripcionCorta" | "areaMecatronica">>
  ) => void;
  actualizarStageNotes: (pid: string, stage: StageId, notes: string) => void;
  actualizarStageField: (pid: string, stage: StageId, key: string, value: string) => void;
  toggleChecklistItem: (pid: string, stage: StageId, itemId: string) => void;
  addMaterial: (pid: string, item: Omit<MaterialItem, "id">) => void;
  updateMaterial: (pid: string, itemId: string, patch: Partial<MaterialItem>) => void;
  removeMaterial: (pid: string, itemId: string) => void;
  updatePrecioConfig: (pid: string, patch: Partial<PrecioConfig>) => void;
  addBitacora: (pid: string, entry: Omit<BitacoraEntry, "id">) => void;
  removeBitacora: (pid: string, entryId: string) => void;
  addTroubleshooting: (pid: string, entry: Omit<TroubleshootingEntry, "id">) => void;
  updateTroubleshooting: (pid: string, entryId: string, patch: Partial<TroubleshootingEntry>) => void;
  removeTroubleshooting: (pid: string, entryId: string) => void;
  addPasoArmado: (pid: string) => void;
  updatePasoArmado: (pid: string, pasoId: string, patch: Partial<Omit<PasoArmado, "id">>) => void;
  removePasoArmado: (pid: string, pasoId: string) => void;
  moverPasoArmado: (pid: string, pasoId: string, direccion: "up" | "down") => void;
}

function touch(p: Proyecto) {
  p.fechaActualizacion = new Date().toISOString();
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      proyectos: [],

      crearProyecto: (nombre, descripcionCorta, areaMecatronica) => {
        const id = uuidv4();
        const nuevo: Proyecto = {
          id,
          nombre,
          descripcionCorta,
          areaMecatronica,
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
          stages: emptyStages(),
          materiales: [],
          precioConfig: { ...defaultPrecioConfig },
          bitacora: [],
          troubleshooting: [],
          pasosArmado: [],
        };
        set((s) => ({ proyectos: [nuevo, ...s.proyectos] }));
        return id;
      },

      eliminarProyecto: (id) => {
        set((s) => ({ proyectos: s.proyectos.filter((p) => p.id !== id) }));
      },

      getProyecto: (id) => get().proyectos.find((p) => p.id === id),

      importarProyectos: (importados) => {
        let agregados = 0;
        let reemplazados = 0;
        set((s) => {
          const porId = new Map(s.proyectos.map((p) => [p.id, p]));
          for (const p of importados) {
            if (porId.has(p.id)) reemplazados++;
            else agregados++;
            porId.set(p.id, { ...p, pasosArmado: p.pasosArmado || [] });
          }
          return { proyectos: Array.from(porId.values()) };
        });
        return { agregados, reemplazados };
      },

      actualizarMetaProyecto: (pid, patch) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, ...patch };
            touch(np);
            return np;
          }),
        }));
      },

      actualizarStageNotes: (pid, stage, notes) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, stages: { ...p.stages, [stage]: { ...p.stages[stage], notes } } };
            touch(np);
            return np;
          }),
        }));
      },

      actualizarStageField: (pid, stage, key, value) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const stageData = p.stages[stage];
            const np = {
              ...p,
              stages: {
                ...p.stages,
                [stage]: { ...stageData, fields: { ...stageData.fields, [key]: value } },
              },
            };
            touch(np);
            return np;
          }),
        }));
      },

      toggleChecklistItem: (pid, stage, itemId) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const stageData = p.stages[stage];
            const checklist = stageData.checklist.map((it) =>
              it.id === itemId ? { ...it, done: !it.done } : it
            );
            const np = { ...p, stages: { ...p.stages, [stage]: { ...stageData, checklist } } };
            touch(np);
            return np;
          }),
        }));
      },

      addMaterial: (pid, item) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, materiales: [...p.materiales, { ...item, id: uuidv4() }] };
            touch(np);
            return np;
          }),
        }));
      },

      updateMaterial: (pid, itemId, patch) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = {
              ...p,
              materiales: p.materiales.map((m) => (m.id === itemId ? { ...m, ...patch } : m)),
            };
            touch(np);
            return np;
          }),
        }));
      },

      removeMaterial: (pid, itemId) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, materiales: p.materiales.filter((m) => m.id !== itemId) };
            touch(np);
            return np;
          }),
        }));
      },

      updatePrecioConfig: (pid, patch) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, precioConfig: { ...p.precioConfig, ...patch } };
            touch(np);
            return np;
          }),
        }));
      },

      addBitacora: (pid, entry) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, bitacora: [{ ...entry, id: uuidv4() }, ...p.bitacora] };
            touch(np);
            return np;
          }),
        }));
      },

      removeBitacora: (pid, entryId) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, bitacora: p.bitacora.filter((b) => b.id !== entryId) };
            touch(np);
            return np;
          }),
        }));
      },

      addTroubleshooting: (pid, entry) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = { ...p, troubleshooting: [{ ...entry, id: uuidv4() }, ...p.troubleshooting] };
            touch(np);
            return np;
          }),
        }));
      },

      updateTroubleshooting: (pid, entryId, patch) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = {
              ...p,
              troubleshooting: p.troubleshooting.map((t) =>
                t.id === entryId ? { ...t, ...patch } : t
              ),
            };
            touch(np);
            return np;
          }),
        }));
      },

      removeTroubleshooting: (pid, entryId) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = {
              ...p,
              troubleshooting: p.troubleshooting.filter((t) => t.id !== entryId),
            };
            touch(np);
            return np;
          }),
        }));
      },

      addPasoArmado: (pid) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = {
              ...p,
              pasosArmado: [...(p.pasosArmado || []), { id: uuidv4(), texto: "" }],
            };
            touch(np);
            return np;
          }),
        }));
      },

      updatePasoArmado: (pid, pasoId, patch) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = {
              ...p,
              pasosArmado: (p.pasosArmado || []).map((paso) =>
                paso.id === pasoId ? { ...paso, ...patch } : paso
              ),
            };
            touch(np);
            return np;
          }),
        }));
      },

      removePasoArmado: (pid, pasoId) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const np = {
              ...p,
              pasosArmado: (p.pasosArmado || []).filter((paso) => paso.id !== pasoId),
            };
            touch(np);
            return np;
          }),
        }));
      },

      moverPasoArmado: (pid, pasoId, direccion) => {
        set((s) => ({
          proyectos: s.proyectos.map((p) => {
            if (p.id !== pid) return p;
            const pasos = [...(p.pasosArmado || [])];
            const idx = pasos.findIndex((paso) => paso.id === pasoId);
            const target = direccion === "up" ? idx - 1 : idx + 1;
            if (idx === -1 || target < 0 || target >= pasos.length) return p;
            [pasos[idx], pasos[target]] = [pasos[target], pasos[idx]];
            const np = { ...p, pasosArmado: pasos };
            touch(np);
            return np;
          }),
        }));
      },
    }),
    {
      name: "mecatronic-thing-storage",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as { proyectos?: Proyecto[] };
        if (version < 1 && state.proyectos) {
          state.proyectos = state.proyectos.map((p) => ({
            ...p,
            pasosArmado: p.pasosArmado || [],
          }));
        }
        return state as State;
      },
    }
  )
);
