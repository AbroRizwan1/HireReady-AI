
import { useState, useEffect, useRef, useCallback } from "react";
import Loader from "../../Interview/Components/Loading";

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function MockInterviewPage({
    currentIndex,
    setCurrentIndex,
    questions,
    mockInterviewLoading,
    onSubmit,
}) {


    // ── Session state ─────────────────────────────────────────
    const [answers, setAnswers] = useState(          // one answer per question
        () => Array(questions?.length).fill("")
    );
    const [answer, setAnswer] = useState("");      // current textarea value
    const [questionKey, setQuestionKey] = useState(0);       // increment to replay animation

    // ── Voice state ───────────────────────────────────────────
    const [isListening, setIsListening] = useState(false);   // mic active
    const [voiceSupported, setVoiceSupported] = useState(true);    // browser supports API
    const recognitionRef = useRef(null);       // SpeechRecognition instance

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex) / questions?.length) * 100;
    const isLastQuestion = currentIndex === (questions?.length ?? 1) - 1;


    // ── Web Speech API setup ──────────────────────────────────
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { setVoiceSupported(false); return; }

        const rec = new SR();
        rec.continuous = true;     // keep listening until manually stopped
        rec.interimResults = true;     // show partial results as user speaks
        rec.lang = "en-US";

        rec.onresult = (e) => {
            // Combine all result segments into one string
            let transcript = "";
            for (let i = e.resultIndex; i < e.results?.length; i++) {
                transcript += e.results[i][0].transcript;
            }
            // Append to existing answer (don't overwrite what was typed)
            setAnswer((prev) => {
                const base = prev.trimEnd();
                return base ? base + " " + transcript : transcript;
            });
        };

        rec.onend = () => {
            // Only mark as not listening if we didn't manually restart
            setIsListening(false);
        };

        rec.onerror = () => setIsListening(false);

        recognitionRef.current = rec;
        return () => rec.abort();
    }, []);

    // ── Toggle voice ──────────────────────────────────────────
    const toggleVoice = useCallback(() => {
        const rec = recognitionRef.current;
        if (!rec) return;

        if (isListening) {
            rec.stop();
            setIsListening(false);
        } else {
            try {
                rec.start();
                setIsListening(true);
            } catch {
                // already started — ignore
            }
        }
    }, [isListening]);


    // ── Submit answer and advance ─────────────────────────────
    const handleSubmit = useCallback(async () => {

        if (!answer.trim()) return;

        await onSubmit?.({
            questionIndex: currentIndex,
            answer,
        });

        const updated = [...answers];
        updated[currentIndex] = answer;
        setAnswers(updated);

        if (currentIndex < questions?.length - 1) {
            setCurrentIndex((i) => {
                return i + 1;
            });

            setAnswer("");
            setQuestionKey((k) => k + 1);
        }
    }, [answer, currentIndex, answers, questions?.length, onSubmit]);


    // ── Skip (for dev/testing) ────────────────────────────────
    const handleSkip = async () => {

        await onSubmit?.({
            questionIndex: currentIndex,
            answer: "",
        });

        const updated = [...answers];
        updated[currentIndex] = answer;
        setAnswers(updated);

        if (currentIndex < questions?.length - 1) {
            setCurrentIndex((i) => i + 1);
            setAnswer("");
            setQuestionKey((k) => k + 1);
        } else {
            onSubmit?.(updated);
        }

    };

    // ============================================================
    // MAIN INTERVIEW UI
    // ============================================================
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center
                 px-4 py-10 relative overflow-hidden gap-6"
            style={{ background: "#37353E" }}
        >
            <Blobs />

            {/* ── Top progress bar + counter ─────────────────────── */}
            <div className="w-full max-w-2xl z-10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: "rgba(211,218,217,0.45)" }}>
                        Question {currentIndex + 1} of {questions?.length}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#715A5A" }}>
                        {Math.round(progress)}% done
                    </span>
                </div>

                {/* Progress track */}
                <div
                    className="w-full h-1 rounded-full overflow-hidden"
                    style={{ background: "rgba(211,218,217,0.08)" }}
                >
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                            width: `${progress}%`,
                            background: "#715A5A",
                            boxShadow: "0 0 6px rgba(113,90,90,0.6)",
                        }}
                    />
                </div>
            </div>

            {/* ── Main card ──────────────────────────────────────── */}
            <div
                className="relative w-full max-w-2xl rounded-2xl p-6 sm:p-8
                   shadow-2xl z-10 interview-card flex flex-col gap-6"
                style={{
                    background: "#44444E",
                    border: "1px solid rgba(211,218,217,0.08)",
                }}
            >

                {/* ── Question section ──────────────────────────────── */}
                <div className="flex flex-col gap-3">

                    {/* Question badge */}
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center
                         text-xs font-bold flex-shrink-0"
                            style={{ background: "rgba(113,90,90,0.35)", color: "#D3DAD9" }}
                        >
                            {currentIndex + 1}
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "#715A5A" }}>
                            Interview Question
                        </span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div
                            key={questionKey}
                            className="rounded-xl px-4 py-4 min-h-[80px] sm:min-h-[72px]
                                   overflow-hidden question-slide"
                            style={{
                                background: "#37353E",
                                border: "1px solid rgba(211,218,217,0.07)"
                            }}
                        >
                            <p
                                className="text-sm sm:text-base font-medium leading-relaxed
                                       typewriter-text whitespace-pre-wrap"
                                style={{
                                    color: "#D3DAD9",
                                    // CSS variable: number of characters drives animation steps
                                    "--chars": currentQuestion?.length,
                                    // Duration = chars × 28ms so speed matches old JS version
                                    "--duration": `${currentQuestion?.length * 28}ms`,
                                }}
                            >
                                {currentQuestion}
                            </p>
                        </div>
                    </div>


                </div>

                {/* ── Answer textarea ───────────────────────────────── */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "rgba(211,218,217,0.5)" }}>
                        Your Answer
                    </label>

                    <div
                        className="rounded-xl border transition-all duration-300"
                        style={{
                            borderColor: isListening ? "#715A5A" : "rgba(211,218,217,0.1)",
                            boxShadow: isListening ? "0 0 0 3px rgba(113,90,90,0.22)" : "none",
                            background: "#37353E",
                        }}
                    >
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder={
                                isListening
                                    ? "Listening… speak your answer"
                                    : "Type your answer here, or press the mic to speak…"
                            }
                            rows={5}
                            className="w-full bg-transparent px-4 py-3 text-sm outline-none
                                       resize-none placeholder:opacity-30 leading-relaxed"
                            style={{ color: "#D3DAD9" }}
                        />
                    </div>

                    {/* Voice status indicator */}
                    {isListening && (
                        <div className="flex items-center gap-2 px-1 voice-pulse-row">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="rounded-full voice-bar"
                                    style={{
                                        width: "3px",
                                        background: "#715A5A",
                                        animationDelay: `${i * 90}ms`,
                                        boxShadow: "0 0 4px rgba(113,90,90,0.6)",
                                    }}
                                />
                            ))}
                            <span className="text-xs ml-1" style={{ color: "#715A5A" }}>
                                Listening…
                            </span>
                        </div>
                    )}
                </div>

                {/* ── Action buttons ────────────────────────────────── */}
                {/* Mobile: stacked full-width | sm+: row, submit right-aligned */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center
                        justify-between gap-3">

                    {/* Left side: Voice + Skip */}
                    <div className="flex items-center gap-2">

                        {/* Voice button — only shown if browser supports it */}
                        {voiceSupported && (
                            <button
                                type="button"
                                onClick={toggleVoice}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                           text-sm font-medium cursor-pointer flex-shrink-0
                           transition-all duration-200
                           hover:scale-[1.02] active:scale-[0.97]"
                                style={{
                                    background: isListening
                                        ? "rgba(113,90,90,0.35)"
                                        : "rgba(113,90,90,0.15)",
                                    border: isListening
                                        ? "1px solid rgba(113,90,90,0.6)"
                                        : "1px solid rgba(113,90,90,0.3)",
                                    color: "#D3DAD9",
                                    boxShadow: isListening
                                        ? "0 0 12px rgba(113,90,90,0.35)"
                                        : "none",
                                }}
                                aria-label={isListening ? "Stop recording" : "Start voice input"}
                            >
                                {isListening ? (
                                    /* Stop icon */
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <rect x="6" y="6" width="12" height="12" rx="2"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    /* Mic icon */
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4
                         M12 15V3m0 0a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3z" />
                                    </svg>
                                )}
                                <span className="hidden xs:inline">
                                    {isListening ? "Stop" : "Voice"}
                                </span>
                            </button>
                        )}

                        {/* Skip button — text only, subtle */}
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer
                         transition-all duration-200 hover:opacity-70"
                            style={{ color: "rgba(211,218,217,0.35)" }}
                        >
                            Skip →
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!answer?.trim()}
                        className="flex items-center justify-center gap-2
                                   w-full sm:w-auto px-6 py-2.5 rounded-xl
                                   text-sm font-semibold cursor-pointer
                                   transition-all duration-300
                                   hover:scale-[1.02] active:scale-[0.98]
                                   disabled:opacity-40 disabled:cursor-not-allowed
                                   disabled:hover:scale-100"
                        style={{
                            background: "#715A5A",
                            color: "#D3DAD9",
                            boxShadow: "0 4px 20px rgba(113,90,90,0.32)",
                        }}
                    >
                        {isLastQuestion ? (
                            // Last question — show Generate Report
                            <>

                                {mockInterviewLoading ? (
                                    <div className="flex gap-1.5">
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                        </svg>
                                        Generating
                                    </div>

                                ) :
                                    (
                                        <div className="flex gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0
                                           012-2h5.586a1 1 0 01.707.293l5.414 5.414a1
                                           1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>Generate Report</span>
                                        </div>

                                    )}
                            </>
                        ) : (
                            // All other questions — show Submit Answer
                            <>
                                <span>Submit Answer</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                    </button>

                </div>

            </div>

            {/* ── Dot navigation ─────────────────────────────────── */}
            <div className="flex items-center gap-2 z-10">
                {questions?.map((_, i) => (
                    <div
                        key={i}
                        className="rounded-full transition-all duration-300"
                        style={{
                            width: i === currentIndex ? "20px" : "6px",
                            height: "6px",
                            background: i < currentIndex
                                ? "#715A5A"
                                : i === currentIndex
                                    ? "#715A5A"
                                    : "rgba(211,218,217,0.15)",
                            boxShadow: i === currentIndex
                                ? "0 0 6px rgba(113,90,90,0.6)"
                                : "none",
                            opacity: i > currentIndex ? 0.4 : 1,
                        }}
                    />
                ))}
            </div>

            <AnimStyles />
        </div>
    );
}

// ── Background blobs — same as other pages ────────────────────
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

// ── All keyframe animations ───────────────────────────────────
const AnimStyles = () => (
    <style>{`

    /* Card slides up on mount */
    @keyframes cardEntrance {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    .interview-card {
      animation: cardEntrance 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* Question box slides in from right on each new question */
    @keyframes questionSlide {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0);    }
    }
    .question-slide {
      animation: questionSlide 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* Blinking cursor while typewriter runs */
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0; }
    }
    .cursor-blink {
      animation: cursorBlink 0.7s ease-in-out infinite;
    }

    /* Voice bars — animated equaliser when mic is active */
    @keyframes voiceBar {
      0%, 100% { height: 4px;  }
      50%       { height: 16px; }
    }
    .voice-bar {
      animation: voiceBar 0.7s ease-in-out infinite;
      min-height: 4px;
    }

    /* Finish screen fades + scales in */
    @keyframes finishAppear {
      from { opacity: 0; transform: scale(0.92); }
      to   { opacity: 1; transform: scale(1);    }
    }
    .finish-appear {
      animation: finishAppear 0.45s ease-out both;
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      .interview-card, .question-slide,
      .cursor-blink, .voice-bar,
      .finish-appear { animation: none; }
    }
  `}</style>
);