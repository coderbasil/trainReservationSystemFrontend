import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import the custom hook
import "./css/BookingPage.css";
import "./css/Dashboard.css";

const BookingPage = () => {
  const { trainId } = useParams();
  const  user  = localStorage.getItem('user'); // Get the user from AuthProvider
  const [train, setTrain] = useState(null);
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch train details
    fetch(`http://localhost:5000/train/${trainId}`)
      .then((response) => response.json())
      .then((data) => {
        setTrain(data.train);
        setSeats(data.seats);
      })
      .catch((error) => console.error("Error fetching train data:", error));
  }, [trainId]);

  const calculatePrice = (seatClass, isDependent, loyaltyStatus) => {
    let basePrice = seatClass === "First Class" ? 100 : 50; // Example prices
    let discount = 0;

    if (isDependent) {
      discount = 0.25; // 25% discount for dependents
    } else {
      switch (loyaltyStatus) {
        case "Green":
          discount = 0.05; // 5% discount
          break;
        case "Silver":
          discount = 0.1; // 10% discount
          break;
        case "Gold":
          discount = 0.15; // 15% discount
          break;
        default:
          discount = 0; // Regular, no discount
          break;
      }
    }

    return basePrice - basePrice * discount;
  };

  const handleSeatBooking = (seatId) => {
    if (!user) {
      alert("Please log in to book a seat.");
      return;
    }

    const isDependent = user.type === "dependent"; // Assume the user type is stored in localStorage
    const loyaltyStatus = user.loyalty_status; // Retrieve loyalty status from the user object
    const selectedSeat = seats.find((seat) => seat.seat_id === seatId);
    const price = calculatePrice(selectedSeat.seat_class, isDependent, loyaltyStatus);

    fetch(`http://localhost:5000/api/book-seat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trainId, seatId, price, user}),
    })
      .then((response) => {
        if (response.ok) {
          alert(`Seat booked successfully! Amount Paid: $${price.toFixed(2)}`);
          navigate("/dashboard");
        } else {
          alert("Failed to book seat.");
        }
      })
      .catch((error) => console.error("Error booking seat:", error));
  };

  if (!train) {
    return <div>Loading train details...</div>;
  }

  return (
    <div className="table-container">
      <h1>Booking for Train {train.train_name}</h1>
      <table className="reservation-train-table">
        <thead>
          <tr>
            <th>Seat ID</th>
            <th>Status</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {seats.map((seat) => (
            <tr key={seat.seat_id}>
              <td>{seat.seat_id}</td>
              <td>{seat.seat_status}</td>
              <td>{seat.seat_class}</td>
              <td>
                {seat.seat_status === "Free" ? (
                  <button onClick={() => handleSeatBooking(seat.seat_id)}>
                    Book Seat
                  </button>
                ) : (
                  "Not Available"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingPage;
