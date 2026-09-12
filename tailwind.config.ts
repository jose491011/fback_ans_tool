import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B2430",
        paper: "#F7F5F0",
        muted: "#6B7280",
        line: "#D9D7D1",
        surface: "#F1EFEA",
        better: "#4A6B5A",
        expected: "#6B7A8F",
        worse: "#A65D4E",
        overdue: "#B85F50",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Noto Serif TC", "serif"],
        sans: ["var(--font-sans)", "Noto Sans TC", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
      },
      maxWidth: {
        content: "1050px",
        shell: "1360px",
      },
      transitionDuration: {
        DEFAULT: "180ms",
      },
    },
  },
  plugins: [],
};
export default config;
