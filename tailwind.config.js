const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./pages/**/*.js", "./components/**/*.js"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ["Bus", "sans-serif"],
    },
    screens: {
      "2xs": "400px",
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      gridTemplateColumns: {
        "stop-row": "2.25rem 5fr 1.125rem minmax(5.5rem, 1fr)",
      },
      inset: { 5.5: "1.375rem" },
      maxHeight: {
        "suggestions-container": "calc(100vh - 9rem)",
      },
    },
  },
  variants: {
    extend: {
      borderColor: ["dark"],
      opacity: ["group-focus"],
    },
    transitionProperty: ["hover", "focus"],
    borderWidth: ["focus-visible"],
    borderColor: ["focus-visible"],
    ringWidth: ["focus-visible"],
    ringColor: ["focus-visible"],
    ringWidth: ["focus-visible"],
    ringColor: ["focus-visible"],
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
