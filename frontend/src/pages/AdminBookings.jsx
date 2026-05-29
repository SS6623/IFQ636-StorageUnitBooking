import { useEffect, useState } from "react";
//import axios from "axios";
import { useAuth } from "../context/AuthContext";
//const API_URL = "http://54.79.136.187:5001";
//import { API_URL } from "../config";
import api from "../axiosConfig";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const { user } = useAuth();
  const token = user?.token;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get(
          "/api/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setBookings(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) fetchBookings();
  }, [token]);

  // ✅ FILTER
  let filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  // ✅ SORT
  filteredBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "cost") {
      return b.totalCost - a.totalCost;
    }
    return 0;
  });

  return (
    <div style={{ padding: "30px" }}>
      <h2>All Bookings (Admin)</h2>

      {/* ✅ CONTROLS */}
      <div style={{ marginBottom: "15px" }}>
        <label>Status: </label>
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <label style={{ marginLeft: "20px" }}>Sort by: </label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="cost">Total Cost</option>
        </select>
      </div>

      {/* ✅ TABLE */}
      <table style={table}>
        <thead>
          <tr style={thead}>
            <th style={th}>Unit</th>
            <th style={th}>User</th>
            <th style={th}>Start Date</th>
            <th style={th}>End Date</th>
            <th style={th}>Status</th>
            <th style={th}>Total Cost</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.map((b) => (
            <tr key={b._id}>
              <td style={td}>{b.unitId?.name || "N/A"}</td>
              <td style={td}>{b.userId?.name || "N/A"}</td>
              <td style={td}>{new Date(b.startDate).toLocaleDateString()}</td>
              <td style={td}>{new Date(b.endDate).toLocaleDateString()}</td>
              <td style={td}>{b.status}</td>
              <td style={td}>${b.totalCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const thead = {
  background: "#1D4ED8",
  color: "white"
};

const th = {
  padding: "10px",
  textAlign: "left"
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #ddd"
};

export default AdminBookings;
