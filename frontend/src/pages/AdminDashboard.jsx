import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [units, setUnits] = useState([]);
  const [form, setForm] = useState({
    name: "",
    size: "",
    pricePerDay: ""
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  //  Fetch all units
  const fetchUnits = async () => {
    try {
      const { data } = await axios.get("http://localhost:5001/api/units");
      setUnits(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  //  Create new unit
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5001/api/units",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(" Unit created");

      setForm({ name: "", size: "", pricePerDay: "" });
      fetchUnits();

    } catch (error) {
      alert(error.response?.data?.message || "Error creating unit");
    }
  };

  //  Delete unit (ADMIN FEATURE)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/units/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(" Unit deleted");

      setUnits(units.filter(u => u._id !== id));

    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {/* ✅ CREATE UNIT FORM */}
      <h3>Create New Storage Unit</h3>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Size (Small/Medium/Large)"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price per Day"
          value={form.pricePerDay}
          onChange={(e) =>
            setForm({ ...form, pricePerDay: e.target.value })
          }
          required
        />

        <button type="submit">Create Unit</button>
      </form>

      {/*  LIST UNITS */}
      <h3>All Storage Units</h3>

      {units.length === 0 && <p>No units found.</p>}

      {units.map((unit) => (
        <div
          key={unit._id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >
          <h4>{unit.name}</h4>
          <p>Size: {unit.size}</p>
          <p>Price per day: ${unit.pricePerDay}</p>
          <p>Status: {unit.available ? "Available" : "Booked"}</p>

          <button
            style={{ background: "red", color: "white" }}
            onClick={() => handleDelete(unit._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}