import React, { useState, useEffect } from "react";
import "./css/AssignStaff.css";

const AssignStaff = () => {
  const [trains, setTrains] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/trains")
      .then((response) => response.json())
      .then((data) => setTrains(data))
      .catch((error) => console.error("Error fetching reports:", error));
    fetch("http://localhost:5000/dashboard/staff")
      .then((response) => response.json())
      .then((data) => setStaff(data))
      .catch((error) => console.error("Error fetching reports:", error));
  }, []);

  const handleAssign = async () => {
    if (!selectedTrain || !selectedDriver || !selectedEngineer) {
      alert("Please select a train, driver, engineer, and staff members.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/assignStaffToTrain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainId: selectedTrain,
          driverId: selectedDriver,
          engineerId: selectedEngineer,
        }),
      });
      if (response.ok) {
        alert("Driver, engineer, and staff assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning staff:", error);
      alert("Failed to assign staff. Please try again.");
    }
  };

  return (
    <div className="assign-staff-engineer-container">
      <h1>Assign Drivers, And Engineers to Trains</h1>

      <div className="form-group">
        <label htmlFor="train-select">Select Train:</label>
        <select
          id="train-select"
          value={selectedTrain}
          onChange={(e) => setSelectedTrain(e.target.value)}
        >
          <option value="">-- Select Train --</option>
          {trains.map((train) => (
            <option key={train.train_id} value={train.train_id}>
              {train.train_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="driver-select">Select Driver:</label>
        <select
          id="driver-select"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="">-- Select Driver --</option>
          {staff
            .filter((member) => member.role === "Driver")
            .map((driver) => (
              <option key={driver.staff_id} value={driver.staff_id}>
                {driver.staff_id}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="engineer-select">Select Engineer:</label>
        <select
          id="engineer-select"
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
        >
          <option value="">-- Select Engineer --</option>
          {staff
            .filter((member) => member.role === "Engineer")
            .map((engineer) => (
              <option key={engineer.staff_id} value={engineer.staff_id}>
                {engineer.staff_id}
              </option>
            ))}
        </select>
      </div>

      <button onClick={handleAssign} className="assign-button">
        Assign Driver and Engineer
      </button>
    </div>
  );
};

export default AssignStaff;
