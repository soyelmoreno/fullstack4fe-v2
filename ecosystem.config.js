require("dotenv").config();

if (!process.env.PM2_NAME) {
  console.error("⚠️ Missing PM2_NAME in .env");
  process.exit(1);
}
module.exports = {
  apps: [
    {
      name: process.env.PM2_NAME || "HelloApp",
      script: "app.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
