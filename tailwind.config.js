/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Beauty Bees Baby-Pink Palette ──────────────────────────────
      // Maps 1-to-1 with the CSS variables in app/globals.css
      colors: {
        // ─── Beauty Bees Baby-Pink Palette ──────────────────────────────
        'bb-bg':         '#FFF5F7',   // --bg-color
        'bb-text':       '#5D454A',   // --text-color
        'bb-pink':       '#FFB7C5',   // --primary-pink
        'bb-pink-hover': '#F8A3B5',   // --primary-pink-hover
        'bb-peach':      '#FFF0F3',   // --accent-peach
        'bb-border':     '#FFD1DC',   // --border-light
        'bb-heading':    '#382A2D',   // heading color (h1-h6)
        'bb-white':      '#ffffff',

        // ─── Shadcn UI Colors ───────────────────────────────────────────
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      fontFamily: {
        sans: ['var(--font-main)', 'sans-serif'],
        heading: ['var(--font-heading)', 'serif'],
      },
      // ─── Animation Utilities ────────────────────────────────────────
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.02)' },
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.6s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-in-right':'slideInRight 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'pulse-gentle':  'pulse 2s ease-in-out infinite',
      },
      // ─── Shadcn UI Compatibility ─────────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
