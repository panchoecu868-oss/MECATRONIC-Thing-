import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050307",
        panel: "#120a10",
        panel2: "#1a0f16",
        border: "#3a1830",
        accent: "#1bf2dd",
        accent2: "#0fdbf2",
        warn: "#a6175a",
        danger: "#a6175a",
        text: "#eef0f4",
        muted: "#9a8a95",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
