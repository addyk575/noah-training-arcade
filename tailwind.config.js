/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B1A',
        surface1: '#151A2E',
        surface2: '#1E2545',
        surface3: '#2A3360',
        line: '#2D3560',
        ink: '#F5F3FF',
        dim: '#9B9BC7',
        mute: '#6B6B95',
        xp: '#FFD93D',
        hp: '#FF4785',
        mana: '#4DD4FF',
        legendary: '#A855F7',
        win: '#10F8A0',
        bronze: '#D4894F',
        silver: '#C0C8E0',
        gold: '#FFD93D',
        dayA: '#4DD4FF',
        dayB: '#10F8A0',
        dayC: '#FF9A3C',
        dayD: '#A855F7',
      },
      fontFamily: {
        display: ['"Archivo Black"', 'Archivo', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        pixel: '4px 4px 0 rgba(168,85,247,0.25)',
        pixelXp: '4px 4px 0 rgba(255,217,61,0.25)',
        pixelHp: '4px 4px 0 rgba(255,71,133,0.25)',
        pixelMana: '4px 4px 0 rgba(77,212,255,0.25)',
        glowXp: '0 0 20px rgba(255,217,61,0.5), inset 0 0 20px rgba(255,217,61,0.08)',
        glowHp: '0 0 20px rgba(255,71,133,0.5), inset 0 0 20px rgba(255,71,133,0.08)',
        glowMana: '0 0 20px rgba(77,212,255,0.5), inset 0 0 20px rgba(77,212,255,0.08)',
        glowLegendary: '0 0 20px rgba(168,85,247,0.5), inset 0 0 20px rgba(168,85,247,0.08)',
      },
      keyframes: {
        flame: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        blinkCursor: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(1px)' },
        },
      },
      animation: {
        flame: 'flame 2s ease-in-out infinite',
        blink: 'blinkCursor 1s steps(1) infinite',
      },
    },
  },
  plugins: [],
};
