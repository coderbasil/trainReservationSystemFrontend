import React, { useState, useEffect } from "react";
import "./css/AdminReservations.css";

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [newReservation, setNewReservation] = useState({ name: "", date: "" });
  

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reservations");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleAddReservation = async () => {
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
      });
      if (response.ok) {
        fetchReservations();
        setNewReservation({ name: "", date: "" });
      }
    } catch (error) {
      console.error("Error adding reservation:", error);
    }
  };

  const handleEditReservation = async (id) => {
    try {
      const seat_class = prompt('enter seat class');  
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "confirm", seat_class: seat_class}),
        }
      );
      if (response.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error("Error editing reservation:", error);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reservations/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancel", seat_class: ''}),
        }
      );
      if (response.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const renderTableHeaders = () => {
    if (reservations.length === 0) return null;

    const sampleRow = reservations[0];
    const headers = Object.keys(sampleRow);

    return (
      <tr>
        {headers.map((header, index) => (
          <th key={index}>{header}</th>
        ))}
        <th>Confirm</th>
        <th>Cancel</th>
      </tr>
    );
  };

  const renderTableRows = () => {
    return reservations.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {Object.values(row).map((value, colIndex) => (
          <td key={colIndex}>{value}</td>
        ))}
        <td>
          <button onClick={() => handleEditReservation(rowIndex+1)}>Confirm</button>
        </td>
        <td>
          <button onClick={() => handleCancelReservation(rowIndex+1)}>
            Cancel
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="admin-container">
      <h1>Admin Reservations Management</h1>
      <div className="table-container">
        <h2>Reservations</h2>
        <ul>
          {reservations.length > 0 ? (
            <table>
              <thead>{renderTableHeaders()}</thead>
              <tbody>{renderTableRows()}</tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminReservations;
