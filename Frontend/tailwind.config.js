/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#114F80",
        secondary: "#F26052",
        lightgrey: "#F3F4F6",
        mediumgrey: "#999999",
        mediumdarkgrey: "#555555",
        light:"#FCFCFC"
      }
    },
  },
  plugins: [],
}
