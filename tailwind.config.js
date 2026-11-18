/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#2A1633", soft: "#5B4A63", faint: "#8B7D92" },
        berry: { 50: "#FBF1F5", 100: "#F6DEE8", 200: "#EDBBD0", 300: "#E08DB0", 400: "#CF5E8E", 500: "#B83A71", 600: "#9A2B5C", 700: "#7C2249", 800: "#5E1A38", 900: "#42122A" },
        sage: { 50: "#F1F6F2", 100: "#DCE9DF", 500: "#5F8A6C", 700: "#3F6450" },
        paper: "#FCF9FB",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
