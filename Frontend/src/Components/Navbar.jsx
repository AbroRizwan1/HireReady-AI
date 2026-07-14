import { useNavigate } from "react-router";
import { useAuth } from "../Features/auth/Hooks/useAuth";

// ============================================================
// Navbar.jsx  (feature: shared → components)
// Fully responsive top navigation bar.
//
// RESPONSIVE BEHAVIOR:
//   mobile  (<sm)  → logo icon only (text hidden), avatar only
//                    (username hidden), logout shrinks to icon-only
//   tablet  (sm+)  → logo text appears, username appears
//   desktop (md+)  → full spacing, divider visible
//
// COLOR PALETTE:
//   #D3DAD9 → light sage    → text
//   #715A5A → dusty rose    → accent
//   #44444E → dark slate    → navbar bg
//   #37353E → deep charcoal → icon bg
// ============================================================

const Navbar = () => {
  const { handleLogout, user, loading } = useAuth();
  const username = user?.user?.username;
  const navigate = useNavigate();

  return (
    // w-full so it stretches on mobile; max-w-5xl caps it on desktop
    <div className="w-full max-w-5xl z-10 home-card px-2 sm:px-0">
      <div
        className="flex items-center justify-between
                   px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl gap-2"
        style={{
          background: "#44444E",
          border:     "1px solid rgba(211,218,217,0.08)",
        }}
      >

        {/* ── Left: app logo + name ────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Logo icon — always visible, shrinks slightly on mobile */}
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center
                       justify-center flex-shrink-0"
            style={{ background: "#37353E", border: "1px solid rgba(113,90,90,0.45)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none" viewBox="0 0 24 24" stroke="#715A5A" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745
                   M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2
                   2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          {/* App name — truncates instead of wrapping on narrow screens */}
          <span
            className="text-xs sm:text-sm font-semibold truncate"
            style={{ color: "#D3DAD9" }}
          >
            HireReady AI
          </span>
        </div>

        {/* ── Right: user avatar + name + logout ──────────────── */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          {/* Avatar circle — visible on all screens */}
          {user && (
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center
                         justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: "rgba(113,90,90,0.35)",
                border:     "1px solid rgba(113,90,90,0.5)",
                color:      "#D3DAD9",
              }}
              title={username || "User"} // tooltip on hover, useful since name is hidden on mobile
            >
              {username?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}

          {/* Username — hidden below sm, truncates on md to avoid overflow */}
          {user && (
            <span
              className="hidden sm:block text-sm font-medium
                         max-w-[100px] md:max-w-[140px] truncate"
              style={{ color: "rgba(211,218,217,0.7)" }}
            >
              {username ?? "User"}
            </span>
          )}

          {/* Divider — only shown when there's both a username and logout button */}
          {user && (
            <div
              className="hidden sm:block w-px h-4 flex-shrink-0"
              style={{ background: "rgba(211,218,217,0.12)" }}
            />
          )}

          {/* ── Logout button ───────────────────────────────────
              Mobile  → icon only, square, no label (saves space)
              sm+     → icon + "Logout" label                      */}
          <button
            type="button"
            onClick={() => {
              handleLogout();
              navigate("/login");
            }}
            disabled={loading}
            className="flex items-center justify-center gap-1.5
                       w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5
                       rounded-lg text-xs font-medium cursor-pointer
                       transition-all duration-200 flex-shrink-0
                       hover:scale-[1.03] active:scale-[0.97]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(113,90,90,0.15)",
              border:     "1px solid rgba(113,90,90,0.3)",
              color:      "rgba(211,218,217,0.65)",
            }}
            aria-label="Logout"
          >
            {/* Logout icon — always visible */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0
                   01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>

            {/* Label — hidden on mobile to save space, icon alone is enough
                since the button itself is large enough to tap (w-8 h-8 = 32px) */}
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Navbar;