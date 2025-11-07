import axios from "axios";

/**
 * @param {string} specificPath - Path spesifik untuk endpoint API, contoh: '/questions', '/surveys/submit'
 */
const getApiEndpoint = (specificPath) => {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.REACT_APP_API_URL) {
      console.warn("REACT_APP_API_URL tidak diset untuk production!");
      return `/api${specificPath}`;
    }
    return `${process.env.REACT_APP_API_URL}${specificPath}`;
  } else {
    return `/api${specificPath}`;
  }
};

axios.defaults.withCredentials = true;

const getActiveQuestions = async () => {
  try {
    const response = await axios.get(getApiEndpoint("/questions"));
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching active questions:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal memuat pertanyaan survei");
  }
};

const submitSurvey = async (surveyData) => {
  try {
    const response = await axios.post(
      getApiEndpoint("/surveys/submit"),
      surveyData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting survey:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal mengirim survei");
  }
};

const checkSubmissionStatus = async () => {
  try {
    const timestamp = new Date().getTime();
    const response = await axios.get(
      `${getApiEndpoint("/surveys/check-submission")}?t=${timestamp}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.warn(
      "Error checking submission status or no submission found:",
      error.response ? error.response.data : error.message
    );
    return { hasSubmitted: false };
  }
};

const getHomepageStatistics = async () => {
  try {
    const response = await axios.get(getApiEndpoint("/surveys/statistics"));
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching homepage statistics:",
      error.response ? error.response.data : error.message
    );
    return {
      "Sangat Puas": "0%",
      Puas: "0%",
      "Kurang Puas": "0%",
      "Tidak Puas": "0%",
      totalRespondents: 0,
    };
  }
};

const surveyService = {
  getActiveQuestions,
  submitSurvey,
  checkSubmissionStatus,
  getHomepageStatistics,
};

export default surveyService;
