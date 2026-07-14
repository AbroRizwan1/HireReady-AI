
// ── Shared helpers (private, not exported) ──────────────────
const isTextLongEnough = (text, min) => {
  // Trims whitespace before checking length
  return text.trim().length >= min;
};

const isFileSizeValid = (file, maxMB) => {
  // Converts bytes to MB and compares against limit
  return file.size / (1024 * 1024) <= maxMB;
};

const isFileTypeValid = (file) => {
  // Only PDF and DOCX are accepted for resumes
  const allowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return allowed.includes(file.type);
};

// ── Home Form Validation ────────────────────────────────────
// Call before processing the form.
// Returns the FIRST error string found, or null if all pass.

const analyzeValidation = ({ jobDescription, selfDescription, resume }) => {
  // Rule 1: Job description must be filled in
  if (!jobDescription || !jobDescription.trim()) {
    return "Job description is required.";
  }

  // Rule 2: Job description must be at least 50 characters
  if (!isTextLongEnough(jobDescription, 50)) {
    return "Job description must be at least 50 characters.";
  }

  // Rule 3: Self description must be filled in
  if (!selfDescription || !selfDescription.trim()) {
    return "Tell us about yourself — this field is required.";
  }

  // Rule 4: Self description must be at least 30 characters
  if (!isTextLongEnough(selfDescription, 30)) {
    return "Self description must be at least 30 characters.";
  }

  // Rule 5: Resume file must be uploaded
  if (!resume) {
    return "Please upload your resume.";
  }

  // Rule 6: Resume must be PDF or DOCX only
  if (!isFileTypeValid(resume)) {
    return "Resume must be a PDF or DOCX file.";
  }

  // Rule 7: Resume file size must not exceed 5MB
  if (!isFileSizeValid(resume, 5)) {
    return "Resume file size must be under 5MB.";
  }

  // All rules passed
  return null;
};

// ── Export ──────────────────────────────────────────────────
export const HomeValidation = {
  analyze: analyzeValidation,
};
