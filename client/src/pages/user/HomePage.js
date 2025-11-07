import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import surveyService from "../../services/surveyService";

const HomePage = () => {
  const observerRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      options
    );

    const elementsToAnimate = document.querySelectorAll(".animate-on-visible");
    elementsToAnimate.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const [stats, setStats] = useState({
    "Sangat Puas": "0%",
    Puas: "0%",
    "Kurang Puas": "0%",
    "Tidak Puas": "0%",
    totalRespondents: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      const data = await surveyService.getHomepageStatistics();
      setStats(data);
      setLoadingStats(false);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <section className="homepage-banner ">
        <h1 className="animate-on-visible">
          Survei Kepuasan Pelayanan Dinas Perindustrian dan Tenaga Kerja
          Kabupaten Rembang
        </h1>
        <p className="animate-on-visible">
          Partisipasi Anda sangat berarti untuk peningkatan kualitas layanan
          kami.
        </p>
        <Link to="/isi-survey" className="cta-button animate-on-visible">
          Isi Survei Sekarang
        </Link>
      </section>

      <section className="stats-section container">
        <h2>Hasil Survei Saat Ini</h2>
        {loadingStats ? (
          <p>Memuat statistik...</p>
        ) : (
          <div className="stats-container">
            <div className="stat-item stat-item-sangat-puas ">
              <h3>Sangat Puas</h3>
              <p>{stats["Sangat Puas"]}</p>
            </div>
            <div className="stat-item stat-item-puas">
              <h3>Puas</h3>
              <p>{stats["Puas"]}</p>
            </div>
            <div className="stat-item stat-item-kurang-puas">
              <h3>Kurang Puas</h3>
              <p>{stats["Kurang Puas"]}</p>
            </div>
            <div className="stat-item stat-item-tidak-puas">
              <h3>Tidak Puas</h3>
              <p>{stats["Tidak Puas"]}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
