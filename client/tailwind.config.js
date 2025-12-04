/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set Inter as the default font
      },
      colors: {
        primary: '#0F766E', // Teal-700
        accent: '#14B8A6',  // Teal-500
        bgLight: '#F3F4F6', // Gray-100
      }
    },
  },
  plugins: [],
}
