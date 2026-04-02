/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e9c400',
          container: '#554600',
        },
        secondary: {
          DEFAULT: '#dfb7ff',
          container: '#6c11af',
        },
        tertiary: {
          DEFAULT: '#00e471',
          container: '#00552a',
        },
        surface: {
          DEFAULT: '#111125',
          low: '#1a1a2e',
          lowest: '#0c0c1f',
          highest: '#1d1d3d',
        },
        'on-surface': '#ffffff',
        'on-primary': '#000000',
      },
      fontFamily: {
        headline: ['Lilita One', 'sans-serif'],
        body: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.5rem',
        md: '0.75rem',
      },
      boxShadow: {
        'chunky': '0 4px 0 0 rgba(0, 0, 0, 0.3)',
        'chunky-primary': '0 4px 0 0 #554600',
        'chunky-secondary': '0 4px 0 0 #4b007e',
        'chunky-tertiary': '0 4px 0 0 #00552a',
      }
    },
  },
  plugins: [],
}
