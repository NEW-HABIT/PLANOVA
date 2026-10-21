import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        planova: {
          50: "#FAFAFF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED", // Electric violet
          700: "#4338CA", // Deep indigo
          800: "#3730A3",
          900: "#1E1B4B",
          dark: "#17172A",
        },
        palette: {
          espresso: "#3E3239",
          wine: "#6B5560",
          roseplum: "#9E8189",
          sand: "#C7A9A3",
          champagne: "#E8D2C4",
          silk: "#F7EFE7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(62, 50, 57, 0.08)",
        glow: "0 0 25px -5px rgba(158, 129, 137, 0.35)",
        card: "0 4px 20px -2px rgba(62, 50, 57, 0.06), 0 2px 6px -1px rgba(62, 50, 57, 0.03)",
        luxury: "0 20px 40px -15px rgba(62, 50, 57, 0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "shimmer": "shimmer 3s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
