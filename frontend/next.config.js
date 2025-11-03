// next.config.js
const createNextIntlPlugin = require("next-intl/plugin");

// 👇 point here
const withNextIntl = require('next-intl/plugin')('./i18n');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
