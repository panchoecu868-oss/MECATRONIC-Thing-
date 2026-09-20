"use client";

import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [value, decimals, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}
