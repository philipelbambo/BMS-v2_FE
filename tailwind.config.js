/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f3ee',
          100: '#efe7dc',
          200: '#e0d0bc',
          300: '#ceb696',
          400: '#b99770',
          500: '#a87e53',
          600: '#8c6744',
          700: '#734f38',
          800: '#5f4130',
          900: '#4e372b',
          950: '#2c1e17',
        },
        secondary: {
          50: '#fcfbe8',
          100: '#f9f6c5',
          200: '#f5eb8e',
          300: '#f1da4d',
          400: '#ecc71e',
          500: '#dcae13',
          600: '#be870e',
          700: '#986010',
          800: '#7c4d14',
          900: '#674016',
          950: '#3b2109',
        },
        accent: {
          red: '#e53e3e',
          blue: '#3182ce',
          green: '#38a169',
          yellow: '#f6ad55',
          teal: '#38b2ac',
          purple: '#805ad5',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};