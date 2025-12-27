import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cork: "hsl(var(--cork))",
        "cork-light": "hsl(var(--cork-light))",
        paper: "hsl(var(--paper))",
        "paper-aged": "hsl(var(--paper-aged))",
        "string-red": "hsl(var(--string-red))",
        "string-glow": "hsl(var(--string-glow))",
        ink: "hsl(var(--ink))",
        "marker-red": "hsl(var(--marker-red))",
        "sticky-yellow": "hsl(var(--sticky-yellow))",
        "sanity-green": "hsl(var(--sanity-green))",
        "sanity-red": "hsl(var(--sanity-red))",
      },
      fontFamily: {
        marker: ["Permanent Marker", "cursive"],
        typewriter: ["Special Elite", "Courier Prime", "monospace"],
        mono: ["Courier Prime", "Courier New", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--string-red) / 0.4)" },
          "50%": { boxShadow: "0 0 20px 10px hsl(var(--string-red) / 0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-4px) rotate(0.5deg)" },
        },
        "snap-in": {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "50%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "settle": {
          "0%": { transform: "translateY(-8px) scale(1.05)" },
          "60%": { transform: "translateY(2px) scale(0.98)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { filter: "drop-shadow(0 0 2px currentColor)" },
          "50%": { filter: "drop-shadow(0 0 12px currentColor) drop-shadow(0 0 20px currentColor)" },
        },
        "string-tension": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.5s ease-in-out",
        "pulse-glow": "pulse-glow 0.6s ease-out",
        flicker: "flicker 0.1s ease-in-out infinite",
        "float-gentle": "float-gentle 4s ease-in-out infinite",
        "snap-in": "snap-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "settle": "settle 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "string-tension": "string-tension 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
