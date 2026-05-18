import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (token) fetchBookings();
  }, [token]);

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `http://localhost:5001/api/bookings/cancel/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(
        bookings.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (error) {
      alert("Cancel failed");
    }
  };

  if (loading) return <h2>Loading bookings...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Bookings</h2>

      {bookings.map((b) => (
        <div key={b._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{b.unitId?.name}</h3>
          <p>User: {b.userId?.name}</p>
          <p>Status: {b.status}</p>

          {b.status === "confirmed" && (
            <button onClick={() => handleCancel(b._id)}>Cancel</button>
          )}
        </div>
      ))}
    </div>
  );
}