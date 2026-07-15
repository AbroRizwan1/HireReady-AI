const dotenv = require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
// const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    ),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The Technical Question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interview behind asking this question "),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Techinical Questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z.array(
    z
      .object({
        question: z
          .string()
          .describe("The Technical Question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interview behind asking this question "),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      })
      .describe(
        "behavioral Questions that can be asked in the interview along with their intention and how to answer them",
      ),
  ),

  skillGaps: z.array(
    z
      .object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of this skill gap, i.e. how important is "),
      })
      .describe(
        "list of skill gaps in the candidate's profile along with their severity",
      ),
  ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number is the preparation plan, start from 1 "),
        focus: z
          .string()
          .describe(
            "The main focus of this day in the preparation plan, e.g data structure, system design, mock interviews ",
          ),

        tasks: z
          .string()
          .describe(
            "list of tasks to be done on this day to follow the preparation plan, e.g read a specific book, watch a tutorial,  revise notes, implement a project feature, practice system design questions, complete mock interviews, review resume, optimize LinkedIn profile, study interview questions, write code exercises, debug applications",
          ),
      }),
    )
    .describe(
      "A day-wise preparation for the candidate to follow in order to prepare for the effective interview process ",
    ),

  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
    ),
});

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  const prompt = `
You are an interview preparation assistant.

Return ONLY valid JSON.

The root MUST be an object.

DO NOT:
- Return markdown
- Return explanation
- Return text outside JSON
- Return null values
- Return top-level array
- Return numbers instead of arrays

The JSON structure MUST match EXACTLY:

{
  "title": "string",
  "matchScore": 85,

  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],

  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],

  "skillGaps": [
    {
      "skill": "string",
      "severity": "low"
    }
  ],

  "preparationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": "string"
    }
  ]
}

Requirements:
- Generate EXACTLY 5 technicalQuestions
- Generate EXACTLY 5 behavioralQuestions
- Generate EXACTLY 3 skillGaps
- Generate EXACTLY 7 preparationPlan items
- matchScore must be number between 0-100
- severity must be low, medium, or high

Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  let data;

  try {
    data = JSON.parse(response.text);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    throw new Error("Invalid JSON returned from AI");
  }

  // VALIDATE RESPONSE
  const validatedData = interviewReportSchema.safeParse(data);

  if (!validatedData.success) {
    console.error("Zod Validation Error:", validatedData.error.format());

    throw new Error("AI response schema invalid");
  }

  return validatedData.data;
}

// async function generatePdfFromHtml(htmlcontent) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(htmlcontent, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: { top: "20mm", bottom: "20mm", left: "15mm" },
//   });

//   await browser.close();

//   return pdfBuffer;
// }

// async function generateResumePdf({ resume, jobDescription, selfDescription }) {
//   const resumePdfSchema = z.object({
//     html: z
//       .string()
//       .describe(
//         "The HTML content of the resume which can be converted to PDF using any library like puppeteer",
//       ),
//   });
//   const prompt = `Generate a resume for a candidate with the following details
//    Resume: ${resume}
//    selfDescription:${selfDescription}
//    jobDescription:${jobDescription}

//    the response should be a JSON object with a single field "HTML" which contains the HTML content of the resume which can be converted to PDf using libaray like Pupeteer
//    the resume should be tailored for the given description and should highlight the candidate's strengths and relevant experience. The HTML content  The HTML content should be well-formatted and structured, making it easy to read
//    The content of resume should not be sound like it's  generated by Ai and should be as close as possible to a real human-written resume.
//    you can highlight the content using some colors or different font styles but overall design should be simple and professional.
//    The content should be ATS friendly, i.e it should be easily parsable by, ATS systems without losing important information.
//    The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevent information that can increase the candidate's chances of getting an interview call for the given job description.

//    Requirements:
// - Full HTML document with html, head and body tags
// - A4 page size
// - Modern clean design
// - Single column layout
// - Header with name, title, email, phone, LinkedIn
// - Professional Summary
// - Skills section
// - Experience section
// - Projects section
// - Education section
// - Clean spacing and typography
// - Use CSS inside <style> tag
// - No tables
// - No images
// - Return only JSON:
// {
//   "html": "complete html document"
// }
//    `;
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema: zodToJsonSchema(resumePdfSchema),
//     },
//   });

//   const JsonContent = JSON.parse(response.text);

//   const pdfBuffer = await generatePdfFromHtml(JsonContent.html);

//   return pdfBuffer;
// }

// async function generateMockInterview({
//   resume,
//   jobDescription,
//   selfDescription,
//   skillGaps,
// }) {
//   const mockInterviewSchema = {
//     questions: z.array(
//       z.object({
//         question: z
//           .string()
//           .describe(
//             "The interview question generated by AI for the candidate as per the job Description, resume , selfDescription , skillGaps",
//           ),
//       }),
//     ),
//   };

//   const prompt = `
// You are an experienced technical interviewer.

// Your task is to create a realistic mock interview tailored specifically to the candidate's target role.

// Candidate Resume:
// ${resume}

// Job Description:
// ${jobDescription}

// Identified Skill Gaps:
// ${skillGaps}

// Instructions:

// 1. Analyze the candidate's resume, skills, experience, and the job description.
// 2. Generate 10 to 15 high-quality interview questions.
// 3. Prioritize technologies, tools, and responsibilities mentioned in the job description.
// 4. Ask additional questions about the candidate's identified skill gaps to test weak areas.
// 5. Include a mix of:

//    * 70% Technical Questions
//    * 30% Behavioral Questions
// 6. Questions should match the candidate's experience level.
// 7. Questions must be practical and similar to those asked in real interviews.
// 8. Do not generate questions from unrelated fields or industries.
// 9. Do not provide answers, hints, explanations, or feedback.
// 10. Each question should be clear, concise, and professional.

// Return only valid JSON in the following format:

// {
// questions: [
// {
// "question": "Interview question here"
// }
// ]
// }
// `;

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//     },
//   });

//   return JSON.parse(response.text);
// }

async function generateMockInterviewReport({ question, answer }) {
  const mockInterviewReportSchema = z.object({
    overallScore: z
      .number()
      .min(0)
      .max(100)
      .describe(
        "An overall interview performance score from 0 to 100 based on the candidate's answers, technical knowledge, communication skills, problem-solving ability, and relevance of responses.",
      ),

    strengths: z
      .array(
        z
          .string()
          .describe(
            "A specific area where the candidate performed well during the mock interview.",
          ),
      )
      .describe(
        "A list of the candidate's key strengths identified from their interview answers.",
      ),

    weaknesses: z
      .array(
        z
          .string()
          .describe("A specific area where the candidate needs improvement."),
      )
      .describe(
        "A list of weaknesses, knowledge gaps, or areas requiring further preparation.",
      ),

    feedback: z
      .string()
      .describe(
        "A detailed overall assessment of the candidate's interview performance, highlighting strengths, weaknesses, communication quality, technical understanding, and recommendations for improvement.",
      ),
  });

  const prompt = `
You are an experienced technical interviewer.

Your job is to review the candidate's answers and evaluate their interview performance.

Interview Questions and Answers:

${question}

${answer}

Instructions:

1. Read all questions and answers carefully.
2. Evaluate the candidate based on:
   * Technical knowledge
   * Problem-solving skills
   * Communication skills
   * Accuracy of answers
   * Understanding of concepts
3. Be fair and realistic when giving scores.
4. Do not give a very high score unless the answers are truly strong.
5. Find the candidate's strongest areas.
6. Find areas where the candidate needs improvement.
7. Give clear and helpful feedback that can help the candidate prepare for future interviews.
8. Base your evaluation only on the answers provided.
9. Return only valid JSON matching the required schema.

Scoring Guide:

* 90-100: Excellent performance
* 80-89: Very good performance
* 70-79: Good performance with some gaps
* 60-69: Basic understanding, needs improvement
* Below 60: Needs significant improvement

Generate:

* overallScore
* strengths
* weaknesses
* feedback

Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text);
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
  generateMockInterview,
  generateMockInterviewReport,
};
