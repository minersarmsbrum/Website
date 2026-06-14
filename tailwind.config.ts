import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Dark luxury base
        ink: {
          900: "#0a0908", // near-black, page base
          800: "#100d0b",
          700: "#171310",
          600: "#211a15",
        },
        // Warm cream text
        cream: {
          50: "#fbf7f0",
          100: "#f4ece0",
          200: "#e8dcc9",
          300: "#d9c8ad",
        },
        // Antique gold — primary accent (matches logo circular border)
        saffron: {
          400: "#D4B450",
          500: "#C9A227",
          600: "#A8811A",
        },
        // Maroon red — secondary accent (matches logo MINERS ARMS text)
        ember: {
          400: "#C93232",
          500: "#9E1A1A",
          600: "#7A1111",
        },
        // Jade — semantic green (veg badges / confirmed bookings)
        jade: {
          400: "#5fae93",
          500: "#2f7d63",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
      },
      maxWidth: {
        content: "1280px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(3deg)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        float: "float 7s ease-in-out infinite",
        "spin-slow": "spin-slow 40s linear infinite",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards",
      },
      backgroundImage: {
        "radial-warm":
          "radial-gradient(circle at 50% 0%, rgba(201,162,39,0.12), transparent 60%)",
        "ember-grain":
          "radial-gradient(circle at 20% 30%, rgba(158,26,26,0.10), transparent 45%), radial-gradient(circle at 80% 70%, rgba(201,162,39,0.10), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
