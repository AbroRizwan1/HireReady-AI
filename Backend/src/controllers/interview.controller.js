const pdfParse = require("pdf-parse/lib/pdf-parse.js"); 
const {
  generateInterviewReport,
  // generateResumePdf,
  generateMockInterview,
  generateMockInterviewReport,
} = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");
const mockInterviewModel = require("../models/mockInterview.model");

// const MockInterviewModel = require("../models/MockInterview.model");

/**
 * @description : controller to generate interview report based on user job description ,self description and resume
 */
const generateInterviewReportController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const { selfDescription, jobDescription } = req.body;

    if (!selfDescription || !jobDescription) {
      return res.status(400).json({
        message: "selfDescription and jobDescription are required",
      });
    }

    let resumeContent;
    try {
      resumeContent = await pdfParse(req.file.buffer);
    } catch (pdfError) {
      console.error("PDF Parse Error:", pdfError);
      return res.status(422).json({ message: "Could not parse PDF file" });
    }

    if (!resumeContent?.text?.trim()) {
      return res.status(422).json({ message: "Could not extract text from PDF" });
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeContent.text,
      selfDescription,
      jobDescription,
      ...interviewReportByAi,
    });

    return res.status(201).json({
      message: "Interview Report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Interview Report Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
/**
 * @description : controller to get interview report by InterviewId *
 */

async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;

    if (!interviewId) {
      return res.status(400).json({ message: "Interview ID is required" });
    }

    // ✅ ObjectId validity check - "undefined" ya invalid string yahin ruk jayegi
    if (!mongoose.Types.ObjectId.isValid(interviewId)) {
      return res.status(400).json({ message: "Invalid Interview ID" });
    }

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found",
      });
    }

    return res.status(200).json({
      message: "Interview Report fetched Successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Get Interview Report Error:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching interview report",
    });
  }
}

/**
 * @description : controller to get all interview reports of logged in user
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({
      user: req.user.id,
    })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobdescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fatched successfully",
    interviewReports,
  });
}
/**
 * @description : controller to Delete interview reports of logged in user
 */

async function deleteInterviewReportController(req, res) {
  const { interviewId } = req.params;

  if (!interviewId) {
    return res.status(400).json({
      message: "interview Id not Found",
    });
  }

  const interviewReport =
    await interviewReportModel.findByIdAndDelete(interviewId);

  res.status(200).json({
    message: "interview deleted successfully",
  });
}

/**
 * @description : controller to generate resume  PDF based on resume, job Description, self Description*
 */

// async function generateResumePdfController(req, res) {
//   const { interviewReportId } = req.params;

//   const interviewReport =
//     await interviewReportModel.findById(interviewReportId);

//   if (!interviewReport) {
//     return res.status(404).json({
//       message: "Interview report not Found",
//     });
//   }

//   const { resume, jobDescription, selfDescription } = interviewReport;

//   const pdfBuffer = await generateResumePdf({
//     resume,
//     jobDescription,
//     selfDescription,
//   });

//   res.set({
//     "Content-Type": "application/pdf",
//     "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
//   });

//   res.send(pdfBuffer);
// }

/**
 * @description : generate MockInterview Question on the basic of Resume, jobDescription, selfDescription and SkillGaps*
 */

async function generateMockInterviewController(req, res) {
  const { interviewReportId } = req.params;

  if (!interviewReportId) {
    return res.status(400).json({
      message: "interviewReportId is required",
    });
  }

  // get ReportId from DB
  const interviewReport =
    await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview Report not found",
    });
  }

  const { resume, jobDescription, selfDescription, skillGaps } =
    interviewReport;

  // get Mock Interview from AI service
  const mockInterviewQuestions = await generateMockInterview(
    resume,
    jobDescription,
    selfDescription,
    skillGaps,
  );

  if (!mockInterviewQuestions) {
    return res.status(500).json({
      message: "Failed to generate mock interview questions",
    });
  }

  // Save Mock Interview to DB
  const mockInterview = await mockInterviewModel.create({
    userId: req.user.id,
    interviewReportId: interviewReportId,
    questions: mockInterviewQuestions.questions,
  });

  if (!mockInterview) {
    return res.status(500).json({
      message: "Failed to save Mock Interview",
    });
  }

  res.status(201).json({
    message: "Mock Interview generated successfully",
    mockInterview: {
      _id: mockInterview._id,
      // questions: mockInterview.questions,
    },
  });
}

/**
 * @description : Get MockInterview Question*
 */

async function getMockInterviewController(req, res) {
  const { mockInterviewId } = req.params;

  if (!mockInterviewId) {
    return res.status(400).json({
      message: "mockInterviewId is required",
    });
  }

  const mockInterview = await mockInterviewModel.findById(mockInterviewId);
  if (!mockInterview) {
    return res.status(400).json({
      message: "MockInterview not found",
    });
  }

  res.status(200).json({
    message: "mockInterview Fetched Successfully",
    mockInterview: {
      _id: mockInterview._id,
      questions: mockInterview.questions,
      status: mockInterview.status,
      questionIndex: mockInterview.questionIndex,
    },
  });
}

async function saveMockInterviewAnswerController(req, res) {
  const { answer, questionIndex, mockInterviewId } = req.body;

  const mockInterview = await mockInterviewModel.findById(mockInterviewId);

  if (!mockInterview) {
    return res.status(404).json({
      message: "Mock Interview not found",
    });
  }

  if (questionIndex < 0 || questionIndex >= mockInterview.questions.length) {
    return res.status(400).json({
      message: "Invalid question index",
    });
  }

  mockInterview.questions[questionIndex].answer = answer;
  mockInterview.questionIndex = questionIndex + 1;
  await mockInterview.save();

  if (questionIndex === mockInterview.questions.length - 1) {
    mockInterview.status = "completed";
  }

  res.status(200).json({
    message: "Answer saved successfully",
  });
}

async function finishMockInterviewController(req, res) {
  const { mockInterviewId } = req.params;

  if (!mockInterviewId) {
    return res.status(400).json({
      message: "mockInterviewId is required",
    });
  }

  const mockInterview = await mockInterviewModel
    .findById(mockInterviewId)
    .populate("userId", "username");

  if (!mockInterview) {
    return res.status(404).json({
      message: "Mock Interview not found",
    });
  }

  const [question, answer] = mockInterview.questions;

  const mockInterviewReport = await generateMockInterviewReport({
    question,
    answer,
  });

  if (!mockInterviewReport) {
    return res.status(500).json({
      message: "mock interview Report not found",
    });
  }

  mockInterview.strengths = mockInterviewReport.strengths;
  mockInterview.overallScore = mockInterviewReport.overallScore;
  mockInterview.weaknesses = mockInterviewReport.weaknesses;
  mockInterview.feedback = mockInterviewReport.feedback;

  await mockInterview.save();

  res.status(200).json({
    message: "MockInterviewReport generated Successfully",
    _id: mockInterview._id,
  });
}

async function getMockInterviewReportController(req, res) {
  const { mockInterviewId } = req.params;

  if (!mockInterviewId) {
    return res.status(400).json({
      message: "mockInterviewId is required",
    });
  }

  const mockInterviewReport = await mockInterviewModel
    .findById(mockInterviewId)
    .select("_id overallScore strengths weaknesses feedback")
    .populate("userId", "username");

  res.status(200).json({
    message: "Mock interview fetched successfully",
    mockInterviewReport,
  });
}

/**
 * @description : controller to get all interview reports of logged in user
 */

async function getAllMockInterviewReportsController(req, res) {
  const mockInterviewReports = await mockInterviewModel
    .find({
      userId: req.user.id,
    })
    .populate("interviewReportId", "title")
    .sort({ createdAt: -1 })
    .select("overallScore createdAt userId");

  res.status(200).json({
    message: "Mockinterview reports fatched successfully",
    mockInterviewReports,
  });
}

/**
 * @description : controller to Delete Mock interview reports of logged in user
 */

async function deleteMockInterviewReportController(req, res) {
  const { mockInterviewId } = req.params;
  if (!mockInterviewId) {
    return res.status(400).json({
      message: "mockInterview Id not Found",
    });
  }

  const deletedReport = await mockInterviewModel.findOneAndDelete({
    _id: mockInterviewId,
    userId: req.user.id,
  });

  res.status(200).json({
    message: "Mock interview deleted successfully",
    deletedReport,
  });
}

module.exports = {
  deleteMockInterviewReportController,
  deleteInterviewReportController,
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,

  //  generateResumePdfController,
  generateMockInterviewController,
  getMockInterviewController,
  saveMockInterviewAnswerController,
  finishMockInterviewController,
  getMockInterviewReportController,
  getAllMockInterviewReportsController,
};
