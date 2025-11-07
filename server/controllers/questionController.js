const Survey = require("../models/Survey");
const Submission = require("../models/Submission");
const { validationResult } = require("express-validator");

const createQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { questionText } = req.body;

  try {
    const questionExists = await Survey.findOne({ questionText });
    if (questionExists) {
      return res.status(400).json({ message: "Pertanyaan sudah ada" });
    }

    const survey = new Survey({ questionText });
    const createdSurvey = await survey.save();
    res.status(201).json(createdSurvey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Survey.find({ isActive: true });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Survey.findById(req.params.id);
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: "Pertanyaan tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateQuestion = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { questionText, isActive } = req.body;
  try {
    const question = await Survey.findById(req.params.id);
    if (question) {
      question.questionText = questionText || question.questionText;
      if (typeof isActive !== "undefined") {
        question.isActive = isActive;
      }
      const updatedQuestion = await question.save();
      res.json(updatedQuestion);
    } else {
      res.status(404).json({ message: "Pertanyaan tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Survey.findById(questionId);

    if (question) {
      await question.deleteOne();
      await Submission.updateMany(
        {},
        { $pull: { answers: { surveyId: questionId } } }
      );

      res.json({
        message: "Pertanyaan dan semua data jawaban terkait berhasil dihapus",
      });
    } else {
      res.status(404).json({ message: "Pertanyaan tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error deleting question and related submissions:", error);
    res.status(500).json({ message: "Server Error saat menghapus pertanyaan" });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
