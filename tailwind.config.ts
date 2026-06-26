import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class' as const,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Apex Velocity — surfaces
        surface: {
          DEFAULT:  '#131313',
          dim:      '#131313',
          bright:   '#3a3939',
          lowest:   '#0e0e0e',
          low:      '#1c1b1b',
          base:     '#201f1f',
          high:     '#2a2a2a',
          highest:  '#353534',
        },
        // On-surface
        'on-surface':         '#e5e2e1',
        'on-surface-variant': '#e6bdb8',

        // Borders
        outline:         '#ac8884',
        'outline-variant': '#5c403c',

        // Brand — Apex Red
        primary: {
          DEFAULT:   '#dc2626',
          foreground: '#ffffff',
          muted:     'rgba(220,38,38,0.15)',
          glow:      'rgba(220,38,38,0.10)',
        },

        // Status
        success: {
          DEFAULT: '#22c55e',
          muted:   'rgba(34,197,94,0.12)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          muted:   'rgba(245,158,11,0.12)',
        },
        danger: {
          DEFAULT: '#ef4444',
          muted:   'rgba(239,68,68,0.12)',
        },

        // shadcn compat
        background:  '#0e0e0e',
        foreground:  '#e5e2e1',
        border:      '#2a2a2a',
        input:       '#201f1f',
        ring:        '#dc2626',
        muted: {
          DEFAULT:    '#201f1f',
          foreground: '#888888',
        },
        accent: {
          DEFAULT:    '#2a2a2a',
          foreground: '#e5e2e1',
        },
        destructive: {
          DEFAULT:    '#ef4444',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT:    '#1c1b1b',
          foreground: '#e5e2e1',
        },
        popover: {
          DEFAULT:    '#2a2a2a',
          foreground: '#e5e2e1',
        },
        secondary: {
          DEFAULT:    '#474746',
          foreground: '#e5e2e1',
        },
      },

      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },

      fontSize: {
        xs:   ['11px', { lineHeight: '16px', letterSpacing: '0.05em' }],
        sm:   ['13px', { lineHeight: '20px' }],
        base: ['14px', { lineHeight: '22px' }],
        md:   ['15px', { lineHeight: '24px' }],
        lg:   ['17px', { lineHeight: '26px' }],
        xl:   ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
        '3xl': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em' }],
        '4xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em' }],
      },

      borderRadius: {
        sm:      '2px',
        DEFAULT: '4px',
        md:      '6px',
        lg:      '8px',
        xl:      '12px',
        '2xl':   '16px',
        full:    '9999px',
      },

      spacing: {
        '4.5': '18px',
        '18':  '72px',
      },

      boxShadow: {
        'brand-sm': '0 0 0 1px rgba(220,38,38,0.3)',
        'brand':    '0 0 0 1px rgba(220,38,38,0.5), 0 0 20px rgba(220,38,38,0.08)',
        'elevated': '0 4px 24px rgba(0,0,0,0.5)',
        'modal':    '0 0 0 1px rgba(220,38,38,0.15), 0 24px 48px rgba(0,0,0,0.7)',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
      },

      animation: {
        'fade-in':  'fade-in 150ms ease',
        'fade-out': 'fade-out 150ms ease',
      },
    },
  },
  plugins: [],
}

export default config
