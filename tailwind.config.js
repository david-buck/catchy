module.exports = {
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["Bus", "sans-serif"],
    },
    extend: {},
  },
  variants: {
    extend: {},
    transitionProperty: ["hover", "focus"],
  },
  plugins: [],
};
