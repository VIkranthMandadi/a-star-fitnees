/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./<custom directory>/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      primary: "#181F1C",
      secondary: "#274029",
      tertiary: "#315C2B",
      bg: "#fff",
      font1: "#fff",
      font2: "#9EA93F",
    },
    extend: {},
  },
  plugins: [],
};
