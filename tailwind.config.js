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
      keyframes: {
        pop: { '0%': { transform: 'scale(0.85)', opacity: '0' }, '60%': { transform: 'scale(1.04)', opacity: '1' }, '100%': { transform: 'scale(1)' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: {
        pop: 'pop 300ms ease-out',
        'slide-up': 'slideUp 250ms ease-out',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
