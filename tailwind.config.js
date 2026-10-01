/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C10',
        card: '#15161C',
        card2: '#1E1F27',
        line: '#2A2B35',
        ink: '#F4F4F5',
        dim: '#A1A1AA',
        mute: '#71717A',
        accent: '#4F7CFF',
        good: '#22C55E',
        warn: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
