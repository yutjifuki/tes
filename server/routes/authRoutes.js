const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  logoutAdmin,
  getMe,
} = require("../controllers/authController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { check } = require("express-validator");

router.post(
  "/login",
  [
    check("username", "Username tidak boleh kosong").not().isEmpty(),
    check("password", "Password tidak boleh kosong").exists(),
  ],
  loginAdmin
);
router.post("/logout", protectAdmin, logoutAdmin);
router.get("/me", protectAdmin, getMe);

module.exports = router;
