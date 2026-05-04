import type { Config } from "tailwindcss";
import tdsPlugin from "@tatum-io/tatum-design-system/tailwind-plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tatum-io/tatum-design-system/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          bg: "#040815",
          panel: "#0A1024",
          panelSoft: "#111936",
          accent: "#5B4CFF",
          accentSecondary: "#2D7CFF",
          accentSoft: "#171F3F",
        },
      },
      boxShadow: {
        "neon-blue": "0 0 28px rgba(91, 76, 255, 0.4)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [tdsPlugin],
};

export default config;

