/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        blue: {
          400: '#4267B2',
          500: '#4285F4'
        },
        cyan: {
          500: '#61DCFB'
        },
        green: {
          500: '#04D361'
        },
        yellow: {
          500: '#EBA417'
        },
        titles: {
          200: '#E1E1E6'
        },
        shape: {
          800: '#1F2729'
        },
        gray: {
          100: '#E1E1E6',
          300: '#A8A8B3',
          700: '#323238',
          800: '#29292E',
          900: '#121214'
        }
      }
    }
  },
  plugins: []
}
