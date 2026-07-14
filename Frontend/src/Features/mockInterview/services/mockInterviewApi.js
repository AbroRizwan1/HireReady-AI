import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function generateMockInterview(interviewReportId) {
  try {
    const response = await api.post(
      `/api/interview/mock-interview/start/${interviewReportId}`,
    );

    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getMockInterview(mockInterviewId) {
  try {
    const response = await api.get(
      `/api/interview/mock-interview/${mockInterviewId}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function saveMockInterviewAnswer({
  mockInterviewId,
  questionIndex,
  answer,
}) {
  try {
    const response = await api.post("/api/interview/mock-interview/answer/", {
      mockInterviewId,
      questionIndex,
      answer,
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function finishMockInterview(mockInterviewId) {
  try {
    const response = await api.post(
      `/api/interview/mock-interview/finish/${mockInterviewId}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getMockInterviewReport(mockInterviewId) {
  try {
    const response = await api.get(
      `/api/interview/mock-interview/report/${mockInterviewId}`,
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/**
 * @description:  Service to get mockInterview reports of logged in user.
 */

export async function getAllMockInterviewReportsApi() {
  try {
    const response = await api.get(`/api/interview/mock-interview/`);
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function deletMockInterviewReportApi(mockInterviewId) {
  try {
    const response = await api.delete(
      `/api/interview/mock-interview/report/${mockInterviewId}`,
    );

    return response?.data;
  } catch (error) {
    throw error;
  }
}
