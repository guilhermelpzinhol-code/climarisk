/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          50: '#0E2A1C',
          100: '#123524',
          200: '#86EFAC',
          600: '#22C55E',
          700: '#16A34A',
        },
        ink: '#ECFDF5',
        'ink-hero': '#06100C',
        body: '#9FB0AA',
        muted: '#64776F',
        base: '#070D0B',
        surface: '#0E1714',
        soft: '#141F1A',
        lavender: '#141F1A',
        line: '#1E2C26',
        risk: {
          critical: '#F87171',
          high: '#FB7185',
          medium: '#FBBF24',
          low: '#34D399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
        soft: '0 4px 16px rgba(16, 24, 40, 0.06)',
        lift: '0 12px 32px rgba(16, 24, 40, 0.10)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
      },
    },
  },
  plugins: [],
};
