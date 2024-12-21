/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat-Regular'],
      // You can still access specific variants
        'montserrat-medium': ['Montserrat-Medium'],
        'montserrat-bold': ['Montserrat-Bold'],
      },
    },
  },
  plugins: [],
}