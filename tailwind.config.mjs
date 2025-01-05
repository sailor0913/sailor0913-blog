/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF7',
          100: '#FFF9E8',
          200: '#FFF3D1',
          300: '#FFEDB9',
          400: '#FFE7A2',
          500: '#FFE18A',
          600: '#F5D573',
          700: '#EBC95C',
          800: '#E1BD45',
          900: '#D7B12E',
        },
      },
    },
  },
  plugins: [],
}
