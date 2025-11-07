import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { Link } from "react-router-dom";

const RespondentModal = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [visitFrequency, setVisitFrequency] = useState("Pertama kali");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !gender || !age || !visitFrequency) {
      setError("Semua field data responden harus diisi.");
      return;
    }
    const numericAge = parseInt(age);
    if (isNaN(numericAge) || numericAge <= 0) {
      setError("Usia harus berupa angka positif.");
      return;
    }
    if (numericAge < 18) {
      setError("Minimal usia adalah 18 tahun.");
      return;
    }
    setError("");
    onSubmit({ name, gender, age: numericAge, visitFrequency });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Data Responden</h2>
          <Link
            to="/"
            onClick={onCancel}
            className="modal-close-button"
            aria-label="Tutup"
          >
            <MdOutlineCancel />
          </Link>
        </div>
        {error && <p className="notification error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Jenis Kelamin</label>
            <div className="gender-buttons">
              <button
                type="button"
                className={gender === "Laki-laki" ? "selected" : ""}
                onClick={() => setGender("Laki-laki")}
              >
                Laki-laki
              </button>
              <button
                type="button"
                className={gender === "Perempuan" ? "selected" : ""}
                onClick={() => setGender("Perempuan")}
              >
                Perempuan
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="age">Usia</label>
            <input
              type="text"
              id="age"
              value={age}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,3}$/.test(value)) {
                  setAge(value);
                }
              }}
              required
              inputMode="numeric"
              pattern="\d*"
            />
          </div>
          <div className="form-group">
            <label htmlFor="visitFrequency">Frekuensi Kunjungan</label>
            <select
              id="visitFrequency"
              value={visitFrequency}
              onChange={(e) => setVisitFrequency(e.target.value)}
              required
            >
              <option value="Pertama kali">Pertama kali</option>
              <option value="Lebih dari satu kali">Lebih dari satu kali</option>
              <option value="Sering">Sering</option>
            </select>
          </div>
          <button type="submit" className="continue-btn">
            Lanjutkan
          </button>
        </form>
      </div>
    </div>
  );
};

export default RespondentModal;
