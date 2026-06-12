/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          500: '#22c55e', // corporate green
          700: '#15803d',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};