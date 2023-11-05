module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      zIndex: {
        1000: '1000',
        999999: '999999',
        999998: '999998',
      },
    },
  },
  // eslint-disable-next-line global-require
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
