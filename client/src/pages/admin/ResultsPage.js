import React, { useState, useEffect, useCallback } from "react";
import adminService from "../../services/adminService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PieChartComponent from "../../components/admin/PieChartComponent";
import { FaPrint } from "react-icons/fa";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const resultsData = await adminService.getResultsByQuestion();
      const statsData = await adminService.getAdminDashboardStats();
      setResults(resultsData || []);
      setDashboardStats(statsData);
      setError("");
    } catch (err) {
      setError(err.message || "Gagal memuat hasil kuesioner.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handlePrintReport = () => {
    if (!results.length || !dashboardStats) {
      alert("Data belum cukup untuk mencetak laporan.");
      return;
    }

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString("id-ID");

    doc.setFontSize(18);
    doc.text("Laporan Hasil Survei Kepuasan Pelayanan Masyarakat", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Tanggal Cetak: ${today}`, 14, 30);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Ringkasan Survei", 14, 45);
    doc.setFontSize(11);
    doc.text(
      `Total Responden: ${dashboardStats.totalRespondents || 0}`,
      14,
      53
    );
    doc.text(
      `Total Pertanyaan Survei: ${dashboardStats.totalSurveyQuestions || 0}`,
      14,
      60
    );

    const summaryTableBody = [
      [
        "Sangat Puas",
        dashboardStats.satisfactionCounts["Sangat Puas"] || 0,
        `${dashboardStats.satisfactionPercentages["Sangat Puas"] || 0}%`,
      ],
      [
        "Puas",
        dashboardStats.satisfactionCounts["Puas"] || 0,
        `${dashboardStats.satisfactionPercentages["Puas"] || 0}%`,
      ],
      [
        "Kurang Puas",
        dashboardStats.satisfactionCounts["Kurang Puas"] || 0,
        `${dashboardStats.satisfactionPercentages["Kurang Puas"] || 0}%`,
      ],
      [
        "Tidak Puas",
        dashboardStats.satisfactionCounts["Tidak Puas"] || 0,
        `${dashboardStats.satisfactionPercentages["Tidak Puas"] || 0}%`,
      ],
    ];

    autoTable(doc, {
      startY: 68,
      head: [["Kategori Kepuasan", "Jumlah Jawaban", "Persentase"]],
      body: summaryTableBody,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
    });

    const kepuasan = (
      (dashboardStats.satisfactionPercentages["Sangat Puas"] || 0) +
      (dashboardStats.satisfactionPercentages["Puas"] || 0)
    ).toFixed(1);

    const ketidakpuasan = (
      (dashboardStats.satisfactionPercentages["Tidak Puas"] || 0) +
      (dashboardStats.satisfactionPercentages["Kurang Puas"] || 0)
    ).toFixed(1);

    doc.text(`Tingkat Kepuasan : ${kepuasan}%`, 14, 117);
    doc.text(`Tingkat Ketidakpuasan : ${ketidakpuasan}%`, 14, 124);

    doc.addPage();
    doc.setFontSize(14);
    doc.text("Detail Hasil per Pertanyaan", 14, 22);

    const resultsTableBody = results.map((result) => [
      result.questionText,
      result.answers["Sangat Puas"] || 0,
      result.answers["Puas"] || 0,
      result.answers["Kurang Puas"] || 0,
      result.answers["Tidak Puas"] || 0,
      result.totalAnswersForThisQuestion || 0,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Pertanyaan",
          "Sangat Puas",
          "Puas",
          "Kurang Puas",
          "Tidak Puas",
          "Total Jawaban",
        ],
      ],
      body: resultsTableBody,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
      },
    });

    doc.save(`Laporan_Survei_Kepuasan_${today.replace(/\//g, "-")}.pdf`);
  };

  if (loading) return <p>Memuat hasil kuesioner...</p>;
  if (error) return <p className="notification error">{error}</p>;

  return (
    <div className="admin-results-page">
      <h1>Hasil Kuesioner per Pertanyaan</h1>
      <button
        onClick={handlePrintReport}
        className="submit-btn"
        style={{
          marginBottom: "20px",
          backgroundColor: "#16C64F",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: "5px",
          border: "none",
          padding: "9px 13px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        disabled={loading || !results.length || !dashboardStats}
      >
        <FaPrint style={{ fontSize: ".9rem" }} />
        Cetak Laporan (PDF)
      </button>

      {results.length === 0 && !loading ? (
        <p>Belum ada hasil kuesioner.</p>
      ) : (
        <>
          {dashboardStats && dashboardStats.satisfactionPercentages && (
            <div
              style={{
                marginBottom: "30px",
                backgroundColor: "#FBFFFE",
                borderRadius: "4px",
                padding: "20px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <span>Ringkasan Kepuasan</span>
              <PieChartComponent
                data={dashboardStats.satisfactionPercentages}
              />
            </div>
          )}
          <table className="admin-table" style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Pertanyaan</th>
                <th style={tableStyles.th}>Sangat Puas</th>
                <th style={tableStyles.th}>Puas</th>
                <th style={tableStyles.th}>Kurang Puas</th>
                <th style={tableStyles.th}>Tidak Puas</th>
                <th style={tableStyles.th}>Total Jawaban</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.questionId}>
                  <td style={tableStyles.td}>{result.questionText}</td>
                  <td style={tableStyles.td}>
                    <center>{result.answers["Sangat Puas"] || 0}</center>
                  </td>
                  <td style={tableStyles.td}>
                    <center>{result.answers["Puas"] || 0}</center>
                  </td>
                  <td style={tableStyles.td}>
                    <center>{result.answers["Kurang Puas"] || 0}</center>
                  </td>
                  <td style={tableStyles.td}>
                    <center>{result.answers["Tidak Puas"] || 0}</center>
                  </td>
                  <td style={tableStyles.td}>
                    <center>{result.totalAnswersForThisQuestion || 0}</center>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

const tableStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  th: {
    backgroundColor: "#f2f2f2",
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    color: "#333",
  },
  td: {
    border: "1px solid #ddd",
    padding: "10px",
    color: "#555",
  },
};

export default ResultsPage;
