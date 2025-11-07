const mongoose = require("mongoose");

const RespondentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["Laki-laki", "Perempuan"], required: true },
    age: { type: Number, required: true },
    visitFrequency: {
      type: String,
      enum: ["Pertama kali", "Lebih dari satu kali", "Sering"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Respondent", RespondentSchema);
