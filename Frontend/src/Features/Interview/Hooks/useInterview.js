import { useEffect, useContext, useState } from "react";
import { useToast } from "../../../Share/Toster/Toster";
import { InterviewContext } from "../InterviewContext";
import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
  // generateResumePdf,
  deletInterviewReportApi,
} from "../services/InterviewApi";

import { useNavigate, useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { showToast } = useToast();

  const [resumeLoader, setResumeLoader] = useState();
  const [error, setError] = useState(null); // validation or server error
  const { interviewId } = useParams();
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    resume,
    jobDescription,
    selfDescription,
  }) => {
    setLoading(true);

    try {
      const response = await generateInterviewReport({
        resume,
        jobDescription,
        selfDescription,
      });

      setReport(response?.interviewReport);
      showToast("Interview report generated successfully.", "success");
      return response?.interviewReport;
    } catch (error) {
      if (error.response) {
        setError(error.response?.data?.message);
      } else if (error.request) {
        showToast("Unable to connect to server. Please try again", "error");
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewId) => {
    setLoading(true);

    try {
      const response = await getInterviewReportById(interviewId);

      setReport(response?.interviewReport);

      return response?.interviewReport;
    } catch (error) {
      if (error.response) {
        setError(error.response?.data?.message);
      } else if (error.request) {
        showToast("Unable to connect to server. please try again", "error");
      } else {
        showToast("Something went wrong.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);

    try {
      const response = await getAllInterviewReports();

      setReports(response?.interviewReports);

      return response?.interviewReports;
    } catch (error) {
      if (error.response) {
        showToast(
          error.response?.data?.message || "Failed to load reports.",
          "error",
        );
      } else if (error.request) {
        showToast("Unable to connect to server.", "error");
      } else {
        showToast("Something went wrong.", "error");
      }
    } finally {
      setLoading(false);
    }
  };


  // const getResumePdf = async (interviewReportId) => {
  //   setResumeLoader(true);

  //   try {
  //     const response = await generateResumePdf(interviewReportId);

  //     const url = window.URL.createObjectURL(
  //       new Blob([response], { type: "application/pdf" }),
  //     );

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `resume_${interviewReportId}.pdf`;

  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();

  //     window.URL.revokeObjectURL(url);

  //     showToast("Resume downloaded successfully.", "success");

  //   } catch (error) {
  //     if (error.response) {
  //       showToast(
  //         error.response?.data?.message || "Failed to download resume.",
  //         "error",
  //       );
  //     } else if (error.request) {
  //       showToast("Unable to connect to server.", "error");
  //     } else {
  //       showToast("Something went wrong.", "error");
  //     }
  //   } finally {
  //     setResumeLoader(false);
  //   }
  // };

  
  const deleteInterviewReport = async (interviewId) => {
    setResumeLoader(true);
    setError(null);
    try {
      const response = await deletInterviewReportApi(interviewId);

      setMockReports((prev) =>
        prev.filter((report) => report._id !== interviewId),
      );
      const message = response?.data || "Interview Report deleted successfully";
      showToast(message, "success");
    } catch (error) {
      if (error.response) {
        showToast(
          error.response?.data?.message || "Failed to download resume.",
          "error",
        );
      } else if (error.request) {
        showToast("Unable to connect to server.", "error");
      } else {
        showToast("Something went wrong.", "error");
      }
    } finally {
      setResumeLoader(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    error,
    resumeLoader,
    setResumeLoader,
    setError,
    getReportById,
    getReports,
    generateReport,
    // getResumePdf,
    deleteInterviewReport,
  };
};
