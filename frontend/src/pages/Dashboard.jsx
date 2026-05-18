import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [units, setUnits] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/units"
        );
        setUnits(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUnits();
  }, []);

  const handleBooking = async (id) => {
    try {
      await axios.post(
        "http://localhost:5001/api/bookings",
        {
          unitId: id,
          startDate: new Date(),
          endDate: new Date()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Booked!");
      window.location.reload();

    } catch (error) {
      alert("Booking failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Storage Units</h2>

      {units.map((u) => (
        <div key={u._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{u.name}</h3>
          <p>{u.size}</p>
          <p>${u.pricePerDay}</p>

          {u.available && (
            <button onClick={() => handleBooking(u._id)}>Book</button>
          )}
        </div>
      ))}
    </div>
  );
}