const express = require("express");
const router = express.Router();
const {
  getAllRespondents,
  getRespondentById,
  resetAllRespondentData,
} = require("../controllers/respondentController");
const { protectAdmin } = require("../middleware/authMiddleware");

router.route("/").get(protectAdmin, getAllRespondents);
router.delete("/reset-all-data", protectAdmin, resetAllRespondentData);
router.route("/:id").get(protectAdmin, getRespondentById);

module.exports = router;
