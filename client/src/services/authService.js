import axios from "axios";

/**
 * @param {string} specificPath - Path spesifik untuk endpoint API, contoh: '/auth/login', '/auth/me'
 */
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

const login = async (username, password) => {
  try {
    const response = await axios.post(
      getApiEndpoint("/auth/login"),
      {
        username,
        password,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Admin login error:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Login gagal. Periksa kembali username dan password Anda.");
  }
};

const logout = async () => {
  try {
    await axios.post(
      getApiEndpoint("/auth/logout"),
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error(
      "Admin logout error:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Logout gagal");
  }
};

const getCurrentAdmin = async () => {
  try {
    const response = await axios.get(getApiEndpoint("/auth/me"), {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.warn(
      "GetCurrentAdmin Error (likely no active session or cookie issue):",
      error.response ? error.response.data : error.message
    );
    return null;
  }
};

const authService = {
  login,
  logout,
  getCurrentAdmin,
};

export default authService;
