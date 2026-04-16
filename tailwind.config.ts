import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: "#020617",
          panel: "#020617",
          panelSoft: "#020817",
          accent: "#38bdf8",
          accentSoft: "#0f172a",
        },
      },
      boxShadow: {
        "neon-blue": "0 0 25px rgba(56, 189, 248, 0.45)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;

