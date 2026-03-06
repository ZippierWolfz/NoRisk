import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eaf2ff",
          100: "#dce9ff",
          200: "#bfd5ff",
          300: "#97bbff",
          400: "#6e9eff",
          500: "#4a7fff",
          600: "#2f63f2",
          700: "#1f4dd1",
          800: "#1b3ea8",
          900: "#1a3783",
        },
      },
      boxShadow: {
        card: "0 8px 30px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at 20% 20%, rgba(74, 127, 255, 0.15), transparent 45%), radial-gradient(circle at 80% 10%, rgba(47, 99, 242, 0.18), transparent 35%)",
      },
    },
  },
  plugins: [],
};

export default config;
