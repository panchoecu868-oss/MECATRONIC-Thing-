"use client";

export function ProgressBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "bg-accent" : pct >= 40 ? "bg-accent2" : "bg-warn";
  return (
    <div className="w-full h-2 bg-panel2 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
