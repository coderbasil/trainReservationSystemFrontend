import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import Reports from './Reports'
import "./css/index.css";
import TrainBooking from "./Trains";
import BookingPage from "./BookingPage";
import AdminReservations from "./AdminReservations";
import AssignStaff from "./AssignStaff";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-res"
            element={
              <PrivateRoute>
                <AdminReservations />
              </PrivateRoute>
            }
          />
          <Route
            path="/assign-staff"
            element={
              <PrivateRoute>
                <AssignStaff />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard/reports"
            element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/trains"
            element={
              <PrivateRoute>
                <TrainBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/book/:trainId"
            element={
              <PrivateRoute>
                <BookingPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
