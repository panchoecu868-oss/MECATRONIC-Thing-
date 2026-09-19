"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Proyecto, MaterialItem } from "@/lib/types";
import { costoDirectoBOM } from "@/lib/calc";
import { STAGES_META } from "@/lib/stages-meta";
import { Lightbulb, Plus, Trash2, Check } from "lucide-react";

const CATEGORIAS: MaterialItem["categoria"][] = [
  "mecanico",
  "electronico",
  "consumible",
  "software",
  "otro",
];

const emptyForm = {
  nombre: "",
  categoria: "mecanico" as MaterialItem["categoria"],
  cantidad: "1",
  unidad: "pza",
  precioUnitario: "0",
  proveedor: "",
  linkORef: "",
};

export function StageMateriales({ proyecto }: { proyecto: Proyecto }) {
  const meta = STAGES_META.materiales;
  const addMaterial = useStore((s) => s.addMaterial);
  const updateMaterial = useStore((s) => s.updateMaterial);
  const removeMaterial = useStore((s) => s.removeMaterial);
  const [form, setForm] = useState(emptyForm);

  const total = costoDirectoBOM(proyecto.materiales);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    addMaterial(proyecto.id, {
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      cantidad: parseFloat(form.cantidad) || 0,
      unidad: form.unidad.trim() || "pza",
      precioUnitario: parseFloat(form.precioUnitario) || 0,
      proveedor: form.proveedor.trim(),
      linkORef: form.linkORef.trim(),
      recibido: false,
    });
    setForm(emptyForm);
  };

  return (
    <div className="space-y-8">
      <section className="bg-panel2/50 border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-accent">
          <Lightbulb size={18} />
          <h3 className="font-medium">Guía técnica</h3>
        </div>
        <ul className="space-y-2.5">
          {meta.guia.map((g, i) => (
            <li key={i} className="text-sm text-muted leading-relaxed flex gap-2">
              <span className="text-accent2 shrink-0">›</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="font-medium mb-3">Lista de materiales (BOM)</h3>

        {proyecto.materiales.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="py-2 pr-3">Recibido</th>
                  <th className="py-2 pr-3">Nombre</th>
                  <th className="py-2 pr-3">Categoría</th>
                  <th className="py-2 pr-3">Cant.</th>
                  <th className="py-2 pr-3">Precio unit.</th>
                  <th className="py-2 pr-3">Subtotal</th>
                  <th className="py-2 pr-3">Proveedor</th>
                  <th className="py-2 pr-3"></th>
                </tr>
              </thead>
              <tbody>
                {proyecto.materiales.map((m) => (
                  <tr key={m.id} className="border-b border-border/60">
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => updateMaterial(proyecto.id, m.id, { recibido: !m.recibido })}
                        className={`w-5 h-5 rounded flex items-center justify-center border ${
                          m.recibido ? "bg-accent border-accent text-bg" : "border-border"
                        }`}
                      >
                        {m.recibido && <Check size={13} />}
                      </button>
                    </td>
                    <td className="py-2 pr-3">
                      {m.nombre}
                      {m.linkORef && (
                        <a
                          href={m.linkORef}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-xs text-accent2 truncate max-w-[180px]"
                        >
                          {m.linkORef}
                        </a>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-muted">{m.categoria}</td>
                    <td className="py-2 pr-3">
                      {m.cantidad} {m.unidad}
                    </td>
                    <td className="py-2 pr-3">${m.precioUnitario.toFixed(2)}</td>
                    <td className="py-2 pr-3 font-medium">
                      ${(m.cantidad * m.precioUnitario).toFixed(2)}
                    </td>
                    <td className="py-2 pr-3 text-muted">{m.proveedor}</td>
                    <td className="py-2 pr-3">
                      <button
                        onClick={() => removeMaterial(proyecto.id, m.id)}
                        className="text-muted hover:text-danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5} className="py-3 text-right font-medium">
                    Costo directo total (BOM):
                  </td>
                  <td className="py-3 font-semibold text-accent" colSpan={3}>
                    ${total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <form onSubmit={handleAdd} className="bg-panel border border-border rounded-xl p-4 grid gap-3 sm:grid-cols-6">
          <input
            className="sm:col-span-2 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Nombre del ítem"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <select
            className="bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value as MaterialItem["categoria"] })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            className="bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Cantidad"
            type="number"
            step="any"
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
          />
          <input
            className="bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Unidad"
            value={form.unidad}
            onChange={(e) => setForm({ ...form, unidad: e.target.value })}
          />
          <input
            className="bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Precio unitario"
            type="number"
            step="any"
            value={form.precioUnitario}
            onChange={(e) => setForm({ ...form, precioUnitario: e.target.value })}
          />
          <input
            className="sm:col-span-2 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Proveedor"
            value={form.proveedor}
            onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
          />
          <input
            className="sm:col-span-3 bg-panel2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Link o referencia (opcional)"
            value={form.linkORef}
            onChange={(e) => setForm({ ...form, linkORef: e.target.value })}
          />
          <button
            type="submit"
            className="sm:col-span-1 flex items-center justify-center gap-1 bg-accent text-bg rounded-lg py-2 text-sm font-medium hover:opacity-90"
          >
            <Plus size={16} /> Agregar
          </button>
        </form>
      </section>
    </div>
  );
}
