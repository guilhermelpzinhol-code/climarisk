/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: '#86EFAC',
          600: '#22C55E',
          700: '#16A34A',
        },
        ink: 'var(--ink)',
        'ink-hero': '#06100C',
        body: 'var(--body)',
        muted: 'var(--muted)',
        base: 'var(--base)',
        surface: 'var(--surface)',
        soft: 'var(--soft)',
        lavender: 'var(--lavender)',
        line: 'var(--line)',
        risk: {
          critical: '#F87171',
          high: '#FB7185',
          medium: '#FBBF24',
          low: '#34D399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        // "mono" agora aponta para Inter — visual sofisticado, sem aparência de terminal.
        mono: ['Inter', 'system-ui', 'sans-serif'],
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
