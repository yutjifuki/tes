const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Respondent",
    required: true,
  },
  cookieId: {
    type: String,
    index: true,
  },
  answers: [
    {
      surveyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Survey",
        required: true,
      },
      questionText: { type: String, required: true },
      answer: {
        type: String,
        enum: ["Sangat Puas", "Puas", "Kurang Puas", "Tidak Puas"],
        required: true,
      },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", SubmissionSchema);
