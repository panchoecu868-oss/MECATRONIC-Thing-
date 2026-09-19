import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        panel: "#121821",
        panel2: "#1a2230",
        border: "#26313f",
        accent: "#3ddc97",
        accent2: "#4fb0ff",
        warn: "#ffb454",
        danger: "#ff6b6b",
        text: "#e6edf3",
        muted: "#8b98a5",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
