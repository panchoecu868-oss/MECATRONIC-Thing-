"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { STAGE_ORDER } from "@/lib/types";
import { STAGES_META } from "@/lib/stages-meta";
import { progresoTotal, costoDirectoBOM, calcularPrecio } from "@/lib/calc";
import { ProgressRing } from "@/components/ProgressRing";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Design3DViewer } from "@/components/Design3DViewer";
import { hablar, vozDisponible } from "@/lib/voz";
import {
  ArrowLeft,
  Printer,
  Cpu,
  Clock,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Volume2,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ReportePage() {
  const params = useParams<{ id: string }>();
  const proyectos = useStore((s) => s.proyectos);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const proyecto = proyectos.find((p) => p.id === params.id);

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

  const pct = progresoTotal(proyecto);
  const costoDirecto = costoDirectoBOM(proyecto.materiales);
  const desglose = calcularPrecio(proyecto.materiales, proyecto.precioConfig);
  const horasTotales = proyecto.bitacora.reduce((a, b) => a + b.horasInvertidas, 0);
  const problemasResueltos = proyecto.troubleshooting.filter((t) => t.resuelto).length;
  const kpi = proyecto.stages.idea.fields["kpi"];
  const postmortem = proyecto.stages.final.fields["postmortem"];
  const mantenimiento = proyecto.stages.final.fields["mantenimiento"];
  const pasos = proyecto.pasosArmado || [];
  const totalMaterialesCosto = costoDirecto;

  const escucharResumen = () => {
    const texto = `Reporte de ${proyecto.nombre}. Área: ${proyecto.areaMecatronica}. Progreso: ${pct} por ciento. ${
      kpi ? `Objetivo: ${kpi}.` : ""
    } Costo directo: ${costoDirecto.toFixed(0)} dólares. Precio final: ${desglose.precioFinal.toFixed(
      0
    )} dólares.`;
    hablar(texto);
  };

  return (
    <div className="min-h-screen bg-bg report-page">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 no-print">
          <Link
            href={`/proyecto/${proyecto.id}`}
            className="inline-flex items-center gap-2 text-muted hover:text-text text-sm"
          >
            <ArrowLeft size={16} /> Volver al proyecto
          </Link>
          <div className="flex items-center gap-2">
            {vozDisponible() && (
              <button
                onClick={escucharResumen}
                className="flex items-center gap-2 border border-border text-muted hover:text-text hover:border-accent2/50 px-3 py-2 rounded-lg transition text-sm"
              >
                <Volume2 size={15} /> Escuchar resumen
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-accent text-bg font-medium px-4 py-2 rounded-lg hover:opacity-90 transition text-sm"
            >
              <Printer size={16} /> Exportar / Imprimir PDF
            </button>
          </div>
        </div>

        {/* Hero */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-panel to-accent2/10 p-8 mb-8 report-hero"
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative flex flex-col sm:flex-row items-center gap-8">
            <ProgressRing pct={pct} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-accent2 text-xs font-mono mb-2">
                <Cpu size={14} /> {proyecto.areaMecatronica}
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
                {proyecto.nombre}
              </h1>
              {proyecto.descripcionCorta && (
                <p className="text-sm text-muted max-w-xl">{proyecto.descripcionCorta}</p>
              )}
              {kpi && (
                <p className="text-sm text-accent mt-3 font-mono">🎯 {kpi}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          <StatCard icon={<Wallet size={18} />} label="Costo directo" value={costoDirecto} prefix="$" />
          <StatCard icon={<Wallet size={18} />} label="Precio final" value={desglose.precioFinal} prefix="$" accent />
          <StatCard icon={<Clock size={18} />} label="Horas invertidas" value={horasTotales} suffix="h" />
          <StatCard
            icon={<CheckCircle2 size={18} />}
            label="Problemas resueltos"
            value={problemasResueltos}
            suffix={`/${proyecto.troubleshooting.length}`}
          />
        </motion.div>

        {/* Vista 3D */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-8 no-print"
        >
          <SectionTitle>Vista del producto</SectionTitle>
          <div className="rounded-xl overflow-hidden border border-border" style={{ height: 340 }}>
            <Design3DViewer proyecto={proyecto} />
          </div>
        </motion.section>

        {/* Materiales */}
        {proyecto.materiales.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <SectionTitle>Materiales (BOM)</SectionTitle>
            <div className="space-y-2">
              {proyecto.materiales.map((m) => {
                const subtotal = m.cantidad * m.precioUnitario;
                const porcentaje = totalMaterialesCosto > 0 ? (subtotal / totalMaterialesCosto) * 100 : 0;
                return (
                  <div key={m.id} className="bg-panel border border-border rounded-lg p-3">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>{m.nombre}</span>
                      <span className="font-mono text-muted">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-panel2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${porcentaje}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-accent to-accent2"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Guía de armado */}
        {pasos.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <SectionTitle>Guía de armado</SectionTitle>
            <div className="space-y-4">
              {pasos.map((paso, i) => (
                <div key={paso.id} className="bg-panel border border-border rounded-lg p-4 flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm flex items-center justify-center shrink-0 font-mono">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm mb-2">{paso.texto}</p>
                    {paso.foto && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={paso.foto}
                        alt={`Paso ${i + 1}`}
                        className="max-h-52 rounded-lg border border-border"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Timeline bitácora */}
        {proyecto.bitacora.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <SectionTitle>Bitácora</SectionTitle>
            <div className="relative pl-6 space-y-4 border-l border-border">
              {proyecto.bitacora
                .slice()
                .reverse()
                .map((b) => (
                  <div key={b.id} className="relative">
                    <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-accent2 border-2 border-bg" />
                    <span className="text-xs text-accent2 font-mono">{b.fecha}</span>
                    <p className="font-medium text-sm">{b.titulo}</p>
                    {b.detalle && <p className="text-sm text-muted">{b.detalle}</p>}
                  </div>
                ))}
            </div>
          </motion.section>
        )}

        {/* Troubleshooting sin resolver */}
        {proyecto.troubleshooting.some((t) => !t.resuelto) && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <SectionTitle>
              <span className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-warn" /> Problemas sin resolver
              </span>
            </SectionTitle>
            <div className="space-y-2">
              {proyecto.troubleshooting
                .filter((t) => !t.resuelto)
                .map((t) => (
                  <div key={t.id} className="bg-panel border border-warn/30 rounded-lg p-3 text-sm">
                    {t.problema}
                  </div>
                ))}
            </div>
          </motion.section>
        )}

        {/* Post-mortem / mantenimiento */}
        {(postmortem || mantenimiento) && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-8"
          >
            <SectionTitle>Cierre del proyecto</SectionTitle>
            {mantenimiento && (
              <div className="bg-panel border border-border rounded-lg p-4 text-sm mb-3">
                <p className="text-xs text-accent2 font-mono mb-1">Mantenimiento</p>
                {mantenimiento}
              </div>
            )}
            {postmortem && (
              <div className="bg-panel border border-border rounded-lg p-4 text-sm">
                <p className="text-xs text-accent2 font-mono mb-1">Post-mortem</p>
                {postmortem}
              </div>
            )}
          </motion.section>
        )}

        <p className="text-center text-xs text-muted mt-12 mb-4">
          Generado con MECATRONIC Thing — {new Date(proyecto.fechaActualizacion).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mb-4 text-text">{children}</h2>;
}

function StatCard({
  icon,
  label,
  value,
  prefix,
  suffix,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-xl border p-4 ${
        accent ? "border-accent/40 bg-accent/10" : "border-border bg-panel"
      }`}
    >
      <div className={`flex items-center gap-1.5 text-xs mb-2 ${accent ? "text-accent" : "text-muted"}`}>
        {icon} {label}
      </div>
      <div className="text-xl font-semibold font-mono">
        <AnimatedNumber value={value} decimals={value % 1 !== 0 ? 2 : 0} prefix={prefix} suffix={suffix} />
      </div>
    </motion.div>
  );
}
