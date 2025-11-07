import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-section">
          <h4>Alamat Kantor</h4>
          <p>
            Jl. Raya Blora - Rembang, Ngotet Kidul, Ngotet, Kec. Rembang,
            Kabupaten Rembang, Jawa Tengah 59219
          </p>
        </div>
        <div className="footer-section">
          <h4>Kontak</h4>
          <p>
            Email:{" "}
            <a href="mailto:dinperinnaker@rembangkab.go.id">
              dinperinnaker@rembangkab.go.id
            </a>
          </p>
          <p>
            Web Utama:{" "}
            <a
              href="https://dinperinnaker.rembangkab.go.id/"
              target="_blank"
              rel="noopener noreferrer"
            >
              dinperinnaker.rembangkab.go.id
            </a>
          </p>
          <p>
            Instagram:{" "}
            <a
              href="https://www.instagram.com/dinperinnaker.rembangkab/"
              target="_blank"
              rel="noopener noreferrer"
            >
              @dinperinnaker.rembangkab
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Dinas Perindustrian dan Tenaga Kerja
        Kabupaten Rembang.
      </div>
    </footer>
  );
};

export default Footer;
