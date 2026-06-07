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
        // Saffron / gold — primary warm accent
        saffron: {
          400: "#f0b860",
          500: "#e3a13d",
          600: "#c9842a",
        },
        // Ember / chilli — secondary accent
        ember: {
          400: "#e0654a",
          500: "#c1352b",
          600: "#9e271f",
        },
        // Jade — subtle tertiary (the Chinese thread)
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
          "radial-gradient(circle at 50% 0%, rgba(227,161,61,0.12), transparent 60%)",
        "ember-grain":
          "radial-gradient(circle at 20% 30%, rgba(193,53,43,0.10), transparent 45%), radial-gradient(circle at 80% 70%, rgba(227,161,61,0.10), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
