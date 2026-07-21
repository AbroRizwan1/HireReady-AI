// ============================================================
// useInterview.js  (feature: interview → hooks)
// Manages all state and logic for the Interview page.
// UI code → InterviewPage.jsx
//
// Usage in InterviewPage.jsx:
//   import useInterview from "../hooks/useInterview";
//   const { activeTab, openCard, toggleCard, ... } = useInterview();
// ============================================================

import { useState } from "react";

const useInterview = ({
  technicalQuestions = [],
  behavioralQuestions = [],
  skillGaps = [],
  preparationPlan = [],
  matchScore = null,
} = {}) => {
  // ── Tab State ──────────────────────────────────────────────
  // Controls which panel is shown in the center column.
  // "technical" | "behavioral" | "roadmap"
  const [activeTab, setActiveTab] = useState("technical");

  // ── Accordion State ────────────────────────────────────────
  // Tracks which question card is expanded.
  // Key format: "technical-0", "behavioral-2", etc.
  // Only one card can be open at a time.
  const [openCard, setOpenCard] = useState(null);

  // ── Tab definitions ────────────────────────────────────────
  // Drives both the sidebar buttons and the center panel heading.
  const tabs = [
    { id: "technical", label: "Technical Q" },
    { id: "behavioral", label: "Behavioral Q" },
    { id: "roadmap", label: "Road Map" },
  ];

  // ── Tab Switch Handler ─────────────────────────────────────
  // Switching tabs also collapses any open question card so
  // the new tab always starts with everything closed.
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setOpenCard(null); // collapse open card on tab switch
  };

  // ── Accordion Toggle Handler ───────────────────────────────
  // If the clicked card is already open → close it.
  // If a different card is clicked → open it (closes the previous one).
  const toggleCard = (key) => {
    setOpenCard((prev) => (prev === key ? null : key));
  };

  // ── Derived: active questions list ────────────────────────
  // Returns the correct array based on the active tab.
  // Roadmap tab uses preparationPlan directly in the UI.
  const activeQuestions =
    activeTab === "technical"
      ? technicalQuestions
      : activeTab === "behavioral"
        ? behavioralQuestions
        : [];

  // ── Return everything InterviewPage.jsx needs ──────────────
  return {
    // tab state
    activeTab,
    tabs,
    handleTabChange,
    // accordion state
    openCard,
    toggleCard,
    // derived
    activeQuestions,
    // pass-through data (so InterviewPage only imports useInterview)
    skillGaps,
    preparationPlan,
    matchScore,
  };
};

export default useInterview;
