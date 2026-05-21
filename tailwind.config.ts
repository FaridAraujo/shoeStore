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
      colors: {
        concrete: "#E8E6E1",
        surface: "#D4D0C8",
        border: "#B8B4AC",
        ink: "#0A0A0A",
        "dark-bg": "#111111",
        "dark-surface": "#1C1C1C",
        accent: "#F2BF1A",
      },
      fontFamily: {
        display: ["var(--font-bebas-neue)", "Bebas Neue", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.25em",
      },
    },
  },
  plugins: [],
};

export default config;
