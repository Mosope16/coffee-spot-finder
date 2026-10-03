import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        roast: {
          50: "#faf6f0",
          100: "#f3ebe0",
          200: "#e6d5bf",
          300: "#d6bc9a",
          400: "#c29d72",
          500: "#ad8151",
          600: "#946741",
          700: "#765036",
          800: "#2d1f15",
          900: "#1d140e",
          950: "#120c08"
        },
        caramel: {
          light: "#fef3c7",
          DEFAULT: "#d97706",
          dark: "#92400e"
        },
        sage: {
          light: "#d1fae5",
          DEFAULT: "#10b981",
          dark: "#065f46"
        }
      },
      boxShadow: {
        warm: "0 10px 30px -5px rgba(217, 119, 6, 0.25)",
        card: "0 12px 32px -8px rgba(0, 0, 0, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;
