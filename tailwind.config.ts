import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        editorial: ["var(--font-serif)", "Instrument Serif", "Newsreader", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "SF Mono", "monospace"],
      },
      colors: {
        obsidian: {
          950: "#08090b",
          900: "#0e1014",
          850: "#13161c",
          800: "#1a1e26",
          700: "#272d38",
          600: "#3d4655",
        },
        parchment: {
          50: "#fcfbf9",
          100: "#f7f5f0",
          200: "#eeeae2",
          300: "#e0d9cd",
        },
        cobalt: {
          50: "#f0f4ff",
          100: "#e0ebff",
          400: "#6093ff",
          500: "#2e68ff",
          600: "#1855f4",
          700: "#0c3ed6",
        },
      },
      letterSpacing: {
        widest: ".2em",
        tighter: "-.04em",
      },
    },
  },
  plugins: [],
};

export default config;
