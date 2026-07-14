const mongoose = require("mongoose");

const mockInterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    interviewReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interviewReport",
      required: true,
    },

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          default: "",
        },
      },
      { _id: false },
    ],

    interviewTime: {
      type: Number, // seconds
      default: 0,
    },

    questionIndex: {
      type: Number, 
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    strengths: [String],

    weaknesses: [String],
    feedback: [String],

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const mockInterviewModel = mongoose.model("mockInterview", mockInterviewSchema);

module.exports = mockInterviewModel;
