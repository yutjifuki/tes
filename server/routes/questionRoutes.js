const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");
const { protectAdmin } = require("../middleware/authMiddleware");
const { check } = require("express-validator");

router
  .route("/")
  .post(
    protectAdmin,
    [
      check("questionText", "Teks pertanyaan tidak boleh kosong")
        .not()
        .isEmpty(),
    ],
    createQuestion
  )
  .get(getQuestions);

router
  .route("/:id")
  .get(protectAdmin, getQuestionById)
  .put(
    protectAdmin,
    [
      check("questionText", "Teks pertanyaan tidak boleh kosong")
        .optional()
        .not()
        .isEmpty(),
    ],
    updateQuestion
  )
  .delete(protectAdmin, deleteQuestion);

module.exports = router;
