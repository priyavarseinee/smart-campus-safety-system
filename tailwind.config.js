/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#070814",
        cardBg: "#0e1126",
        cardBorder: "#1e2447",
        brandPurple: "#7c3aed",
        brandBlue: "#3b82f6",
        brandCyan: "#06b6d4"
      }
    },
  },
  plugins: [],
}
