const cookieConfig = require("../config/cookieConfig");

const cookieMiddleware = (req, res, next) => {
  const originalCookie = res.cookie;

  res.cookie = function (name, value, options) {
    const envConfig = cookieConfig.getCookieConfig();
    const mergedOptions = { ...envConfig, ...options };

    if (process.env.NODE_ENV !== "production") {
      console.log(`Setting cookie: ${name} with options:`, mergedOptions);
    }

    return originalCookie.call(this, name, value, mergedOptions);
  };

  next();
};

module.exports = cookieMiddleware;
