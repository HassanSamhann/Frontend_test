/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        wide: '1213px',  // Custom breakpoint for ReviewPanel 2-col layout
        xl:   '1440px',  // Toggle button + side-by-side mode threshold
      },
      fontFamily: {
        sans: ['Gilroy', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4E2FD2',   // Figma exact: #4E2FD2
          700: '#3D22B0',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted:   '#F8FAFC',
          subtle:  '#F1F5F9',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong:  '#CBD5E1',
        },
        price: {
          compare: '#D8392B',  // Figma strikethrough price color
          sale:    '#575757',  // Figma sale price color
        },
      },
      borderRadius: {
        'card':      '12px',
        'accordion': '16px',
        'badge':     '10px',
      },
      boxShadow: {
        'card':          '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'card-hover':    '0 4px 12px 0 rgba(78,47,210,0.12), 0 1px 3px 0 rgba(0,0,0,0.08)',
        'card-selected': '0 0 0 2px rgba(78,47,210,0.70)',  // #4E2FD2B2
        'panel':         '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
