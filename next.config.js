const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");
runtimeCaching[0].handler = "StaleWhileRevalidate";

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: false,
    skipWaiting: false,
    runtimeCaching,
    disable: process.env.NODE_ENV === "development",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["@svgr/webpack"],
    });

    return config;
  },
});
