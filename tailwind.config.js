/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        secondary: '#2C3E50',
        accent: '#00D4FF',
        success: '#00E676',
        danger: '#FF5252',
      }
    },
  },
  plugins: [],
}