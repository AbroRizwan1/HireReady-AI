import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * @description: service to generate Interview Report based on user Self description,resume, job description
 */

export async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resume);

  const response = await api.post("/api/interview/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

/**
 * @description:  Service to get interview report by interviewId.
 */

export async function getInterviewReportById(interviewId) {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response?.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * @description:  Service to get interview reports of logged in user.
 */

export async function getAllInterviewReports() {
  try {
    const response = await api.get(`/api/interview/`);
    return response?.data;
  } catch (err) {
    throw err;
  }
}

/**
 * @description:  service to generate resume pdf based on user self description, resume content, job description
 */

export async function generateResumePdf(interviewReportId) {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      null,
      {
        responseType: "blob",
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
}

/**
 * @description:Delete interview Report by Id
 */

export async function deletInterviewReportApi(interviewId) {
  try {
    const response = api.delete(
      `/api/interview/${interviewId}`,
    );

    return response?.data;
  } catch (error) {
    throw error;
  }
}
