import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07070f",
        panel: "#0e0e1e",
        panel2: "#161629",
        border: "#2c2c52",
        accent: "#3b82f6",
        accent2: "#a855f7",
        warn: "#f87171",
        danger: "#dc2626",
        text: "#eef0fa",
        muted: "#9d97b8",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
