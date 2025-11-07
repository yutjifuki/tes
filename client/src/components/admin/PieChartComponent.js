import React from "react";
import { Chart } from "react-google-charts";

const PieChartComponent = ({ data, title }) => {
  const chartData = [
    ["Kepuasan", "Persentase"],
    ["Sangat Puas", data["Sangat Puas"] || 0],
    ["Puas", data["Puas"] || 0],
    ["Kurang Puas", data["Kurang Puas"] || 0],
    ["Tidak Puas", data["Tidak Puas"] || 0],
  ];

  const options = {
    title: title || " ",
    pieHole: 0.4,
    is3D: false,
    colors: ["#2ecc71", "#3498db", "#f1c40f", "#e74c3c"],
    legend: { position: "bottom" },
    chartArea: { width: "90%", height: "80%" },
    backgroundColor: "#FBFFFE",
  };

  const hasValidData = Object.values(data).some(
    (value) => typeof value === "number" && value > 0
  );

  if (!hasValidData) {
    return <p>Tidak ada data yang cukup untuk menampilkan diagram.</p>;
  }

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
      loader={<div>Memuat Diagram...</div>}
    />
  );
};

export default PieChartComponent;
