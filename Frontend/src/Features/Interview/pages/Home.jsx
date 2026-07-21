import { useState } from "react";
import TextArea from "../Components/TextArea";
import { useInterview } from "../Hooks/useInterview";
import { HomeValidation } from "../utilities/HomeValidation"
import Reports from "../Components/Reports"
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/Hooks/useAuth";
import Navbar from "../../../Components/Navbar";

export default function HomePage() {

  const navigate = useNavigate()
  // ── Field State ────────────────────────────────────────────
  const [jobDescription, setJobDescription] = useState(""); // job description textarea
  const [selfDescription, setSelfDescription] = useState(""); // self description textarea
  const [resume, setResume] = useState(null); // uploaded File object
  const [selectedId, setSelectedId] = useState(null);


  // ── UI State ───────────────────────────────────────────────
  const [focused, setFocused] = useState(null); // which field is active
  const [dragOver, setDragOver] = useState(false); // true when file is dragged over drop zone

  // ── Hook ───────────────────────────────────────────────
  const {
    loading,
    error,
    setError,
    report,
    reports,
    generateReport,
    deleteInterviewReport
  } = useInterview();


  // ── File Handler ───────────────────────────────────────────
  const handleFileChange = (file) => {
    if (file) {
      setResume(file);
      setError(null); // clear any previous file error when new file is picked
    }
  };

  // ── Drag and Drop Handlers ─────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault(); // required to allow drop
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0]; // take only the first dropped file
    handleFileChange(file);
  };


  const handleSubmit = async () => {
    setError(null);
    // Step 1: validate all fields via HomeValidation
    const validationError = HomeValidation.analyze({
      jobDescription,
      selfDescription,
      resume
    });

    // Step 2: if validation failed, show error and stop
    if (validationError) {
      setError(validationError);
      return;
    }

    const data = await generateReport({
      jobDescription,
      selfDescription,
      resume
    })

    navigate(`/interview/${data?._id}`)
  };

  // ── Reset Handler ──────────────────────────────────────────
  // Clears all fields so user can start fresh after success
  const handleDelete = async (interviewId) => {    
    await deleteInterviewReport(interviewId)

  }

  const handleReset = () => {
    setJobDescription("");
    setSelfDescription("");
    setResume(null);
    setError(null);

  };




  return (
    <div
      className="flex flex-col items-center
                 px-4 py-12 gap-10 overflow-hidden relative min-h-screen"
      style={{ background: "#37353E" }}
    >
      {/* ── Navbar ───────────────────────────────────────────── */}

      <Navbar />

      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full
                     opacity-[0.12] blur-3xl animate-pulse"
          style={{ background: "#715A5A" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full
                     opacity-[0.07] blur-3xl animate-pulse"
          style={{ background: "#715A5A", animationDelay: "1.5s" }}
        />
      </div>

      {/* ── Top Navbar ─────────────────────────────────────────────
          Full-width bar: logo/app name on left, user + logout on right.
          Sticks to the top of the page content (not fixed/sticky —
          flows with the page so it doesn't overlap the card).
          On mobile: name hidden, only avatar + logout shown.
          ──────────────────────────────────────────────────────────── */}

      {/* ── Card — .home-card triggers slide-up entrance ───── */}
      <div
        className="relative w-full max-w-5xl rounded-2xl p-6 sm:p-8 lg:p-10
                   shadow-2xl home-card z-10"
        style={{
          background: "#44444E",
          border: "1px solid rgba(211,218,217,0.08)",
        }}
      >

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12
                       rounded-xl mb-4 shadow-lg"
            style={{ background: "#37353E", border: "1px solid rgba(113,90,90,0.45)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"
              fill="none" viewBox="0 0 24 24" stroke="#715A5A" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745
                   M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2
                   2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#D3DAD9" }}
          >
            Resume Analyzer
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(211,218,217,0.45)" }}>
            Paste the job details, describe yourself, and upload your resume
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* ── 2-Column Grid ───────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Left Column: Job Description */}
            <div className="flex flex-col" style={{ minHeight: "280px" }}>
              <TextArea
                id="jobDescription"
                label="Job Description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here… (min. 50 characters)"
                rows={14}
                focused={focused}
                onFocus={() => setFocused("jobDescription")}
                onBlur={() => setFocused(null)}
                minChars={50}
              />
            </div>

            {/* Right Column: Self Description + Resume */}
            <div className="flex flex-col gap-5">

              <TextArea
                id="selfDescription"
                label="About You"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Briefly describe your skills and experience… (min. 30 characters)"
                rows={5}
                focused={focused}
                onFocus={() => setFocused("selfDescription")}
                onBlur={() => setFocused(null)}
                minChars={30}
              />

              {/* Resume Upload drop zone */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-sm font-medium tracking-wide"
                  style={{ color: "#D3DAD9" }}
                >
                  Resume
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("resumeInput").click()}
                  className="flex flex-col items-center justify-center gap-2
                               rounded-xl border-2 border-dashed py-6 px-4 cursor-pointer
                               transition-all duration-300"
                  style={{
                    borderColor: dragOver ? "#715A5A" : resume ? "#715A5A" : "rgba(211,218,217,0.18)",
                    background: dragOver ? "rgba(113,90,90,0.09)" : "#37353E",
                  }}
                >
                  <input
                    id="resumeInput"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />

                  {resume ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7"
                        fill="none" viewBox="0 0 24 24" stroke="#715A5A" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-center max-w-full truncate px-2"
                        style={{ color: "#715A5A" }}>
                        {resume.name}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(211,218,217,0.35)" }}>
                        {(resume.size / (1024 * 1024)).toFixed(2)} MB · Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7"
                        fill="none" viewBox="0 0 24 24"
                        stroke="rgba(211,218,217,0.25)" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0
                               011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-center"
                        style={{ color: "rgba(211,218,217,0.5)" }}>
                        Drag & drop or{" "}
                        <span style={{ color: "#715A5A" }}>browse</span>
                      </p>
                      <p className="text-xs" style={{ color: "rgba(211,218,217,0.25)" }}>
                        PDF or DOCX · max 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Error message */}
          {error && (
            <p
              key={error}
              className="text-xs px-3 py-2 rounded-lg error-shake"
              style={{
                background: "rgba(113,90,90,0.15)",
                color: "#D3DAD9",
                border: "1px solid rgba(113,90,90,0.38)",
              }}
            >
              ⚠ {error}
            </p>
          )}

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 cursor-pointer rounded-xl
                           text-sm font-semibold tracking-wide transition-all duration-300
                           hover:scale-[1.02] active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "#715A5A",
                color: "#D3DAD9",
                boxShadow: "0 4px 20px rgba(113,90,90,0.32)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Analyzing…
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Recent Reports Section ─────────────────────────────── */}
      <div className="w-full max-w-5xl z-10">

        <h2
          className="text-xl font-bold tracking-tight mb-4"
          style={{ color: "#D3DAD9" }}
        >
          Recent Reports
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports?.map((report, index) => (
            <Reports
              key={index}
              title={report?.title}
              date={`Generated on ${new Date(report?.createdAt).toLocaleDateString()}`}
              score={report.matchScore}
              onClick={() => navigate(`/interview/${report?._id}`)}
              onDelete={() => { handleDelete(report?._id) }}
            />
          ))}
        </div>

        {/* Empty state */}
        {(!reports || reports.length === 0) && (
          <div
            className="flex flex-col items-center justify-center py-14 rounded-2xl"
            style={{ border: "1px dashed rgba(211,218,217,0.12)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3"
              fill="none" viewBox="0 0 24 24"
              stroke="rgba(211,218,217,0.2)" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0
                   012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1
                   0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm" style={{ color: "rgba(211,218,217,0.25)" }}>
              No reports yet — analyze your first resume above
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
