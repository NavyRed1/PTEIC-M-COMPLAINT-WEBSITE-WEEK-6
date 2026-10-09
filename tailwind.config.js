/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ethereal: {
          50: '#f7f8fc',
          100: '#eef0f9',
          200: '#dde1f2',
          300: '#c2c9e6',
          400: '#9ca7d4',
          500: '#7984bd',
          600: '#5c66a0',
          700: '#4a5282',
          800: '#3d4369',
          900: '#272b42',
          950: '#171929',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -15px rgba(39, 43, 66, 0.25)',
        glow: '0 0 0 1px rgba(124,132,189,0.15), 0 8px 30px -10px rgba(124,132,189,0.35)',
      },
      backgroundImage: {
        'ethereal-light':
          'radial-gradient(circle at 20% -10%, #eef0f9 0%, #f7f8fc 45%, #ffffff 100%)',
        'ethereal-dark':
          'radial-gradient(circle at 20% -10%, #272b42 0%, #171929 45%, #0d0e18 100%)',
      },
    },
  },
  plugins: [],
}
