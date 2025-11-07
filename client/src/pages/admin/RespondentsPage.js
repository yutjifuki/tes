import React, { useState, useEffect, useCallback } from "react";
import adminService from "../../services/adminService";
import ConfirmationModal from "../../components/shared/ConfirmationModal";
import { RiResetRightFill } from "react-icons/ri";

const RespondentsPage = () => {
  const [respondents, setRespondents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRespondents, setTotalRespondents] = useState(0);
  const limit = 25;
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetModalLoading, setResetModalLoading] = useState(false);

  const clearNotification = () => {
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 4000);
  };

  const fetchRespondents = useCallback(async (page) => {
    try {
      setLoading(true);
      const data = await adminService.getRespondents(page, limit);
      setRespondents(data.respondents || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalRespondents(data.totalRespondents || 0);
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal memuat data responden.",
      });
      clearNotification();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRespondents(currentPage);
  }, [fetchRespondents, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const openResetConfirmation = () => {
    setShowResetConfirmModal(true);
  };

  const closeResetConfirmation = () => {
    setShowResetConfirmModal(false);
  };

  const handleResetAllDataConfirmed = async () => {
    setResetModalLoading(true);
    try {
      const result = await adminService.resetAllRespondents();
      setNotification({
        type: "success",
        message:
          result.message || "Semua data responden dan survei berhasil direset.",
      });
      fetchRespondents(1);
      closeResetConfirmation();
      clearNotification();
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Gagal mereset data.",
      });
      clearNotification();
    } finally {
      setResetModalLoading(false);
    }
  };

  if (loading && respondents.length === 0 && !notification.message)
    return <div style={{ padding: "20px 0" }}>Memuat data responden...</div>;

  return (
    <div className="admin-respondents-page">
      <h1>Data Responden</h1>

      {notification.message && (
        <div
          className={`notification ${notification.type}`}
          style={{ marginBottom: "15px" }}
        >
          {notification.message}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <p style={{ margin: 0 }}>
          Total Responden Saat Ini: <strong>{totalRespondents}</strong>
        </p>
        <button
          onClick={openResetConfirmation}
          className="reset-btn"
          style={{
            backgroundColor: "#EB001B",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            border: "none",
            padding: "9px 13px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          disabled={loading || totalRespondents === 0}
        >
          <RiResetRightFill style={{ fontSize: "1rem", fontWeight: "bold" }} />
          Reset Data Responden & Survei
        </button>
      </div>

      {respondents.length === 0 && !loading ? (
        <p>Belum ada data responden.</p>
      ) : respondents.length > 0 ? (
        <>
          <table className="admin-table" style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>No.</th>
                <th style={tableStyles.th}>Nama</th>
                <th style={tableStyles.th}>Jenis Kelamin</th>
                <th style={tableStyles.th}>Usia</th>
                <th style={tableStyles.th}>Frekuensi Kunjungan</th>
                <th style={tableStyles.th}>Tanggal Submit</th>
              </tr>
            </thead>
            <tbody>
              {respondents.map((respondent, index) => (
                <tr key={respondent._id}>
                  <td style={tableStyles.td}>
                    <center>{(currentPage - 1) * limit + index + 1}</center>
                  </td>
                  <td style={tableStyles.td}>{respondent.name}</td>
                  <td style={tableStyles.td}>{respondent.gender}</td>
                  <td style={tableStyles.td}>{respondent.age}</td>
                  <td style={tableStyles.td}>{respondent.visitFrequency}</td>
                  <td style={tableStyles.td}>
                    {new Date(respondent.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="pagination-controls"
            style={tableStyles.paginationControls}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              style={tableStyles.pageButton}
            >
              Sebelumnya
            </button>
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              style={tableStyles.pageButton}
            >
              Berikutnya
            </button>
          </div>
        </>
      ) : null}

      <ConfirmationModal
        isOpen={showResetConfirmModal}
        onClose={closeResetConfirmation}
        onConfirm={handleResetAllDataConfirmed}
        title="Konfirmasi Reset Data Responden & Survei"
        message="ANDA YAKIN ingin menghapus SELURUH data responden DAN SEMUA data survei yang telah diisi? Tindakan ini akan menghapus data secara permanen dan TIDAK DAPAT DIURUNGKAN!"
        confirmText={resetModalLoading ? "Mereset..." : "Ya, Hapus Semua Data"}
        cancelText="Batal"
      />
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
  td: { border: "1px solid #ddd", padding: "10px", color: "#555" },
  paginationControls: { marginTop: "20px", textAlign: "center" },
  pageButton: {
    padding: "8px 16px",
    margin: "0 5px",
    backgroundColor: "#FAA916",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default RespondentsPage;
