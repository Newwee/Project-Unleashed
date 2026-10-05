/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0c0712',
          surface: '#150d1e',
          'surface-hover': '#1e132c',
          border: 'rgba(255, 100, 200, 0.15)',
          primary: '#e85d9e',
          secondary: '#a855f7',
          accent: '#c084fc',
          cyan: '#38bdf8',
          text: '#f3e8ff',
          muted: '#9ca3af',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 15px rgba(232, 93, 158, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 35px rgba(168, 85, 247, 0.7))' },
        }
      }
    },
  },
  plugins: [],
}
