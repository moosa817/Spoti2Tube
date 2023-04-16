/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./app/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'theme1': '#2A9D8F',
        'theme2': '#264653'
      },
      screens: {
        'xs': '400px',
      }
    },
    plugins: [],
  }
}