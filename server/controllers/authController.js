const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { validationResult } = require("express-validator");

const loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });

      res.json({
        _id: user._id,
        username: user.username,
      });
    } else {
      res.status(401).json({ message: "Username atau password salah" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const logoutAdmin = (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logout berhasil" });
};

const getMe = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: "User tidak ditemukan" });
  }
};

const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: config.ADMIN_USERNAME });
    if (!adminExists) {
      await User.create({
        username: config.ADMIN_USERNAME,
        password: config.ADMIN_PASSWORD,
      });
      console.log("Initial admin created via ENV");
    }
  } catch (error) {
    console.error("Error creating initial admin:", error);
  }
};

createInitialAdmin();

module.exports = { loginAdmin, logoutAdmin, getMe };
