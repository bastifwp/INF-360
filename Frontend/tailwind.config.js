/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#114F80",
        secondary: "#F26052",
        lightgrey: "#bdbbb3",
        light:"#ebebeb"
      }
    },
  },
  plugins: [],
}
