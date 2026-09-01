/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts,js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: 'var(--color-black)',
        red: 'var(--color-red)',
        blue: 'var(--color-blue)',
        charcoal: 'var(--color-charcoal)',
        white: 'var(--color-white)',
        'dark-red': 'var(--color-dark-red)',
        'light-gray': 'var(--color-light-gray)',
      },
    },
  },
  plugins: [],
};
