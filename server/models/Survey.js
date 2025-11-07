const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Survey", SurveySchema);
