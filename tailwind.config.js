export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: '#6C63FF', // color base SmartCart
        secondary: '#FFD166',
      },
    },
  },
  plugins: [],
}
