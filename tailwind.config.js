module.exports = {
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["Bus", "sans-serif"],
    },
    extend: {
      gridTemplateColumns: {
        "stop-row": "2.25rem 5fr 1.125rem minmax(5.5rem, 1fr)",
      },
      inset: { 5.5: "1.375rem" },
      maxHeight: {
        "suggestions-container": "calc(100vh - 10rem)",
      },
    },
  },
  variants: {
    extend: {
      borderColor: ["dark"],
    },
    transitionProperty: ["hover", "focus"],
    borderWidth: ["focus-visible"],
    borderColor: ["focus-visible"],
    ringWidth: ["focus-visible"],
    ringColor: ["focus-visible"],
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
