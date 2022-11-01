const colors = require('./open-color.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,js,ejs}"],
  theme: {
    extend: {
      colors
    },
  },
  plugins: [],
}
