/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0C10',
        card: '#15161C',
        card2: '#1E1F27',
        line: '#3A3B47',
        ink: '#F4F4F5',
        dim: '#E4E4E7',
        mute: '#B4B4BC',
        accent: '#4F7CFF',
        good: '#22C55E',
        warn: '#F59E0B',
        bad: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
