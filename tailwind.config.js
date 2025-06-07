/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {},
    screens: {
      xs500: '500px', // added custom breakpoint for extra small screens
      sm: '640px',
      md: '768px',
      ms: '840px', // added custom breakpoint for medium-small screens
      lg: '1080px', // changed from default 1024px to 1080px
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
  darkMode: 'class',
}

