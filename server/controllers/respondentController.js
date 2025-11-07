const Respondent = require("../models/Respondent");
const Submission = require("../models/Submission");

const getAllRespondents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  try {
    const respondents = await Respondent.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalRespondents = await Respondent.countDocuments();

    res.json({
      respondents,
      currentPage: page,
      totalPages: Math.ceil(totalRespondents / limit),
      totalRespondents,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getRespondentById = async (req, res) => {
  try {
    const respondent = await Respondent.findById(req.params.id);
    if (!respondent) {
      return res.status(404).json({ message: "Responden tidak ditemukan" });
    }
    const submissions = await Submission.findOne({
      respondentId: req.params.id,
    }).populate("answers.surveyId", "questionText");
    res.json({ respondent, submissions });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const resetAllRespondentData = async (req, res) => {
  try {
    const respondentDeleteResult = await Respondent.deleteMany({});
    console.log("Respondents deletion result:", respondentDeleteResult);

    const submissionDeleteResult = await Submission.deleteMany({});
    console.log("Submissions deletion result:", submissionDeleteResult);

    res.json({
      message: `Semua data responden (${respondentDeleteResult.deletedCount} data) dan semua data survei yang diisi berhasil direset.`,
      deletedRespondents: respondentDeleteResult.deletedCount,
      deletedSubmissions: submissionDeleteResult.deletedCount,
    });
  } catch (error) {
    console.error("Error resetting all respondent data:", error);
    res
      .status(500)
      .json({ message: "Server Error saat mereset data responden." });
  }
};

module.exports = {
  getAllRespondents,
  getRespondentById,
  resetAllRespondentData,
};
