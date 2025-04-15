import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/bookings/".concat(user?.userId))
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [user?.userId]);

  useEffect(() => {
    fetch("http://localhost:5000/alerts/".concat(user?.userId))
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data);
      })
      .catch((error) => console.error("Error fetching alerts:", error));
  }, [user?.userId]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  useEffect(() => {
    alerts.forEach((element) => {
      alert(element);
    });
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name}!</h1>
      <br></br>
      <div className="dashboard-grid">
        <div className="dashboard-item1">
          <div className="dashboard-item">
            <h2>Search for Trains</h2>
            <p>Find available trains and book seats.</p>
            <a href="/dashboard/trains">
              <button className="btn-action">Search Now</button>
            </a>
          </div>
        </div>
        <div className="table-container">
          <h2 className="table-header">Reservations</h2>
          <table className="reservation-train-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Status</th>
                <th>Train Name</th>
                <th>Seat Number</th>
                <th>Departure Station & Time</th>
                <th>Arrival Station & Time</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((row) => (
                <tr key={row.reservation_id}>
                  <td>{row.reservation_id}</td>
                  <td>{row.reservation_status}</td>
                  <td>{row.train_name}</td>
                  <td>{row.seat_number}</td>
                  <td>
                    {row.departure_station} -{" "}
                    {new Date(row.actual_departure_time).toLocaleTimeString()}
                  </td>
                  <td>
                    {row.arrival_station} -{" "}
                    {new Date(row.actual_arrival_time).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <br></br>
    </div>
  );
};

export default Dashboard;
