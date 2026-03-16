/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#FFF5E1',
        'temple-brown': '#3E2723',
        maroon: '#7B1E1E',
        'dark-maroon': '#5A3A1B',
        gold: '#D4AF37',
      },
      fontFamily: {
        tamil: ['Noto Sans Tamil', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
