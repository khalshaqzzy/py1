/** @type {import('tailwindcss').Config} */
const nativewind = require("nativewind/preset");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {},
  },
  plugins: [],
};