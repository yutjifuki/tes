const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");

const protectAdmin = async (req, res, next) => {
  let token;
  if (req.cookies.adminToken) {
    try {
      token = req.cookies.adminToken;
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({
          message: "Tidak terotorisasi, token gagal (user tidak ditemukan)",
        });
      }
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json({ message: "Tidak terotorisasi, token gagal" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Tidak terotorisasi, tidak ada token" });
  }
};

module.exports = { protectAdmin };
