
import { createContext, useContext, useState, useCallback } from "react";

// ── Internal context — do not import directly ─────────────────
const ToastContext = createContext(null);

// ── Type config ───────────────────────────────────────────────
// Each type defines its icon path, accent color, and bg tint.

const TYPE_CONFIG = {
    success: {
        color: "#715A5A",
        bg: "rgba(113,90,90,0.18)",
        border: "rgba(113,90,90,0.4)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        ),
    },
    error: {
        color: "#e07070",
        bg: "rgba(180,70,70,0.18)",
        border: "rgba(180,70,70,0.4)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
    },
    warning: {
        color: "#d4a843",
        bg: "rgba(180,140,50,0.18)",
        border: "rgba(180,140,50,0.4)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71
             3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
        ),
    },
    info: {
        color: "#7aaed4",
        bg: "rgba(70,120,180,0.18)",
        border: "rgba(70,120,180,0.4)",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
};

// ── Single Toast Item ──────────────────────────────────────────
// Renders one notification. Handles its own enter/exit animation
// by tracking an `exiting` flag set just before removal.

const ToastItem = ({ toast, onRemove }) => {
    const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;

    return (
        <div
            className={`toast-item ${toast.exiting ? "toast-exit" : "toast-enter"}
                  flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg
                  w-full max-w-sm pointer-events-auto`}
            style={{
                background: "#44444E",
                border: `1px solid ${config.border}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            }}
            role="alert"
            aria-live="polite"
        >
            {/* Type icon */}
            <div
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                style={{ background: config.bg, color: config.color }}
            >
                {config.icon}
            </div>

            {/* Message */}
            <p
                className="flex-1 text-sm leading-snug pt-0.5"
                style={{ color: "#D3DAD9" }}
            >
                {toast.message}
            </p>

            {/* Dismiss button */}
            <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 w-5 h-5 flex items-center justify-center
                   rounded-md transition-opacity duration-150 hover:opacity-70
                   cursor-pointer mt-0.5"
                style={{ color: "rgba(211,218,217,0.4)" }}
                aria-label="Dismiss"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress bar — shrinks from full to zero over toast duration */}
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden"
            >
                <div
                    className="h-full toast-progress"
                    style={{
                        background: config.color,
                        animationDuration: `${toast.duration}ms`,
                    }}
                />
            </div>
        </div>
    );
};


// ============================================================
// ToastContainer
// Place this ONCE in your app root (App.jsx or main.jsx).
// It renders all active toasts in the bottom-right corner.
// On mobile it shifts to bottom-center for better thumb reach.
// ============================================================

export const ToastContainer = () => {
    const context = useContext(ToastContext);

    // Guard: reminds developer if container is used without provider
    if (!context) {
        console.warn("ToastContainer must be inside <ToastProvider>");
        return null;
    }

    const { toasts, removeToast } = context;

    return (
        <>
            {/* Toast stack — fixed, bottom-right on md+, bottom-center on mobile */}
            <div
                className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6
                   flex flex-col gap-2 z-[9999] pointer-events-none
                   w-[calc(100vw-2rem)] sm:w-auto"
                aria-label="Notifications"
            >
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>

            {/* ── Keyframe animations ─────────────────────────────── */}
            <style>{`

        /* Slide in from the right on desktop, up from bottom on mobile */
        @keyframes toastEnter {
          from {
            opacity: 0;
            transform: translateX(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @media (max-width: 640px) {
          @keyframes toastEnter {
            from { opacity: 0; transform: translateY(16px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
          }
        }
        .toast-enter {
          animation: toastEnter 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
          position: relative;
        }

        /* Slide out to the right when dismissed */
        @keyframes toastExit {
          from { opacity: 1; transform: translateX(0)    scale(1);    }
          to   { opacity: 0; transform: translateX(24px) scale(0.95); }
        }
        @media (max-width: 640px) {
          @keyframes toastExit {
            from { opacity: 1; transform: translateY(0)    scale(1);    }
            to   { opacity: 0; transform: translateY(16px) scale(0.95); }
          }
        }
        .toast-exit {
          animation: toastExit 0.25s ease-in both;
          position: relative;
        }

        /* Progress bar shrinks left to right over the toast duration */
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%;   }
        }
        .toast-progress {
          animation: toastProgress linear both;
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .toast-enter, .toast-exit { animation: none; }
          .toast-progress           { animation: none; }
        }
      `}</style>
        </>
    );
};


// ============================================================
// ToastProvider
// Wrap your app with this in main.jsx or App.jsx:
//
//   import { ToastProvider, ToastContainer } from "./Toast";
//
//   <ToastProvider>
//     <App />
//     <ToastContainer />
//   </ToastProvider>
// ============================================================

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    // removeToast — immediately removes toast from state
    const removeToast = useCallback((id) => {
        // Step 1: mark as exiting so exit animation plays
        setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
        );
        // Step 2: remove from DOM after animation completes (250ms)
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 260);
    }, []);

    // showToast — adds a new toast and auto-dismisses after duration
    const showToast = useCallback(
        (message, type = "info", duration = 4000) => {
            const id = Date.now() + Math.random(); // unique id

            setToasts((prev) => [
                ...prev,
                { id, message, type, duration, exiting: false },
            ]);

            // Auto-dismiss after duration
            setTimeout(() => removeToast(id), duration);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};


// ============================================================
// useToast
// Call inside any component to get showToast.
//
//   const { showToast } = useToast();
//   showToast("Done!", "success");
//   showToast("Error!", "error");
//   showToast("Heads up", "warning");
//   showToast("FYI", "info");
//   showToast("Custom duration", "success", 8000); // 8 seconds
// ============================================================

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside <ToastProvider>");
    return { showToast: context.showToast };
};