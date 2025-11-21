import React from "react";
import { NavLink } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaChartPie, FaTicketAlt } from "react-icons/fa";
import { RiSurveyFill } from "react-icons/ri";
import bgImage from "../../assets/bg.png";

const Sidebar = () => {
  return (
    <aside className="admin-sidebar" style={sidebarStyles.sidebar}>
      <span style={sidebarStyles.title}>Menu</span>
      <ul style={sidebarStyles.navList}>
        <li style={sidebarStyles.navItem}>
          <NavLink
            to="/zonadptk/dashboard"
            style={({ isActive }) =>
              isActive
                ? { ...sidebarStyles.navLink, ...sidebarStyles.activeLink }
                : sidebarStyles.navLink
            }
          >
            <BiSolidDashboard style={sidebarStyles.navIcon} />
            Dashboard
          </NavLink>
        </li>
        <li style={sidebarStyles.navItem}>
          <NavLink
            to="/zonadptk/responden"
            style={({ isActive }) =>
              isActive
                ? { ...sidebarStyles.navLink, ...sidebarStyles.activeLink }
                : sidebarStyles.navLink
            }
          >
            <BsFillPeopleFill style={sidebarStyles.navIcon} />
            Data Responden
          </NavLink>
        </li>
        <li style={sidebarStyles.navItem}>
          <NavLink
            to="/zonadptk/kuesioner"
            style={({ isActive }) =>
              isActive
                ? { ...sidebarStyles.navLink, ...sidebarStyles.activeLink }
                : sidebarStyles.navLink
            }
          >
            <RiSurveyFill style={sidebarStyles.navIcon} />
            Kuesioner
          </NavLink>
        </li>
        <li style={sidebarStyles.navItem}>
          <NavLink
            to="/zonadptk/token"
            style={({ isActive }) =>
              isActive
                ? { ...sidebarStyles.navLink, ...sidebarStyles.activeLink }
                : sidebarStyles.navLink
            }
          >
            <FaTicketAlt style={sidebarStyles.navIcon} />
            Token Survey
          </NavLink>
        </li>
        <li style={sidebarStyles.navItem}>
          <NavLink
            to="/zonadptk/hasil-kuesioner"
            style={({ isActive }) =>
              isActive
                ? { ...sidebarStyles.navLink, ...sidebarStyles.activeLink }
                : sidebarStyles.navLink
            }
          >
            <FaChartPie style={sidebarStyles.navIcon} />
            Hasil Kuesioner
          </NavLink>
        </li>
      </ul>

      <div style={sidebarStyles.background}></div>
    </aside>
  );
};

const sidebarStyles = {
  sidebar: {
    backgroundColor: "#282D33",
    padding: "33px 20px 0",
    height: "100vh",
    borderRight: "1px solid #dee2e6",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    zIndex: 1000,
  },
  title: {
    fontSize: "1rem",
    fontFamily: "monospace",
    color: "#FBFFFE",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #dee2e6",
  },
  navList: {
    listStyle: "none",
    width: "200px",
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  navItem: {
    marginBottom: "10px",
  },
  navLink: {
    textDecoration: "none",
    color: "#FBFFFE",
    padding: "10px 15px",
    gap: "8px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.2s ease-in-out, color 0.2s ease-in-out",
  },
  navIcon: {
    lineHeight: "1",
  },
  activeLink: {
    color: "#FAA916",
  },

  background: {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "absolute",
    zIndex: -1,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.08,
  },
};

export default Sidebar;
