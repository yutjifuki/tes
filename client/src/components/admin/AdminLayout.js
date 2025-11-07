import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import authService from "../../services/authService";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const admin = await authService.getCurrentAdmin();
      if (!admin) {
        navigate("/zonadptk/login", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);
  return (
    <div className="admin-layout" style={layoutStyles.adminLayout}>
      <Sidebar />
      <div style={layoutStyles.mainContainer}>
        <AdminNavbar />
        <main className="admin-content" style={layoutStyles.content}>
          <Outlet />{" "}
        </main>
      </div>
    </div>
  );
};

const layoutStyles = {
  adminLayout: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    height: "100vh",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flexGrow: 1,
    padding: "20px",
    overflowY: "auto",
    height: "auto",
  },
};

export default AdminLayout;
