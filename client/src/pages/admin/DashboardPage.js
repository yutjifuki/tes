import React, { useState, useEffect } from "react";
import adminService from "../../services/adminService";
import PieChartComponent from "../../components/admin/PieChartComponent";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAdminDashboardStats();
        setStats(data);
        setError("");
      } catch (err) {
        setError(err.message || "Gagal memuat data dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Memuat dashboard...</p>;
  if (error) return <p className="notification error">{error}</p>;
  if (!stats) return <p>Tidak ada data statistik tersedia.</p>;

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Admin</h1>
      <div className="stats-cards" style={dashboardStyles.cardsContainer}>
        <div className="stat-card" style={dashboardStyles.card}>
          <span style={dashboardStyles.cardTittle}>Total Responden</span>
          <p style={dashboardStyles.cardNumber}>
            {stats.totalRespondents || 0}
          </p>
        </div>
        <div className="stat-card" style={dashboardStyles.card}>
          <span style={dashboardStyles.cardTittle}>Jumlah Kuesioner</span>
          <p style={dashboardStyles.cardNumber}>
            {stats.totalSurveyQuestions || 0}
          </p>
        </div>
        <div
          className="stat-card"
          style={{ ...dashboardStyles.card, ...dashboardStyles.cardGreen }}
        >
          <span style={dashboardStyles.cardTittle}>Tingkat Kepuasan</span>
          <p style={dashboardStyles.cardNumber}>
            {(
              (stats.satisfactionPercentages["Puas"] || 0) +
              (stats.satisfactionPercentages["Sangat Puas"] || 0)
            ).toFixed(1)}
            %
          </p>
        </div>
        <div
          className="stat-card"
          style={{ ...dashboardStyles.card, ...dashboardStyles.cardRed }}
        >
          <span style={dashboardStyles.cardTittle}>Tingkat Ketidakpuasan</span>
          <p style={dashboardStyles.cardNumber}>
            {(
              (stats.satisfactionPercentages["Kurang Puas"] || 0) +
              (stats.satisfactionPercentages["Tidak Puas"] || 0)
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      <div
        className="satisfaction-stats"
        style={dashboardStyles.chartContainer}
      >
        <span>Statistik Kepuasan Keseluruhan</span>
        {stats.satisfactionPercentages &&
        Object.keys(stats.satisfactionPercentages).length > 0 ? (
          <>
            <PieChartComponent data={stats.satisfactionPercentages} title=" " />
            <div style={dashboardStyles.percentageTextContainer}>
              <p style={{ margin: "0" }}>
                Sangat Puas:{" "}
                <strong>
                  {stats.satisfactionPercentages["Sangat Puas"] || 0}%
                </strong>{" "}
                ({stats.satisfactionCounts["Sangat Puas"] || 0} jawaban)
              </p>
              <p style={{ margin: "0" }}>
                Puas:{" "}
                <strong>{stats.satisfactionPercentages["Puas"] || 0}%</strong> (
                {stats.satisfactionCounts["Puas"] || 0} jawaban)
              </p>
              <p style={{ margin: "0" }}>
                Kurang Puas:{" "}
                <strong>
                  {stats.satisfactionPercentages["Kurang Puas"] || 0}%
                </strong>{" "}
                ({stats.satisfactionCounts["Kurang Puas"] || 0} jawaban)
              </p>
              <p style={{ margin: "0" }}>
                Tidak Puas:{" "}
                <strong>
                  {stats.satisfactionPercentages["Tidak Puas"] || 0}%
                </strong>{" "}
                ({stats.satisfactionCounts["Tidak Puas"] || 0} jawaban)
              </p>
            </div>
          </>
        ) : (
          <p>Belum ada data kepuasan yang cukup.</p>
        )}
      </div>
    </div>
  );
};

const dashboardStyles = {
  cardsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#FAA916",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    minWidth: "140px",
    textAlign: "center",
    padding: "25px 15px",
    color: "#282D33",
  },
  cardNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#FBFFFE",
    margin: "0",
    boxSizing: "border-box",
  },
  cardTittle: {
    fontSize: "1rem",
    fontFamily: " helvetica",
    fontWeight: "bold",
  },
  cardGreen: {
    backgroundColor: "rgba(22, 198, 79, .75)",
  },
  cardRed: {
    backgroundColor: "rgba(235, 0, 27, .75)",
  },
  chartContainer: {
    backgroundColor: "#FBFFFE",
    marginTop: "20px",
    borderRadius: "4px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  percentageTextContainer: {
    paddingTop: "35px",
    textAlign: "left",
    lineHeight: "2.1",
  },
};

export default DashboardPage;
