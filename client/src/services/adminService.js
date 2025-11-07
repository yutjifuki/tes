import axios from "axios";

const getApiEndpoint = (specificPath) => {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.REACT_APP_API_URL) {
      console.warn("REACT_APP_API_URL is not set for production environment!");
      return `/api${specificPath}`;
    }
    return `${process.env.REACT_APP_API_URL}${specificPath}`;
  } else {
    return `/api${specificPath}`;
  }
};

const getAdminDashboardStats = async () => {
  try {
    const response = await axios.get(
      getApiEndpoint("/surveys/zonadptk/statistics"),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching admin dashboard stats:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal memuat statistik dashboard");
  }
};

const getRespondents = async (page = 1, limit = 25) => {
  try {
    const response = await axios.get(
      getApiEndpoint(`/respondents?page=${page}&limit=${limit}`),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching respondents:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal memuat data responden");
  }
};

const getQuestions = async () => {
  try {
    const response = await axios.get(getApiEndpoint("/questions"), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching questions for admin:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal memuat daftar kuesioner");
  }
};

const createQuestion = async (questionData) => {
  try {
    const response = await axios.post(
      getApiEndpoint("/questions"),
      questionData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating question:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal membuat pertanyaan baru");
  }
};

const updateQuestion = async (id, questionData) => {
  try {
    const response = await axios.put(
      getApiEndpoint(`/questions/${id}`),
      questionData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating question:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal memperbarui pertanyaan");
  }
};

const deleteQuestion = async (id) => {
  try {
    const response = await axios.delete(getApiEndpoint(`/questions/${id}`), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting question:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal menghapus pertanyaan");
  }
};

const getResultsByQuestion = async () => {
  try {
    const response = await axios.get(
      getApiEndpoint("/surveys/zonadptk/results-by-question"),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching results by question:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal memuat hasil kuesioner");
  }
};

const resetAllRespondents = async () => {
  try {
    const response = await axios.delete(
      getApiEndpoint("/respondents/reset-all-data"),
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error resetting all respondents data:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Gagal mereset semua data responden");
  }
};

const adminService = {
  getAdminDashboardStats,
  getRespondents,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getResultsByQuestion,
  resetAllRespondents,
};

export default adminService;
