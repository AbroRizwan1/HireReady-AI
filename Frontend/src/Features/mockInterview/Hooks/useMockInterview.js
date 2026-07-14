import { useContext, useState } from "react";
import { useToast } from "../../../Share/Toster/Toster";
import { mockInterviewContext } from "../MockInterviewContext";
import {
  getMockInterview,
  generateMockInterview,
  saveMockInterviewAnswer,
  finishMockInterview,
  getMockInterviewReport,
  getAllMockInterviewReportsApi,
  deletMockInterviewReportApi,
} from "../services/mockInterviewApi";

export const useMockInterview = () => {
  const context = useContext(mockInterviewContext);

  if (!context) {
    throw new Error(
      "useMockInterview must be used within MockInterviewProvider",
    );
  }

  const {
    mockInterview,
    setMockInterview,
    setMockInterviewLoading,
    mockInterviewLoading,
    mockInterviewId,
    setMockInterviewId,
    mockReports,
    setMockReports,
  } = context;

  const { showToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleError = (error) => {
    console.error(error);

    if (error.response) {
      const message = error.response?.data?.message || "Something went wrong.";
      setError(message);
      showToast(message, "error");
    } else if (error.request) {
      const message = "Unable to connect to server. Please try again.";
      setError(message);
      showToast(message, "error");
    } else {
      const message = "Something went wrong. Please try again.";
      setError(message);
      showToast(message, "error");
    }
  };

  const getInterviewReportId = async (interviewReportId) => {
    setMockInterviewLoading(true);
    setError(null);

    try {
      const data = await generateMockInterview(interviewReportId);

      if (data?.message) {
        showToast(data.message, "success");
      }

      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const mockInterviewQuestions = async (mockInterviewId) => {
    setMockInterviewLoading(true);
    setError(null);

    try {
      const data = await getMockInterview(mockInterviewId);

      setMockInterview(data?.mockInterview);
      setCurrentIndex(data?.mockInterview?.questionIndex);

      // showToast(data?.message, "success");
      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const mockInterviewAnswer = async ({
    mockInterviewId,
    questionIndex,
    answer,
    showSuccessToast = true,
  }) => {
    setMockInterviewLoading(true);
    setError(null);

    try {
      const data = await saveMockInterviewAnswer({
        mockInterviewId,
        questionIndex,
        answer,
      });

      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const mockInterviewReport = async (mockInterviewId) => {
    setMockInterviewLoading(true);
    setError(null);

    try {
      const data = await finishMockInterview(mockInterviewId);
      setMockInterview(data?.mockInterview);
      showToast(data?.message, "success");

      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const InterviewReport = async (mockInterviewId) => {
    setMockInterviewLoading(true);
    setError(null);
    try {
      const data = await getMockInterviewReport(mockInterviewId);

      setMockInterview(data?.mockInterviewReport);

      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setMockInterviewLoading(true);
    }
  };

  const getAllMockInterviewReports = async () => {
    setMockInterviewLoading(true);
    setError(null);

    try {
      const data = await getAllMockInterviewReportsApi();

      setMockReports(data?.mockInterviewReports);
    } catch (error) {
      handleError(error);
    } finally {
      setMockInterviewLoading(false);
    }
  };

  const deleteMockInterviewReport = async (mockInterviewId) => {
    setDeleteLoading(true);
    setError(null);
    try {
      const data = await deletMockInterviewReportApi(mockInterviewId);

      setMockReports((prev) =>
        prev.filter((report) => report._id !== mockInterviewId),
      );

      const message = data?.message || "mockInterview deleted successfully";
      showToast(message, "success");
      return data;
    } catch (error) {
      handleError(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    deleteMockInterviewReport,
    getAllMockInterviewReports,
    getInterviewReportId,
    mockInterviewAnswer,
    mockInterviewQuestions,
    mockInterviewReport,
    mockReports,
    InterviewReport,
    getAllMockInterviewReports,
    mockInterviewLoading,
    setMockInterviewLoading,
    mockInterview,
    setMockInterview,
    mockInterviewId,
    setMockReports,
    setMockInterviewId,
    setCurrentIndex,
    currentIndex,
    deleteLoading,
    error,
  };
};
