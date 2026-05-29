import { useEffect, useState } from "react";
import axios from "axios";
//const API_URL = "http://54.79.136.187:5001";
//import { API_URL } from "../config";
import api from "../axiosConfig";

export default function Dashboard() {
  const [units, setUnits] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  // ✅ Get token
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
console.log(process.env.REACT_APP_API_URL)
  // ✅ Fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        //const { data } = await api.get(
          //`${API_URL}/api/units`
          const { data } = await api.get("/api/units"
        );
        setUnits(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnits();
  }, []);

  // ✅ Calculate total cost
  useEffect(() => {
    if (startDate && endDate && selectedUnit) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffTime = end - start;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays >= 0) {
        setTotalCost((diffDays +1) * selectedUnit.pricePerDay);
      } else {
        setTotalCost(0);
      }
    }
  }, [startDate, endDate, selectedUnit]);

  // ✅ Confirm booking
  const handleConfirmBooking = async () => {
    try {
      //await axios.post(
        //`${API_URL}/api/bookings`,
        await api.post("/api/bookings",
        {
          unitId: selectedUnit._id,
          startDate,
          endDate,
          totalCost,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Booking successful!");

      setSelectedUnit(null);
      setStartDate("");
      setEndDate("");

      window.location.reload();
    } catch (error) {
      alert("Booking failed");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#F3F4F6", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>Available Storage Units</h2>

      {units.length === 0 && <p>No units available.</p>}

      {/* ✅ GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {units.map((unit) => (
          <div
            key={unit._id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{unit.name}</h3>
            <p><strong>Size:</strong> {unit.size}</p>
            <p><strong>Price:</strong> ${unit.pricePerDay}/day</p>

            <p>
              {unit.available ? "✅ Available" : "❌ Booked"}
            </p>

            {unit.available && (
              <button
                style={{
                  marginTop: "10px",
                  background: "#2563EB",
                  color: "white",
                  padding: "10px",
                  width: "100%",
                  border: "none",
                  borderRadius: "6px",
                }}
                onClick={() => setSelectedUnit(unit)}
              >
                Book Now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ✅ BOOKING MODAL */}
      {selectedUnit && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              width: "320px",
            }}
          >
            <h3 style={{ marginBottom: "10px" }}>
              Book {selectedUnit.name}
            </h3>

            {/* ✅ Start date */}
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "5px",
              }}
            />

            {/* ✅ End date */}
            <label>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "5px",
              }}
            />

            {/* ✅ Total */}
            <p>
              <strong>Total Cost:</strong> ${totalCost}
            </p>

            {/* ✅ Confirm */}
            <button
              style={{
                background: "#2563EB",
                color: "white",
                padding: "10px",
                width: "100%",
                marginTop: "10px",
                border: "none",
                borderRadius: "6px",
              }}
              onClick={handleConfirmBooking}
            >
              Confirm Booking
            </button>

            {/* ✅ Cancel */}
            <button
              style={{
                marginTop: "10px",
                width: "100%",
              }}
              onClick={() => {
                setSelectedUnit(null);
                setStartDate("");
                setEndDate("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}