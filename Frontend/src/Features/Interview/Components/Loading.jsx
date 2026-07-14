// ============================================================
// Loader.jsx  (feature: shared → components)
//
// EXPORTS:
//   Loader      → default — small inline spinner (buttons, cards)
//   PageLoader  → centered full-section loader with animations
//
// USAGE:
//   import Loader, { PageLoader } from "./Loader";
//
//   // Inline — inside buttons
//   <button disabled={loading}>
//     {loading ? <Loader /> : "Submit"}
//   </button>
//
//   // Section loading state
//   {loading && <PageLoader label="Fetching your reports…" />}
//
// COLOR PALETTE:
//   #D3DAD9 → light sage    → text, labels
//   #715A5A → dusty rose    → spinner accent
//   #44444E → dark slate    → background elements
//   #37353E → deep charcoal → track / ring base
// ============================================================


// ============================================================
// DEFAULT EXPORT — Loader
// Compact spinning arc — use inside buttons, cards, or rows.
//
// Props:
//   size  → "sm" | "md" | "lg"   (default "md")
//   label → string | null         (optional text beside spinner)
// ============================================================

const Loader = ({ size = "md", label = null }) => {

    // Ring dimensions per size
    const config = {
        sm: { box: 16, r: 6, stroke: 2, gap: "gap-1.5", text: "text-xs" },
        md: { box: 22, r: 9, stroke: 2.5, gap: "gap-2", text: "text-sm" },
        lg: { box: 30, r: 12, stroke: 3, gap: "gap-2.5", text: "text-sm" },
    }[size] || { box: 22, r: 9, stroke: 2.5, gap: "gap-2", text: "text-sm" };

    const circ = 2 * Math.PI * config.r;

    return (
        <span
            className={`inline-flex items-center ${config.gap}`}
            role="status"
            aria-label={label || "Loading"}
        >
            <svg
                width={config.box}
                height={config.box}
                viewBox={`0 0 ${config.box} ${config.box}`}
                fill="none"
                className="loader-spin"
                aria-hidden="true"
            >
                {/* Faint track ring */}
                <circle
                    cx={config.box / 2} cy={config.box / 2} r={config.r}
                    stroke="rgba(211,218,217,0.12)"
                    strokeWidth={config.stroke}
                />
                {/* Glowing arc — 70% filled */}
                <circle
                    cx={config.box / 2} cy={config.box / 2} r={config.r}
                    stroke="#715A5A"
                    strokeWidth={config.stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${circ * 0.7} ${circ * 0.3}`}
                    style={{ filter: "drop-shadow(0 0 3px rgba(113,90,90,0.7))" }}
                />
            </svg>

            {label && (
                <span className={config.text} style={{ color: "rgba(211,218,217,0.5)" }}>
                    {label}
                </span>
            )}

            <style>{`
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        .loader-spin {
          animation: loaderSpin 0.85s linear infinite;
          transform-origin: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .loader-spin { animation: none; }
        }
      `}</style>
        </span>
    );
};

export default Loader;


// ============================================================
// PageLoader
// Stylish full-section loader — centered inside its container.
//
// ============================================================

export const PageLoader = ({ label = "Loading…" }) => (
    <div
    
        style={{ background: "#44444E" }}
        className="flex flex-col items-center justify-center h-screen gap-6 w-full py-24"
        role="status"
        aria-label={label}
    >
        {/* ── Layered ring animation ───────────────────────────── */}
        <div className="relative flex items-center justify-center w-24 h-24">

            {/* Ring 3 — outermost slow pulse */}
            <div
                className="absolute inset-0 rounded-full pl-ring-3"
                style={{ border: "1px solid rgba(113,90,90,0.15)" }}
            />

            {/* Ring 2 — mid pulse */}
            <div
                className="absolute rounded-full pl-ring-2"
                style={{
                    inset: "10px",
                    border: "1px solid rgba(113,90,90,0.28)",
                }}
            />

            {/* Arc 1 — outer rotating arc, clockwise */}
            <svg
                className="absolute inset-0 w-full h-full pl-spin-cw"
                viewBox="0 0 96 96"
                fill="none"
                aria-hidden="true"
            >
                <circle cx="48" cy="48" r="42"
                    stroke="rgba(211,218,217,0.06)" strokeWidth="3" />
                <circle cx="48" cy="48" r="42"
                    stroke="#715A5A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="88 176"
                    style={{ filter: "drop-shadow(0 0 4px rgba(113,90,90,0.6))" }}
                />
            </svg>

            {/* Arc 2 — inner rotating arc, counter-clockwise */}
            <svg
                className="absolute pl-spin-ccw"
                style={{ inset: "14px", position: "absolute" }}
                viewBox="0 0 68 68"
                fill="none"
                aria-hidden="true"
            >
                <circle cx="34" cy="34" r="28"
                    stroke="rgba(211,218,217,0.05)" strokeWidth="2.5" />
                <circle cx="34" cy="34" r="28"
                    stroke="rgba(113,90,90,0.6)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="52 124"
                    style={{ filter: "drop-shadow(0 0 3px rgba(113,90,90,0.4))" }}
                />
            </svg>

            {/* Center breathing dot */}
            <div
                className="relative z-10 w-3 h-3 rounded-full pl-dot"
                style={{
                    background: "#715A5A",
                    boxShadow: "0 0 8px 2px rgba(113,90,90,0.55)",
                }}
            />
        </div>

        {/* ── Label + typing dots ──────────────────────────────── */}
        <div className="flex flex-col items-center gap-2.5">
            <p
                className="text-sm font-medium tracking-wide"
                style={{ color: "rgba(211,218,217,0.6)" }}
            >
                {label}
            </p>

            {/* Three bouncing dots */}
            <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <span
                        key={i}
                        className="w-1 h-1 rounded-full pl-bounce"
                        style={{
                            background: "#715A5A",
                            animationDelay: `${i * 150}ms`,
                            boxShadow: "0 0 4px rgba(113,90,90,0.6)",
                        }}
                    />
                ))}
            </div>
        </div>

        {/* ── Keyframe animations ─────────────────────────────── */}
        <style>{`

      /* Outer arc — clockwise */
      @keyframes spinCW {
        from { transform: rotate(0deg);   }
        to   { transform: rotate(360deg); }
      }
      .pl-spin-cw {
        animation: spinCW 2s linear infinite;
        transform-origin: center;
      }

      /* Inner arc — counter-clockwise, slightly faster */
      @keyframes spinCCW {
        from { transform: rotate(0deg);    }
        to   { transform: rotate(-360deg); }
      }
      .pl-spin-ccw {
        animation: spinCCW 1.4s linear infinite;
        transform-origin: center;
      }

      /* Outer ring — slow pulse */
      @keyframes ringPulse3 {
        0%, 100% { transform: scale(1);    opacity: 0.7; }
        50%       { transform: scale(1.08); opacity: 0.2; }
      }
      .pl-ring-3 {
        animation: ringPulse3 2.4s ease-in-out infinite;
      }

      /* Mid ring — offset pulse */
      @keyframes ringPulse2 {
        0%, 100% { transform: scale(1);    opacity: 0.8; }
        50%       { transform: scale(1.06); opacity: 0.3; }
      }
      .pl-ring-2 {
        animation: ringPulse2 2.4s ease-in-out infinite;
        animation-delay: 300ms;
      }

      /* Center dot breathes in and out */
      @keyframes dotBreath {
        0%, 100% { transform: scale(1);   opacity: 1;   }
        50%       { transform: scale(1.6); opacity: 0.5; }
      }
      .pl-dot {
        animation: dotBreath 1.4s ease-in-out infinite;
      }

      /* Typing dots bounce up one at a time */
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
        30%            { transform: translateY(-5px); opacity: 1;   }
      }
      .pl-bounce {
        animation: bounce 1.2s ease-in-out infinite;
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        .pl-spin-cw, .pl-spin-ccw,
        .pl-ring-3, .pl-ring-2,
        .pl-dot, .pl-bounce { animation: none; }
      }
    `}</style>
    </div>
);