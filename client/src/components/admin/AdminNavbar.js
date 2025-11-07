import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { TbLogout } from "react-icons/tb";
import { PiHandWavingBold } from "react-icons/pi";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/zonadptk/login", { replace: true });
    } catch (error) {
      navigate("/zonadptk/login", { replace: true });
    }
  };

  return (
    <nav className="admin-navbar" style={navStyles.navbar}>
      <div style={navStyles.brand}>
        <PiHandWavingBold style={navStyles.adminIcon} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            Selamat Datang di Panel Kontrol
          </span>
          <span style={{ fontSize: ".8rem" }}>Hallo Dinperinnaker</span>
        </div>
      </div>
      <button
        onClick={handleLogout}
        style={navStyles.logoutButton}
        className="reset-btn"
      >
        <TbLogout style={navStyles.logout} />
        <span>Logout</span>
      </button>
    </nav>
  );
};

const navStyles = {
  navbar: {
    backgroundColor: "#FBFFFE",
    color: "white",
    padding: ".9rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "relative",
    zIndex: 1000,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#282D33",
    fontFamily: "Arial, sans-serif",
  },
  adminIcon: {
    fontSize: "1.5rem",
    backgroundColor: "#FAA916",
    padding: "6.5px",
    borderRadius: "50%",
  },
  logoutButton: {
    padding: "0.5rem .8rem",
    cursor: "pointer",
    backgroundColor: "#EB001B",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    border: "none",
    borderRadius: "4px",
  },
  logout: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
};

export default AdminNavbar;
