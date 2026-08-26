/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0d0a08',
          900: '#14100c',
          800: '#1c1611',
          700: '#28201a',
          600: '#3a2e23',
        },
        amber: {
          accent: '#e0a85a',
          glow: '#f0c078',
          deep: '#b8762e',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
      },
    },
  },
  plugins: [],
};
