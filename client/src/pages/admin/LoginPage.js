import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../../services/authService";
import { FaUserGear } from "react-icons/fa6";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { from } = location.state || {
    from: { pathname: "/zonadptk/dashboard" },
  };

  useEffect(() => {
    const checkAuth = async () => {
      const admin = await authService.getCurrentAdmin();
      if (admin) {
        navigate(from, { replace: true });
      }
    };
    checkAuth();
  }, [navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(username, password);
      setLoading(false);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login Gagal. Periksa Username dan Password.");
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container" style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>
          <FaUserGear /> Admin Login
        </h2>
        {error && (
          <p style={styles.errorMsg} className="notification error">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="username"
              style={{ fontWeight: "initial", textAlign: "left" }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              style={{ fontWeight: "initial", textAlign: "left" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            className="submit-btn"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  loginBox: {
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "35px",
    color: "#282D33",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "35px",
    width: "100%",
    padding: "12px",
    backgroundColor: "#FAA916",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  errorMsg: {
    color: "red",
    marginBottom: "16px",
  },
};

export default LoginPage;
