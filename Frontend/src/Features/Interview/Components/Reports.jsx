const ScoreRing = ({ score }) => {
    const r = 20;
    const circumference = 2 * Math.PI * r;
    const filled = ((score || 0) / 100) * circumference;

    // Color shifts: low → muted, mid → rose, high → bright rose
    const ringColor =
        score >= 75 ? "#715A5A" :
            score >= 45 ? "rgba(113,90,90,0.7)" :
                "rgba(113,90,90,0.4)";

    return (
        <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
                {/* Background track */}
                <circle
                    cx="25" cy="25" r={r}
                    fill="none"
                    stroke="rgba(211,218,217,0.08)"
                    strokeWidth="4"
                />
                {/* Filled arc */}
                <circle
                    cx="25" cy="25" r={r}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - filled}
                    style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
                />
            </svg>

            {/* Score number centered in ring */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="text-xs font-bold leading-none"
                    style={{ color: "#D3DAD9" }}
                >
                    {score ?? "--"}
                </span>
            </div>
        </div>
    );
};

// ── Calendar Icon ─────────────────────────────────────────────
const CalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7
         a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// ── Chevron Icon ──────────────────────────────────────────────
const ChevronIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 flex-shrink-0 transition-transform duration-200
               group-hover:translate-x-0.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);


// ============================================================
// MAIN COMPONENT
// ============================================================

const Reports = ({ title = "Untitled", date = "", score = null, onClick, onDelete }) => {

    // Score label: text shown below the ring
    const scoreLabel =
        score === null ? "No score" :
            score >= 75 ? "Strong match" :
                score >= 45 ? "Partial match" :
                    "Low match";

    // Score label color follows same thresholds as ring
    const scoreLabelColor =
        score >= 75 ? "#715A5A" :
            score >= 45 ? "rgba(113,90,90,0.7)" :
                "rgba(211,218,217,0.35)";

    return (
        <div className="relative group/card">

            {/* ── Delete button — appears on card hover ──────────────
            Positioned top-right, outside the main button so it
            doesn't trigger the card's onClick when clicked.     */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation(); // prevent card click firing
                    onDelete?.();
                }}
                className="absolute -top-2 -right-2 z-10
                       w-7 h-7 rounded-full flex items-center justify-center
                       cursor-pointer transition-all duration-200
                       opacity-0 group-hover/card:opacity-100
                       scale-75 group-hover/card:scale-100
                       hover:scale-110 active:scale-95"
                style={{
                    background: "rgba(180,70,70,0.85)",
                    border: "1px solid rgba(224,112,112,0.5)",
                    boxShadow: "0 2px 8px rgba(180,70,70,0.4)",
                }}
                aria-label="Delete"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5"
                    fill="none" viewBox="0 0 24 24"
                    stroke="#fff" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0
                       01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0
                       00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {/* ── Main card button ─────────────────────────────────── */}
            <button
                type="button"
                onClick={onClick}
                className="group w-full text-left rounded-2xl p-5
                       transition-all duration-300 cursor-pointer
                       hover:scale-[1.02] active:scale-[0.99]
                       analysis-card"
                style={{
                    background: "#44444E",
                    border: "1px solid rgba(211,218,217,0.09)",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
                }}
            >
                <div>
                    <div className="flex items-start justify-between gap-4">

                        {/* Left: title + date */}
                        <div className="flex flex-col gap-2 min-w-0 flex-1">

                            <p
                                className="text-sm font-semibold leading-snug truncate
                                       transition-colors duration-200 group-hover:text-white"
                                style={{ color: "#D3DAD9" }}
                            >
                                {title}
                            </p>

                            {date && (
                                <div className="flex items-center gap-1.5"
                                    style={{ color: "rgba(211,218,217,0.4)" }}>
                                    <CalendarIcon />
                                    <span className="text-xs">{date}</span>
                                </div>
                            )}

                            <span className="text-xs font-medium mt-1"
                                style={{ color: scoreLabelColor }}>
                                {scoreLabel}
                            </span>
                        </div>

                        {/* Right: score ring + chevron */}
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <ScoreRing score={score} />
                            {onClick && (
                                <span style={{ color: "rgba(211,218,217,0.25)" }}>
                                    <ChevronIcon />
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </button>
        </div>
    );
};

export default Reports;


// ── Preview (delete this export when integrating) ─────────────
export const AnalysisCardPreview = () => (
    <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: "#37353E" }}
    >
        <div className="w-full max-w-sm flex flex-col gap-3">

            {/* High score */}
            <AnalysisCard
                title="Senior Frontend Developer — Spotify"
                date="Jun 22, 2026"
                score={82}
                onClick={() => { }}
            />

            {/* Mid score */}
            <AnalysisCard
                title="React Engineer — Noon"
                date="Jun 18, 2026"
                score={58}
                onClick={() => { }}
            />

            {/* Low score */}
            <AnalysisCard
                title="Full Stack Developer — Rozee.pk"
                date="Jun 10, 2026"
                score={31}
                onClick={() => { }}
            />

            {/* No score yet */}
            <AnalysisCard
                title="Junior Developer — TechCorp"
                date="Jun 5, 2026"
                score={null}
                onClick={() => { }}
            />
        </div>

        <style>{`
      /* Card slides up on mount */
      @keyframes cardIn {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0);    }
      }
      .analysis-card {
        animation: cardIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
      }
      /* Border glow on hover */
      .analysis-card:hover {
        border-color: rgba(113,90,90,0.45) !important;
        box-shadow: 0 4px 24px rgba(113,90,90,0.18) !important;
      }
      @media (prefers-reduced-motion: reduce) {
        .analysis-card { animation: none; }
      }
    `}</style>
    </div>
);