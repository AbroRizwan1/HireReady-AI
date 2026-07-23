import { useEffect, useState } from "react";
import { useInterview } from "../Hooks/useInterview";
import { useNavigate, useParams } from "react-router";
import "../style/homeAnimation.css";
import Loading, { PageLoader } from "../Components/Loading";
import Loader from "../Components/Loading";
import Reports from "../Components/Reports"
import { useMockInterview } from "../../mockInterview/Hooks/useMockInterview";
// ============================================================
// [UI COMPONENTS SECTION]
// Defined outside InterviewPage to prevent re-mounts.
// ============================================================

// ── Severity Badge ────────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const styles = {
    low: { bg: "rgba(211,218,217,0.1)", text: "#D3DAD9", label: "Low" },
    medium: { bg: "rgba(113,90,90,0.25)", text: "#D3DAD9", label: "Medium" },
    high: { bg: "rgba(113,90,90,0.55)", text: "#D3DAD9", label: "High" },
  };
  const s = styles[severity] || styles.low;
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
};

// ── Question Card ─────────────────────────────────────────────
// Expandable accordion — works on all screen sizes.
const QuestionCard = ({ item, index, isOpen, onToggle }) => (
  <div
    className="rounded-xl overflow-hidden transition-all duration-300 question-card"
    style={{
      background: isOpen ? "#37353E" : "rgba(55,53,62,0.5)",
      border: `1px solid ${isOpen ? "#715A5A" : "rgba(211,218,217,0.1)"}`,
      animationDelay: `${index * 60}ms`,
    }}
  >
    {/* Question row */}
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer"
    >
      <div className="flex items-start gap-3 min-w-0">
        {/* Number badge */}
        <span
          className="flex-shrink-0 w-6 h-6 rounded-lg text-xs font-bold
                     flex items-center justify-center mt-0.5"
          style={{ background: "rgba(113,90,90,0.35)", color: "#D3DAD9" }}
        >
          {index + 1}
        </span>
        {/* Question text — truncates cleanly on narrow screens */}
        <p className="text-sm font-medium leading-snug" style={{ color: "#D3DAD9" }}>
          {item.question}
        </p>
      </div>

      {/* Chevron rotates when open */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
        style={{ color: "#715A5A", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Expanded content */}
    {isOpen && (
      <div
        className="px-4 pb-4 flex flex-col gap-3 answer-appear"
        style={{ borderTop: "1px solid rgba(211,218,217,0.08)" }}
      >
        <div className="pt-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#715A5A" }}>
            Why they ask
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(211,218,217,0.6)" }}>
            {item.intention}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: "#715A5A" }}>
            Suggested answer
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(211,218,217,0.75)" }}>
            {item.answer}
          </p>
        </div>
      </div>
    )}
  </div>
);

// ── Roadmap Panel ─────────────────────────────────────────────
const RoadmapPanel = ({ plan }) => (
  <div className="flex flex-col gap-3">
    {plan?.map((item, i) => (
      <div
        key={i}
        className="flex gap-3 items-start question-card"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        {/* Day badge */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex flex-col
                     items-center justify-center text-center"
          style={{ background: "rgba(113,90,90,0.3)", border: "1px solid rgba(113,90,90,0.4)" }}
        >
          <span className="text-[9px] uppercase tracking-wider"
            style={{ color: "rgba(211,218,217,0.6)" }}>Day</span>
          <span className="text-sm font-bold leading-none" style={{ color: "#D3DAD9" }}>
            {item.day}
          </span>
        </div>

        {/* Focus + tasks */}
        <div
          className="flex-1 min-w-0 rounded-xl px-4 py-3"
          style={{ background: "rgba(55,53,62,0.6)", border: "1px solid rgba(211,218,217,0.08)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#D3DAD9" }}>
            {item.focus}
          </p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(211,218,217,0.55)" }}>
            {item.tasks}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// ── Match Score Ring ──────────────────────────────────────────
const MatchScoreRing = ({ score }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const filled = ((score || 0) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#715A5A" }}>
        Match Score
      </p>
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius}
            fill="none" stroke="rgba(211,218,217,0.1)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke="#715A5A" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - filled}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: "#D3DAD9" }}>
            {score ?? "--"}
          </span>
          <span className="text-xs" style={{ color: "rgba(211,218,217,0.4)" }}>/ 100</span>
        </div>
      </div>
    </div>
  );
};

// ── Skill Gaps List ───────────────────────────────────────────
const SkillGapsList = ({ skillGaps }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-widest mb-3"
      style={{ color: "#715A5A" }}>
      Skill Gaps
    </p>
    {skillGaps?.length === 0 ? (
      <p className="text-xs" style={{ color: "rgba(211,218,217,0.3)" }}>No gaps found.</p>
    ) : (
      <div className="flex flex-col gap-2">
        {skillGaps?.map((gap, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
            style={{ background: "rgba(55,53,62,0.7)", border: "1px solid rgba(211,218,217,0.08)" }}
          >
            <span className="text-xs font-medium truncate" style={{ color: "#D3DAD9" }}>
              {gap.skill}
            </span>
            <SeverityBadge severity={gap.severity} />
          </div>
        ))}
      </div>
    )}
  </div>
);


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function InterviewPage(props) {
  const { interviewId } = useParams()


  const navigate = useNavigate()
  const {
    report,
    loading,
    error,
    // getResumePdf,
    getReportById,
    resumeLoader,
    setResumeLoader
  } = useInterview()

  const { getInterviewReportId, getAllMockInterviewReports, mockReports, mockInterviewLoading, mockInterview, setMockReports, deleteMockInterviewReport, deleteLoading } = useMockInterview()

  const data = {
    ...(report || {}),
    ...props,
  };

  // Recent MockInterview Reports 
  useEffect(() => {
    getAllMockInterviewReports()
  }, [])

  const handleDelete = async (mockInterviewId) => {
    await deleteMockInterviewReport(mockInterviewId)
  }

  const [activeTab, setActiveTab] = useState("technical");
  const [openCard, setOpenCard] = useState(null);

  const tabs = [
    { id: "technical", label: "Technical Question" },
    { id: "behavioral", label: "Behavioral Questions" },
    { id: "roadmap", label: "Road Map" },
  ];

  const handleTabChange = (id) => { setActiveTab(id); setOpenCard(null); };
  const toggleCard = (key) => setOpenCard((p) => (p === key ? null : key));


  const activeQuestions =
    activeTab === "technical" ? data.technicalQuestions :
      activeTab === "behavioral" ? data.behavioralQuestions : [];
  // ── End mock block ──────────────────────────────────────────


  const handleMockInterview = async (e, interviewId) => {
    e.preventDefault()
    const data = await getInterviewReportId(interviewId)

    navigate(`/mock-interview/${data?.mockInterview?._id}`);
  }

  if (loading) {
    return (
      <main >
        {loading && <PageLoader label="Fetching your reports…" />}
      </main>
    )
  }
  console.log(report);

  return (
    <div style={{ background: "#37353E" }} className="min-h-screen flex item-center justify-center px-3 sm:px-4 py-6 sm:py-12 overflow-hidden relative" >

      <div>
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full
                     opacity-[0.1] blur-3xl animate-pulse"
            style={{ background: "#715A5A" }}
          />
          <div
            className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full
                     opacity-[0.07] blur-3xl animate-pulse"
            style={{ background: "#715A5A", animationDelay: "1.5s" }}
          />
        </div>

        {/* ── Outer card ──────────────────────────────────────────── */}
        <div
          className="relative w-full max-w-7xl rounded-2xl shadow-2xl
                   overflow-hidden interview-card "
          style={{ background: "#44444E", border: "1px solid rgba(211,218,217,0.08)" }}
        >

          {/* =======================================================
            DESKTOP LAYOUT (lg+): sidebar | center | right panel
            HIDDEN on mobile — replaced by tab bar below
            ======================================================= */}
          <div className="hidden lg:flex min-h-[800px]">

            {/* LEFT SIDEBAR */}
            <div
              className="flex flex-col item-center justify-between gap-1 p-4 pt-6 flex-shrink-0"
              style={{
                width: "230px",
                background: "#37353E",
                borderRight: "1px solid rgba(211,218,217,0.07)",
              }}
            >
              <div>
                {/* Logo mark */}
                <div className="px-2 mb-6">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(113,90,90,0.3)", border: "1px solid rgba(113,90,90,0.45)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                      fill="none" viewBox="0 0 24 24" stroke="#715A5A" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4
                       12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072
                       0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4
                       0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>

                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm
                           font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: activeTab === tab.id ? "rgba(113,90,90,0.3)" : "transparent",
                      color: activeTab === tab.id ? "#D3DAD9" : "rgba(211,218,217,0.4)",
                      borderLeft: activeTab === tab.id ? "2px solid #715A5A" : "2px solid transparent",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div>

                {/* <button
                  disabled={resumeLoader}
                  type="button"
                  onClick={() => {
                    getResumePdf(interviewId)
                  }}
                  className="flex items-center gap-1 px-6 py-2.5 mb-4 rounded-lg
                         text-sm font-medium cursor-pointer
                         transition-all duration-200
                         hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    background: "rgba(113,90,90,0.15)",
                    border: "1px solid rgba(113,90,90,0.3)",
                    color: "rgba(211,218,217,0.65)",
                  }}
           
                >
                  {resumeLoader ? (<Loader size="sm" />) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
                    </svg>
                  )}

                  <span>{resumeLoader ? "Downloading..." : "Download Resume"} </span>
                </button> */}

                <button
                  type="button"
                  onClick={(e) => { handleMockInterview(e, interviewId) }}
                  disabled={mockInterviewLoading}
                  className="relative w-full py-3 cursor-pointer mb-4 rounded-xl text-sm font-semibold tracking-wide
                         transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-70 disabled:cursor-not-allowed mt-1"
                  style={{
                    background: "#715A5A",
                    color: "#D3DAD9",
                    boxShadow: "0 4px 20px rgba(113,90,90,0.35)",
                  }}
                >
                  {mockInterviewLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      {/* Spinner — Tailwind animate-spin utility */}
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Starting...
                    </span>
                  ) : (
                    "Start Mock Interview"
                  )}
                </button>

              </div>
            </div>


            {/* CENTER PANEL */}
            <div className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: "85vh" }}>
              <h2 className="text-base font-semibold mb-4 tracking-tight" style={{ color: "#D3DAD9" }}>
                {activeTab === "technical" && "Technical Questions"}
                {activeTab === "behavioral" && "Behavioral Questions"}
                {activeTab === "roadmap" && "Preparation Road Map"}
              </h2>

              {activeTab === "roadmap" ? (
                <RoadmapPanel plan={data?.preparationPlan} />
              ) : (
                <div className="flex flex-col gap-3">
                  {activeQuestions?.length === 0 ? (
                    <p className="text-sm" style={{ color: "rgba(211,218,217,0.3)" }}>
                      No questions available.
                    </p>
                  ) : (
                    activeQuestions?.map((item, i) => {
                      const key = `${activeTab}-${i}`;
                      return (
                        <QuestionCard
                          key={key} item={item} index={i}
                          isOpen={openCard === key}
                          onToggle={() => toggleCard(key)}
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* RIGHT PANEL */}
            <div
              className="flex flex-col gap-6 p-6 flex-shrink-0"
              style={{ width: "230px", borderLeft: "1px solid rgba(211,218,217,0.07)" }}
            >
              <MatchScoreRing score={data.matchScore} />
              <div style={{ height: "1px", background: "rgba(211,218,217,0.07)" }} />
              <SkillGapsList skillGaps={data.skillGaps} />
            </div>
          </div>

          {/* =======================================================
            MOBILE + TABLET LAYOUT (<lg)
            Top bar: Match Score + compact skill gap chips
            Tab bar: horizontal scrollable pills
            Content: full-width questions / roadmap
            ======================================================= */}

          <div className="lg:hidden flex flex-col">

            {/* ── Top stats bar ───────────────────────────────────────── */}
            <div
              className="flex flex-col gap-4 px-4 py-4"
              style={{ borderBottom: "1px solid rgba(211,218,217,0.07)", background: "#37353E" }}
            >

              {/* Row 1: Score ring + skill gap chips side by side */}
              <div className="flex items-center justify-between gap-3 flex-wrap">

                {/* Compact score ring */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" fill="none"
                        stroke="rgba(211,218,217,0.1)" strokeWidth="11" />
                      <circle cx="50" cy="50" r="44" fill="none"
                        stroke="#715A5A" strokeWidth="11" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 44}
                        strokeDashoffset={
                          2 * Math.PI * 44 - ((data.matchScore || 0) / 100) * 2 * Math.PI * 44
                        }
                        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold" style={{ color: "#D3DAD9" }}>
                        {data.matchScore ?? "--"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#715A5A" }}>Match</p>
                    <p className="text-xs" style={{ color: "rgba(211,218,217,0.4)" }}>/ 100</p>
                  </div>
                </div>

                {/* Skill gap chips */}
                <div className="flex flex-wrap gap-1.5 flex-1 justify-end">
                  {data?.skillGaps?.slice(0, 4).map((gap, i) => (
                    <div key={i}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                      style={{ background: "rgba(55,53,62,0.8)", border: "1px solid rgba(211,218,217,0.08)" }}>
                      <span className="text-xs" style={{ color: "#D3DAD9" }}>{gap.skill}</span>
                      <SeverityBadge severity={gap.severity} />
                    </div>
                  ))}
                  {data?.skillGaps?.length > 4 && (
                    <span className="text-xs px-2 py-1 rounded-lg"
                      style={{ background: "rgba(113,90,90,0.2)", color: "#D3DAD9" }}>
                      +{data.skillGaps.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Buttons — stacked on mobile, side by side on sm+ */}
              <div className="flex flex-col sm:flex-row gap-2">

                {/* 
                <button
                  disabled={resumeLoader}
                  type="button"
                  onClick={() => getResumePdf(interviewId)}
                  className="flex items-center justify-center gap-2
                   w-full px-5 py-2.5 rounded-xl text-sm font-semibold
                   cursor-pointer transition-all duration-200
                   hover:scale-[1.02] active:scale-[0.97]
                   disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(113,90,90,0.15)",
                    border: "1px solid rgba(113,90,90,0.3)",
                    color: "rgba(211,218,217,0.65)",
                  }}
                >
                  {resumeLoader ? (
                    <Loader size="sm" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0
                 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
                    </svg>
                  )}
                  <span>{resumeLoader ? "Downloading..." : "Download Resume"}</span>
                </button> */}

                {/* Start Mock Interview */}
                <button
                  type="button"
                  onClick={(e) => handleMockInterview(e, interviewId)}
                  disabled={mockInterviewLoading}
                  className="flex items-center justify-center gap-2
                   w-full px-5 py-2.5 rounded-xl text-sm font-semibold
                   cursor-pointer transition-all duration-300
                   hover:scale-[1.02] active:scale-[0.98]
                   disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: "#715A5A",
                    color: "#D3DAD9",
                    boxShadow: "0 4px 20px rgba(113,90,90,0.35)",
                  }}
                >
                  {mockInterviewLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin flex-shrink-0"
                        viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                          stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Starting...</span>
                    </>
                  ) : (
                    <span>Start Mock Interview</span>
                  )}
                </button>

              </div>
            </div>

            {/* ── Horizontal tab bar ──────────────────────────────────── */}
            <div
              className="flex overflow-x-auto scrollbar-hide px-4 pt-3 pb-0 gap-2"
              style={{ borderBottom: "1px solid rgba(211,218,217,0.07)" }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium
                   rounded-t-xl cursor-pointer transition-all duration-200"
                  style={{
                    background: activeTab === tab.id ? "#44444E" : "transparent",
                    color: activeTab === tab.id ? "#D3DAD9" : "rgba(211,218,217,0.4)",
                    borderBottom: activeTab === tab.id
                      ? "2px solid #715A5A"
                      : "2px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Content panel ───────────────────────────────────────── */}
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: "70vh" }}>
              <h2 className="text-sm font-semibold mb-3" style={{ color: "#D3DAD9" }}>
                {activeTab === "technical" && "Technical Questions"}
                {activeTab === "behavioral" && "Behavioral Questions"}
                {activeTab === "roadmap" && "Preparation Road Map"}
              </h2>

              {activeTab === "roadmap" ? (
                <RoadmapPanel plan={data.preparationPlan} />
              ) : (
                <div className="flex flex-col gap-3">
                  {activeQuestions?.length === 0 ? (
                    <p className="text-sm" style={{ color: "rgba(211,218,217,0.3)" }}>
                      No questions available.
                    </p>
                  ) : (
                    activeQuestions?.map((item, i) => {
                      const key = `${activeTab}-${i}`;
                      return (
                        <QuestionCard
                          key={key} item={item} index={i}
                          isOpen={openCard === key}
                          onToggle={() => toggleCard(key)}
                        />
                      );
                    })
                  )}
                </div>
              )}
            </div>

          </div>

          {/* end mobile layout */}

        </div>


        {/* ── Recent Reports Section ─────────────────────────────── */}
        <div className="w-full max-w-7xl z-10 px-4">

          <h2
            className="text-xl font-bold tracking-tight mb-3 mt-10"
            style={{ color: "#D3DAD9" }}
          >
            Recent Mock Interview Reports
          </h2>
          {deleteLoading ? (
            <div className="min-h-[400px]">
              <Loader size="md" />
            </div>

          ) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {mockReports?.map((report) => (
              <Reports
                key={report._id}
                title={report?.interviewReportId?.title}
                date={`Generated on ${new Date(report.createdAt).toLocaleDateString()}`}
                score={report.overallScore}
                onClick={() => navigate(`/mock-interview/report/${report._id}`)}
                onDelete={() => handleDelete(report._id)}
              />
            ))}
          </div>
          )}

          {/* Empty state */}
          {(!mockReports || mockReports.length === 0) && (
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
      </div >
    </div>
  );
}