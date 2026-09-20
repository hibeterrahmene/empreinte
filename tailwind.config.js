/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Design system L'Empreinte — voir src/styles/index.css pour les variables
    extend: {
      colors: {
        ink: '#0A0A0B',
        paper: '#FFFFFF',
        cream: { DEFAULT: '#F8EDD6', deep: '#EFE0BF' },
        night: { DEFAULT: '#0B1629', soft: '#14233D' },
        mark: { DEFAULT: '#548EC1', deep: '#2C6AA0', pale: '#E6EFF8' },
        sun: '#FFDD36',
        clay: '#D2622D',
        stone: { 50: '#F6F5F2', 200: '#E4E1DA', 300: '#CFCBC1', 500: '#75716A', 700: '#4A4741' },
      },
      fontFamily: {
        // Neue Haas Grotesk Display Pro est une police sous licence : à auto-héberger.
        // En attendant, Inter Tight (métriques proches) prend le relais.
        display: ['"Neue Haas Grotesk Display Pro"', '"Neue Haas Grotesk Display"', '"Inter Tight"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        sans: ['Figtree', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '2px', sm: '1px', md: '3px', lg: '4px' },
      maxWidth: { page: '1360px', read: '680px', wide: '1040px' },
      letterSpacing: { tightest: '-0.04em', display: '-0.032em', nav: '0.14em' },
      transitionTimingFunction: { editorial: 'cubic-bezier(0.22, 0.61, 0.36, 1)' },
    },
  },
  plugins: [],
}
