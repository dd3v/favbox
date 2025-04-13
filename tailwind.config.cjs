const forms = require('@tailwindcss/forms');
const typography = require('@tailwindcss/typography');

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        soft: {
          50: '#fbfbfb',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d1d1d1',
          400: '#b3b3b3',
          500: '#949494',
          600: '#767676',
          700: '#595959',
          800: '#3b3b3b',
          900: '#1f1f1f',
        },
      },
    },
  },
  plugins: [forms, typography],
};
