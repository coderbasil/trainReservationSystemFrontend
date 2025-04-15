import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./css/Dashboard.css";
import "./css/index.css";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/reports")
      .then((response) => response.json())
      .then((data) => setReports(data))
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {user?.name}!</h2>
      <div className="admin-dashboard-grid">
        <div className="admin-dashboard-item">
          <h2>Manage Reservations</h2>
          <p>Add, edit, or delete reservations.</p>
          <a href="admin-res">
            <button className="btn-action">Manage Now</button>
          </a>
        </div>
        <div className="admin-dashboard-item">
          <h2>Assign Staff</h2>
          <p>Assign drivers or engineers to trains.</p>
          <a href="assign-staff">
            <button className="btn-action">Assign Now</button>
          </a>
        </div>
        <div className="admin-dashboard-item">
          <h2>Reports</h2>
          <a href="/admin-dashboard/reports">
            <button className="btn-action">View</button>
          </a>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
