/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans:['Montserrat', 'Oswald', 'sans-serif'],
    },
    colors:{
      'white':'#FFFFFF',
      'primary':'#12CFD9',
      'secondary':'#271276',
      'dark': '#070111',
      'error': '#FF0000'
    },
  },
  plugins: [],
}