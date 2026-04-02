import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8ec',
          100: '#fdecc5',
          200: '#f8d37f',
          300: '#e8b040',
          400: '#d4900a',
          500: '#b87a08',
          600: '#9a6800',
          700: '#7b5405',
          800: '#624407',
          900: '#51390c'
        },
        ink: '#18181B',
        cream: '#F9F5EE'
      },
      boxShadow: {
        soft: '0 10px 35px rgba(24,24,27,0.08)'
      }
    },
  },
  plugins: [],
};
export default config;
