/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00E575',
        'primary-hover': '#00cc66',
        canvas: '#090a0c',
        surface: {
          1: '#121418',
          2: '#181c22',
          3: '#21262e',
          hover: '#1c2028',
        },
        background: {
          dark: '#090a0c',
          light: '#090a0c',
        },
        card: '#121418',
        input: '#15181e',
        'sidebar-border': 'rgba(255, 255, 255, 0.08)',
        muted: '#9CA3AF',
        secondary: '#D1D5DB',
        brand: {
          DEFAULT: '#00E575',
          hover: '#00cc66',
          tint: 'rgba(0, 229, 117, 0.1)',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.08)',
        subtle: 'rgba(255, 255, 255, 0.06)',
        strong: 'rgba(255, 255, 255, 0.16)',
      },
    },
  },
  plugins: [],
};
