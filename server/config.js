const path = require("path");
require("dotenv").config();

const rootDir = path.join(__dirname, "..");

module.exports = {
  port: Number(process.env.PORT) || 3000,
  rootDir,
  adminLogin: process.env.ADMIN_LOGIN || "admin",
  /** bcrypt-хэш пароля (по умолчанию: admin123) — задайте ADMIN_PASSWORD_HASH в .env для продакшена */
  adminPasswordHash:
    process.env.ADMIN_PASSWORD_HASH ||
    "$2b$10$IQAvxqKOL09cKlKmBZQkZOChl/3c39YSqrOd6d45u03Lw9/TQlAcS",
  sessionSecret: process.env.SESSION_SECRET || "portfolio-dev-secret-change-me",
  sessionName: "portfolio.sid",
  isProduction: process.env.NODE_ENV === "production",
};
