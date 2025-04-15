import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Dashboard.css"
import "./css/TrainBooking.css";

function TrainBooking() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [trains, setTrains] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [passenger, setPassenger] = useState(null);

  // For controlling which train we’re booking and modals
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Seat class, e.g. "Cabin" or "First Class"
  const [seatClass, setSeatClass] = useState("Cabin");

  // Which dependents are selected (you can use checkboxes so the user can pick multiple)
  const [selectedDependents, setSelectedDependents] = useState([]);

  // Payment breakdown
  const [priceDetails, setPriceDetails] = useState({
    occupantIds: [],
    totalTickets: 0,
    totalPrice: 0,
  });

  const navigate = useNavigate();

  // 1) Fetch passenger
  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        const res = await fetch("http://localhost:5000/passenger/" + user.userId);
        const data = await res.json();
        // The API returns an array, data[0], etc.
        if (data && data.length) {
          setPassenger(data[0]);
        }
      } catch (error) {
        console.error("Error fetching passengers:", error);
      }
    };
    fetchPassenger();
  }, [user.userId]);

  // 2) Fetch trains
  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/trains/");
        const data = await res.json();
        setTrains(data);
      } catch (error) {
        console.error("Error fetching trains:", error);
      }
    };
    fetchTrainData();
  }, []);

  // 3) Fetch dependents (once we have passenger data)
  useEffect(() => {
    const fetchDependents = async () => {
      // If passenger is still null, wait
      if (!passenger?.passenger_id) return;
      try {
        const res = await fetch(
          "http://localhost:5000/dependents/" + passenger.passenger_id
        );
        const data = await res.json();
        setDependents(data);
      } catch (error) {
        console.error("Error fetching Dependents:", error);
      }
    };
    fetchDependents();
  }, [passenger]);

  /**
   * Price calculation (your original formula).
   */
  const calculatePrice = (seatClass, isDependent, loyaltyStatus) => {
    let basePrice = seatClass === "First Class" ? 100 : 50;
    let discount = 0;

    if (isDependent) {
      discount = 0.25;
    } else {
      switch (loyaltyStatus) {
        case "Green":
          discount = 0.05;
          break;
        case "Silver":
          discount = 0.1;
          break;
        case "Gold":
          discount = 0.15;
          break;
        default:
          discount = 0;
          break;
      }
    }
    return basePrice - basePrice * discount;
  };

  /**
   * When the user clicks "Book Now" on a train row:
   *  - Store that train in state
   *  - Reset seatClass, selected dependents, etc.
   *  - Show the seat-selection modal
   */
  const handleBookNow = (train) => {
    setSelectedTrain(train);
    setSeatClass("Cabin");
    setSelectedDependents([]);
    setShowSeatModal(true);
  };

  /**
   * Called when user confirms seat selection in the seat modal.
   * We'll calculate the total price for:
   *   - The main passenger
   *   - Each selected dependent
   */
  const handleSeatSelectionSubmit = () => {
    if (!passenger) return;

    // Price for the main passenger
    const mainTravelerPrice = calculatePrice(
      seatClass,
      false,
      passenger.loyalty_status
    );

    let totalPrice = mainTravelerPrice;
    let occupantIds = [passenger.passenger_id]; // main passenger is always included
    let totalTickets = 1;

    // Add each dependent
    selectedDependents.forEach((depId) => {
      totalPrice += calculatePrice(seatClass, true, passenger.loyalty_status);
      occupantIds.push(depId);
      totalTickets++;
    });

    setPriceDetails({
      occupantIds,
      totalTickets,
      totalPrice,
    });

    // Close seat modal, open payment
    setShowSeatModal(false);
    setShowPaymentModal(true);
  };


  const handlePaymentConfirm = () => {
    if (!selectedTrain) return;

    fetch(`http://localhost:5000/api/book-seat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trainId: selectedTrain.train_id,
        occupantIds: priceDetails.occupantIds, 
        seatClass,
        totalPrice: priceDetails.totalPrice,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("Booking successful!");
          navigate("/dashboard");
        } else {
          alert("Failed to book seat or not enough balance.");
        }
      })
      .catch((error) => console.error("Error booking seat:", error));
  };

  // For toggling a dependent in the UI
  const toggleDependentSelection = (depId) => {
    if (selectedDependents.includes(depId)) {
      setSelectedDependents(
        selectedDependents.filter((id) => id !== depId)
      );
    } else {
      setSelectedDependents([...selectedDependents, depId]);
    }
  };

  // If any of these still loading:
  if (!passenger || !trains.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-container">
      <h1>Bookable Trains</h1>
      <table className="reservation-train-table">
        <thead>
          <tr>
            <th>Train ID</th>
            <th>Train Name</th>
            <th>Total Cabin Seats</th>
            <th>Available Cabin Seats</th>
            <th>Total First Class Seats</th>
            <th>Available First Class Seats</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train, index) => (
            <tr key={index}>
              <td>{train.train_id}</td>
              <td>{train.train_name}</td>
              <td>{train.total_cabin_seats}</td>
              <td>{train.available_cabin_seats}</td>
              <td>{train.total_firstclass_seats}</td>
              <td>{train.available_firstclass_seats}</td>
              <td>{new Date(train.departure_time).toLocaleString()}</td>
              <td>{new Date(train.arrival_time).toLocaleString()}</td>
              <td>
                {train.available_cabin_seats > 0 ||
                train.available_firstclass_seats > 0 ? (
                  <button onClick={() => handleBookNow(train)}>
                    Book Now
                  </button>
                ) : (
                  <button disabled>Not Available</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <a href="/dashboard">
        <button className="logout-btn">Return</button>
      </a>

      {/* --- SEAT SELECTION MODAL --- */}
      {showSeatModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select Seat Type & Dependents</h3>

            <div className="modal-section">
              <label>
                <input
                  type="radio"
                  name="seatClass"
                  value="Cabin"
                  checked={seatClass === "Cabin"}
                  onChange={(e) => setSeatClass(e.target.value)}
                />
                Cabin
              </label>
              <label>
                <input
                  type="radio"
                  name="seatClass"
                  value="First Class"
                  checked={seatClass === "First Class"}
                  onChange={(e) => setSeatClass(e.target.value)}
                />
                First Class
              </label>
            </div>

            <div className="modal-section">
              <h4>Choose Dependents:</h4>
              {dependents.length === 0 ? (
                <p>No dependents found.</p>
              ) : (
                dependents.map((dep) => (
                  <label key={dep.dependent_id} className="dependent-label">
                    <input
                      type="checkbox"
                      checked={selectedDependents.includes(dep.dependent_id)}
                      onChange={() => toggleDependentSelection(dep.dependent_id)}
                    />
                    {dep.fname} {dep.lname} (ID: {dep.dependent_id})
                  </label>
                ))
              )}
            </div>

            <div className="modal-buttons">
              <button onClick={handleSeatSelectionSubmit}>Confirm</button>
              <button onClick={() => setShowSeatModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Payment</h3>
            <p>
              <strong>Train:</strong> {selectedTrain?.train_name}
            </p>
            <p>
              <strong>Seat Class:</strong> {seatClass}
            </p>
            <p>
              <strong>Total Tickets:</strong> {priceDetails.totalTickets}
            </p>
            <p>
              <strong>Total Price:</strong> ${priceDetails.totalPrice.toFixed(2)}
            </p>
            <div className="modal-buttons">
              <button onClick={handlePaymentConfirm}>Pay Now</button>
              <button onClick={() => setShowPaymentModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainBooking;



