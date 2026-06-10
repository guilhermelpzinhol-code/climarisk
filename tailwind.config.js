/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#16A34A',
          dark: '#166534',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          600: '#16A34A',
          700: '#15803D',
        },
        ink: '#0F172A',
        'ink-hero': '#0B1B2E',
        body: '#475569',
        muted: '#94A3B8',
        soft: '#F8FAFC',
        lavender: '#EEF1F8',
        line: '#E2E8F0',
        risk: {
          critical: '#DC2626',
          high: '#EF4444',
          medium: '#F59E0B',
          low: '#16A34A',
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
