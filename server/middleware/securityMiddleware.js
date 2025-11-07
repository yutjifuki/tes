const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

module.exports = function (app) {
  app.use(helmet());
  const cors = require("cors");
  const allowedOrigins = [];
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    const cleanedOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL.replace(
      /\/$/,
      ""
    );
    allowedOrigins.push(cleanedOrigin);
  }
  console.log("Allowed origins:", allowedOrigins);

  app.use(
    cors({
      origin: function (origin, callback) {
        const normalizedOrigin = origin?.replace(/\/$/, "");
        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
          callback(null, true);
        } else {
          console.log(`❌ Origin tidak diizinkan: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
  app.set("trust proxy", 1);
};
