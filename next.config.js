const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  typescript: {
    tsconfigPath: "./tsconfig.github.json",
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    LOGIN_URL: process.env.LOGIN_URL,
  },
};

module.exports = withSentryConfig(nextConfig, {
  org: "bread-crumbs-00",
  project: "hychart",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  disableLogger: true,
  automaticVercelMonitors: true,
});
