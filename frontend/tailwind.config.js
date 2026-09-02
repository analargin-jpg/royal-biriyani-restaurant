/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          crimson: '#990000',
          'crimson-dark': '#7A0000',
          'crimson-light': '#B30000',
          gold: '#D4AF37',
          'gold-light': '#F5E79D',
          'gold-dark': '#AA820A',
          charcoal: '#1A1A1A',
          cream: '#FFFDF9'
        }
      }
    },
  },
  plugins: [],
}
