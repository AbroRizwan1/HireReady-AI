import { useEffect } from "react";
import { useParams } from "react-router";
import { useMockInterview } from "../Hooks/useMockInterview";
import { PageLoader } from "../../Interview/Components/Loading";

// ── Score utilities ───────────────────────────────────────────

// Returns a label + color based on score out of 10
const getScoreConfig = (score) => {
    if (score >= 8) return { label: "Excellent", color: "#7acea0", dim: "rgba(122,206,160,0.15)" };
    if (score >= 6) return { label: "Good", color: "#715A5A", dim: "rgba(113,90,90,0.18)" };
    if (score >= 4) return { label: "Needs Work", color: "#d4a843", dim: "rgba(212,168,67,0.15)" };
    return { label: "Poor", color: "#e07070", dim: "rgba(224,112,112,0.15)" };
};

// ── Score Ring ────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
    const max = 10;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;

    const safeScore = Number(score) || 0;
    const safeMax = Number(max) || 100;

    const filled =
        (Math.min(safeScore, safeMax) / safeMax) * circumference;
    const cfg = getScoreConfig(safeScore);

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Track */}
                    <circle cx="60" cy="60" r={radius}
                        fill="none" stroke="rgba(211,218,217,0.07)" strokeWidth="8" />
                    {/* Filled arc */}
                    <circle cx="60" cy="60" r={radius}
                        fill="none"
                        stroke={cfg?.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - filled}
                        style={{
                            filter: `drop-shadow(0 0 6px ${cfg?.color}80)`,
                            transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)",
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                    <span className="text-4xl font-bold leading-none" style={{ color: "#D3DAD9" }}>
                        {score}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(211,218,217,0.4)" }}>
                        / 10
                    </span>
                </div>
            </div>

            {/* Score label badge */}
            <span
                className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest"
                style={{ background: cfg?.dim, color: cfg?.color, border: `1px solid ${cfg?.color}40` }}
            >
                {cfg?.label}
            </span>
        </div>
    );
};

// ── Section Card ──────────────────────────────────────────────
// Reusable card for strengths, weaknesses, feedback sections.
const SectionCard = ({ icon, title, items, accentColor, bgColor, index }) => (
    <div
        className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl section-card"
        style={{
            background: "#44444E",
            border: "1px solid rgba(211,218,217,0.08)",
            animationDelay: `${index * 120}ms`,
        }}
    >
        {/* Section header */}
        <div className="flex items-center gap-3">
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bgColor, border: `1px solid ${accentColor}40` }}
            >
                {icon}
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: accentColor }}>
                {title}
            </h3>
            <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: bgColor, color: accentColor }}
            >
                {items?.length}
            </span>
        </div>

        {/* Items list */}
        <ul className="flex flex-col gap-2.5">
            {items?.map((item, i) => (
                <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "rgba(211,218,217,0.75)" }}
                >
                    {/* Bullet dot */}
                    <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                        style={{ background: accentColor }}
                    />
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

// ── Icons ─────────────────────────────────────────────────────
const StrengthIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
        fill="none" viewBox="0 0 24 24" stroke="#7acea0" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WeaknessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
        fill="none" viewBox="0 0 24 24" stroke="#e07070" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2
               2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
);

const FeedbackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
        fill="none" viewBox="0 0 24 24" stroke="#715A5A" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2
               2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

// ── Background blobs ──────────────────────────────────────────
const Blobs = () => (
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
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MockInterviewReport({
    onRetry,
    onHome,
}) {
    const { mockInterviewId } = useParams()

    const { InterviewReport, mockInterview, mockInterviewLoading } = useMockInterview()

    const { overallScore, strengths, weaknesses, feedback, userId } = mockInterview || {};
    const cfg = getScoreConfig(overallScore)


    useEffect(() => {
        InterviewReport(mockInterviewId)
    }, [])


    if (mockInterviewLoading && !mockInterview) {
        return (
            <main>
                {mockInterviewLoading && (
                    <PageLoader label="Fetching your Mock Interview Questions..." />
                )}
            </main>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center
                       px-4 py-10 sm:py-14 gap-8 overflow-hidden relative"
            style={{ background: "#37353E" }}
        >
            <Blobs />

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="w-full max-w-3xl z-10 report-fade">
                <div className="flex flex-col sm:flex-row sm:items-center
                                justify-between gap-4">

                    {/* Left: back + title */}
                    <div className="flex flex-col gap-1">
                        {/* Back button */}
                        {onHome && (
                            <button
                                type="button"
                                onClick={onHome}
                                className="flex items-center gap-1.5 text-xs
                                           cursor-pointer hover:opacity-70
                                           transition-opacity duration-200 w-fit mb-1"
                                style={{ color: "rgba(211,218,217,0.4)" }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5"
                                    fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </button>
                        )}
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight"
                            style={{ color: "#D3DAD9" }}>
                            Interview Report
                        </h1>
                        <p className="text-sm" style={{ color: "rgba(211,218,217,0.45)" }}>
                            {userId?.username
                                ? `${userId?.username}'s performance summary`
                                : "Your performance summary"}
                        </p>
                    </div>

                    {/* Right: retry button */}
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                                       text-sm font-semibold cursor-pointer w-fit
                                       transition-all duration-300
                                       hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: "#715A5A",
                                color: "#D3DAD9",
                                boxShadow: "0 4px 20px rgba(113,90,90,0.32)",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                fill="none" viewBox="0 0 24 24"
                                stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582
                                       9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0
                                       01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry Interview
                        </button>
                    )}
                </div>
            </div>

            {/* ── Score hero card ─────────────────────────────────── */}
            <div
                className="w-full max-w-3xl z-10 rounded-2xl p-6 sm:p-8
                           shadow-2xl report-fade"
                style={{
                    background: "#44444E",
                    border: "1px solid rgba(211,218,217,0.08)",
                    animationDelay: "80ms",
                }}
            >
                {/* Mobile: stacked | sm+: ring left, text right */}
                <div className="flex flex-col sm:flex-row items-center gap-8">

                    {/* Score ring */}
                    <div className="flex-shrink-0">
                        <ScoreRing score={overallScore} />
                    </div>

                    {/* Divider — vertical on sm+, horizontal on mobile */}
                    <div
                        className="w-full sm:w-px sm:h-32 h-px"
                        style={{ background: "rgba(211,218,217,0.08)" }}
                    />

                    {/* Score breakdown text */}
                    <div className="flex flex-col gap-4 flex-1 w-full">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-1"
                                style={{ color: "rgba(211,218,217,0.4)" }}>
                                Overall Performance
                            </p>
                            <p className="text-lg font-bold" style={{ color: "#D3DAD9" }}>
                                {cfg?.label}
                            </p>
                        </div>

                        {/* Stat pills row */}
                        <div className="flex flex-wrap gap-2">
                            <StatPill
                                label="Strengths"
                                value={strengths?.length}
                                color="#7acea0"
                                bg="rgba(122,206,160,0.1)"
                            />
                            <StatPill
                                label="Weaknesses"
                                value={weaknesses?.length}
                                color="#e07070"
                                bg="rgba(224,112,112,0.1)"
                            />
                            <StatPill
                                label="Feedback"
                                value={feedback?.length}
                                color="#715A5A"
                                bg="rgba(113,90,90,0.18)"
                            />
                        </div>

                        {/* Score bar */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-xs" style={{ color: "rgba(211,218,217,0.4)" }}>
                                    Score
                                </span>
                                <span className="text-xs font-mono font-semibold"
                                    style={{ color: cfg?.color }}>
                                    {overallScore} / 10
                                </span>
                            </div>
                            <div
                                className="w-full h-2 rounded-full overflow-hidden"
                                style={{ background: "rgba(211,218,217,0.08)" }}
                            >
                                <div
                                    className="h-full rounded-full score-bar-fill"
                                    style={{
                                        width: `${(overallScore / 10) * 100}%`,
                                        background: cfg?.color,
                                        boxShadow: `0 0 8px ${cfg?.color}80`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sections grid ────────────────────────────────────── */}
            {/* Mobile: 1 col | md+: 2 col (strengths + weaknesses side by side) */}
            <div className="w-full max-w-3xl z-10 flex flex-col gap-4">

                {/* Top row: Strengths + Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SectionCard
                        index={0}
                        icon={<StrengthIcon />}
                        title="Strengths"
                        items={strengths}
                        accentColor="#7acea0"
                        bgColor="rgba(122,206,160,0.1)"
                    />
                    <SectionCard
                        index={1}
                        icon={<WeaknessIcon />}
                        title="Weaknesses"
                        items={weaknesses}
                        accentColor="#e07070"
                        bgColor="rgba(224,112,112,0.1)"
                    />
                </div>

                {/* Bottom row: Feedback — full width */}
                <SectionCard
                    index={2}
                    icon={<FeedbackIcon />}
                    title="Feedback"
                    items={feedback}
                    accentColor="#715A5A"
                    bgColor="rgba(113,90,90,0.18)"
                />
            </div>

            {/* ── Bottom CTA row ────────────────────────────────────── */}
            <div className="w-full max-w-3xl z-10 flex flex-col sm:flex-row
                            items-stretch sm:items-center justify-end gap-3
                            report-fade"
                style={{ animationDelay: "400ms" }}
            >
                {onHome && (
                    <button
                        type="button"
                        onClick={onHome}
                        className="flex items-center justify-center gap-2 px-5 py-2.5
                                   rounded-xl text-sm font-medium cursor-pointer
                                   transition-all duration-200
                                   hover:opacity-80 active:scale-[0.98]"
                        style={{
                            background: "rgba(113,90,90,0.12)",
                            border: "1px solid rgba(113,90,90,0.25)",
                            color: "rgba(211,218,217,0.65)",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
                                   2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0
                                   011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </button>
                )}
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="flex items-center justify-center gap-2 px-6 py-2.5
                                   rounded-xl text-sm font-semibold cursor-pointer
                                   transition-all duration-300
                                   hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: "#715A5A",
                            color: "#D3DAD9",
                            boxShadow: "0 4px 20px rgba(113,90,90,0.32)",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                            fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582
                                   9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0
                                   01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Interview
                    </button>
                )}
            </div>

            <AnimStyles />
        </div>
    );
}

// ── Stat Pill ─────────────────────────────────────────────────
// Small pill badge showing a count + label in the score card.
const StatPill = ({ label, value, color, bg }) => (
    <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
        style={{ background: bg, border: `1px solid ${color}30`, color }}
    >
        <span className="font-bold">{value}</span>
        <span style={{ opacity: 0.8 }}>{label}</span>
    </div>
);

// ── Animations ────────────────────────────────────────────────
const AnimStyles = () => (
    <style>{`

        /* Page sections fade + slide up on mount */
        @keyframes reportFade {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0);    }
        }
        .report-fade {
            animation: reportFade 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Section cards stagger in */
        @keyframes sectionIn {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0);    }
        }
        .section-card {
            animation: sectionIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Score bar fills from left on mount */
        @keyframes barFill {
            from { width: 0%; }
            to   { /* width set via inline style */ }
        }
        .score-bar-fill {
            animation: barFill 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: 300ms;
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
            .report-fade, .section-card, .score-bar-fill { animation: none; }
        }
    `}</style>
);