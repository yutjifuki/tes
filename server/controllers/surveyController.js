const Survey = require("../models/Survey");
const Respondent = require("../models/Respondent");
const Submission = require("../models/Submission");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");

const submitSurvey = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let cookieId = req.cookies.surveySubmitted;

  if (cookieId) {
    const existingCookieSubmission = await Submission.findOne({ cookieId });
    if (existingCookieSubmission) {
      return res.status(400).json({
        message:
          "Anda sudah mengisi survei hari ini. Terima kasih atas partisipasi Anda!",
      });
    }
  }

  const { respondentData, answers } = req.body;
  const activeQuestions = await Survey.find({ isActive: true });
  if (answers.length !== activeQuestions.length) {
    return res
      .status(400)
      .json({ message: "Harap isi semua pertanyaan survei." });
  }
  for (const ans of answers) {
    if (!ans.answer) {
      return res
        .status(400)
        .json({ message: `Pertanyaan "${ans.questionText}" belum diisi.` });
    }
  }

  try {
    let existingRespondent = await Respondent.findOne({
      name: { $regex: new RegExp("^" + respondentData.name + "$", "i") },
      gender: respondentData.gender,
      age: respondentData.age,
      visitFrequency: respondentData.visitFrequency,
    });

    if (!existingRespondent) {
      existingRespondent = new Respondent(respondentData);
      existingRespondent = await existingRespondent.save();
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingSubmission = await Submission.findOne({
      respondentId: existingRespondent._id,
      submittedAt: { $gte: startOfToday, $lte: endOfToday },
    });

    if (existingSubmission) {
      return res.status(400).json({
        message:
          "Anda sudah mengisi survei hari ini. Terima kasih atas partisipasi Anda!",
      });
    }

    if (!cookieId) {
      cookieId = uuidv4();
    }

    const newSubmission = new Submission({
      respondentId: existingRespondent._id,
      cookieId: cookieId,
      answers: answers.map((ans) => ({
        surveyId: ans.surveyId,
        questionText: ans.questionText,
        answer: ans.answer,
      })),
    });
    await newSubmission.save();

    res.cookie("surveySubmitted", cookieId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "Survei berhasil dikirim. Terima kasih atas partisipasi Anda!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error saat mengirim survei" });
  }
};

const checkSubmissionStatus = async (req, res) => {
  const cookieId = req.cookies.surveySubmitted;

  if (cookieId) {
    const existingSubmission = await Submission.findOne({ cookieId });
    if (existingSubmission) {
      return res.json({ hasSubmitted: true });
    }
  }

  res.json({ hasSubmitted: false });
};

const getOverallStatistics = async (req, res) => {
  try {
    const totalSubmissions = await Submission.countDocuments();
    if (totalSubmissions === 0) {
      return res.json({
        "Sangat Puas": "0%",
        Puas: "0%",
        "Kurang Puas": "0%",
        "Tidak Puas": "0%",
        totalRespondents: 0,
      });
    }

    const results = await Submission.aggregate([
      { $unwind: "$answers" },
      {
        $group: {
          _id: "$answers.answer",
          count: { $sum: 1 },
        },
      },
    ]);

    let totalAnswers = 0;
    const satisfactionCounts = {
      "Sangat Puas": 0,
      Puas: 0,
      "Kurang Puas": 0,
      "Tidak Puas": 0,
    };

    results.forEach((result) => {
      satisfactionCounts[result._id] = result.count;
      totalAnswers += result.count;
    });

    const questionsCount = await Survey.countDocuments({ isActive: true });
    const uniqueRespondents = totalAnswers / (questionsCount || 1);

    const satisfactionPercentages = {};
    for (const key in satisfactionCounts) {
      satisfactionPercentages[key] =
        totalAnswers > 0
          ? ((satisfactionCounts[key] / totalAnswers) * 100).toFixed(1) + "%"
          : "0%";
    }

    const totalUniqueRespondents = await Respondent.countDocuments();

    res.json({
      ...satisfactionPercentages,
      totalRespondents: totalUniqueRespondents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAdminDashboardStatistics = async (req, res) => {
  try {
    const totalRespondents = await Respondent.countDocuments();
    const totalSurveyQuestions = await Survey.countDocuments();

    const submissions = await Submission.find().populate("answers.surveyId");
    if (submissions.length === 0) {
      return res.json({
        totalRespondents,
        totalSurveyQuestions,
        satisfactionCounts: {
          "Sangat Puas": 0,
          Puas: 0,
          "Kurang Puas": 0,
          "Tidak Puas": 0,
        },
        satisfactionPercentages: {
          "Sangat Puas": 0,
          Puas: 0,
          "Kurang Puas": 0,
          "Tidak Puas": 0,
        },
        detailedResultsPerQuestion: [],
      });
    }

    const satisfactionCounts = {
      "Sangat Puas": 0,
      Puas: 0,
      "Kurang Puas": 0,
      "Tidak Puas": 0,
    };
    let totalAnswers = 0;

    submissions.forEach((submission) => {
      submission.answers.forEach((answer) => {
        if (satisfactionCounts.hasOwnProperty(answer.answer)) {
          satisfactionCounts[answer.answer]++;
        }
        totalAnswers++;
      });
    });

    const satisfactionPercentages = {};
    if (totalAnswers > 0) {
      for (const key in satisfactionCounts) {
        satisfactionPercentages[key] = parseFloat(
          ((satisfactionCounts[key] / totalAnswers) * 100).toFixed(1)
        );
      }
    } else {
      for (const key in satisfactionCounts) {
        satisfactionPercentages[key] = 0;
      }
    }

    res.json({
      totalRespondents,
      totalSurveyQuestions,
      satisfactionCounts,
      satisfactionPercentages,
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getResultsByQuestion = async (req, res) => {
  try {
    const allQuestions = await Survey.find({});
    const submissions = await Submission.find({});

    const results = [];

    for (const question of allQuestions) {
      const questionResult = {
        questionId: question._id,
        questionText: question.questionText,
        isActive: question.isActive,
        answers: {
          "Sangat Puas": 0,
          Puas: 0,
          "Kurang Puas": 0,
          "Tidak Puas": 0,
        },
        totalAnswersForThisQuestion: 0,
      };

      submissions.forEach((submission) => {
        submission.answers.forEach((answer) => {
          if (answer.surveyId.equals(question._id)) {
            if (questionResult.answers.hasOwnProperty(answer.answer)) {
              questionResult.answers[answer.answer]++;
              questionResult.totalAnswersForThisQuestion++;
            }
          }
        });
      });
      results.push(questionResult);
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching results by question:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  submitSurvey,
  checkSubmissionStatus,
  getOverallStatistics,
  getAdminDashboardStatistics,
  getResultsByQuestion,
};
