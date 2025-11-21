const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    tokenCode: {
      type: String,
      required: true,
      unique: true,
      length: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Respondent",
      default: null,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index untuk auto-delete expired tokens
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Token", TokenSchema);
