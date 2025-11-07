const cookieConfig = {
  development: {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
  production: {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  },
  getCookieConfig: function (env = process.env.NODE_ENV) {
    return this[env === "production" ? "production" : "development"];
  },
};

module.exports = cookieConfig;
