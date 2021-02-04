module.exports = {
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["Bus", "sans-serif"],
    },
    extend: {
      gridTemplateColumns: {
        "stop-row": "2.25rem 5fr 1rem minmax(4.5rem, 1fr)",
      },
      maxHeight: {
        "suggestions-container": "calc(100vh - 10rem)",
      },
    },
  },
  variants: {
    extend: {},
    transitionProperty: ["hover", "focus"],
    borderWidth: ["focus-visible"],
    borderColor: ["focus-visible"],
  },
  plugins: [],
};
