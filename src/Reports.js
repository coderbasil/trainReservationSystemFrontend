import React, { useState } from "react";
import "./css/Reports.css";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [date, setDate] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [passengerID, setPassengerID] = useState("");
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");

  const handleGenerateReport = async () => {
    try {
      let query = "";

      switch (reportType) {
        case "active_trains_today":
          query = `${reportType}+${date}`;
          break;
        case "stations_for_each_train":
          query = reportType;
          break;
        case "reservation_by_passengerId":
          query = `${reportType}+${passengerID}`;
          break;
        case "waitlisted_loyalty":
          query = `${reportType}+${trainNumber}`;
          break;
        case "average_load_factor":
          query = `${reportType}+${date}`;
          break;
        case "dependents_list":
          query = `${reportType}+${date}`;
          break;
        default:
          setError("Please select a valid report type.");
          return;
      }

      const response = await fetch(`http://localhost:5000/reports/${query}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch the report. Status: ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
      setError("");
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Failed to fetch report data. Please try again.");
    }
  };

  const handleExport = (type) => {
    alert(`Exporting report as ${type}`);
  };

  const renderTableHeaders = () => {
    if (reportData.length === 0) return null;

    const sampleRow = reportData[0];
    const headers = Object.keys(sampleRow);

    return headers.map((header, index) => <th key={index}>{header}</th>);
  };

  const renderTableRows = () => {
    return reportData.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {Object.values(row).map((value, colIndex) => (
          <td key={colIndex}>{value}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="admin-reports">
      <header className="admin-header">
        <h1>Admin Reports Dashboard</h1>
        <a href="/admin-dashboard">
          <button className="logout-btn">Return</button>
        </a>
      </header>
      <section className="filters">
        <div className="filter-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select a report</option>
            <option value="active_trains_today">Active Trains Today</option>
            <option value="stations_for_each_train">
              Stations for Each Train
            </option>
            <option value="reservation_by_passengerId">
              Reservation Details by Passenger ID
            </option>
            <option value="waitlisted_loyalty">
              Waitlisted Loyalty Passengers
            </option>
            <option value="average_load_factor">Average Load Factor</option>
            <option value="dependents_list">Dependents Traveling</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="trainNumber">Train Number (Optional):</label>
          <input
            type="text"
            id="trainNumber"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="passengerID">Passenger ID (Optional):</label>
          <input
            type="text"
            id="passengerID"
            value={passengerID}
            onChange={(e) => setPassengerID(e.target.value)}
          />
        </div>
        <button className="generate-btn" onClick={handleGenerateReport}>
          Generate Report
        </button>
      </section>
      <section className="report-results">
        <h2>Report Results</h2>
        {error && <p className="error-message">{error}</p>}
        {reportData.length > 0 ? (
          <table>
            <thead>
              <tr>{renderTableHeaders()}</tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        ) : (
          <p>No data available. Please generate a report.</p>
        )}
        <div className="export-buttons">
          <button onClick={() => handleExport("CSV")}>Export as CSV</button>
          <button onClick={() => handleExport("PDF")}>Export as PDF</button>
        </div>
      </section>
    </div>
  );
};

export default Reports;
