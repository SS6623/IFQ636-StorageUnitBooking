import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    size: "",
    pricePerDay: ""
  });

  const { user } = useAuth();
  const token = user?.token;

  // ✅ Fetch units
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

  // ✅ Create unit
  const handleCreate = async () => {
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

      alert("✅ Unit created");

      setForm({ name: "", size: "", pricePerDay: "" });
      setShowModal(false);
      fetchUnits();

    } catch (error) {
      alert(error.response?.data?.message || "Error creating unit");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this unit?")) return;

    try {
      await axios.delete(
        `http://localhost:5001/api/units/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ Unit deleted");
      setUnits(units.filter(u => u._id !== id));

    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: "30px", background: "#F3F4F6", minHeight: "100vh" }}>
      <h2>Admin Dashboard</h2>

      {/* ✅ BUTTON */}
      <button
        style={createBtn}
        onClick={() => setShowModal(true)}
      >
        + Create Unit
      </button>

      {/* ✅ UNIT LIST */}
      <h3>All Storage Units</h3>

      {units.length === 0 && <p>No units found.</p>}

      {units.map((unit) => (
        <div key={unit._id} style={card}>
          <h3>{unit.name}</h3>
          <p><b>Size:</b> {unit.size}</p>
          <p><b>Price:</b> ${unit.pricePerDay}</p>
          <p>{unit.available ? "✅ Available" : "❌ Booked"}</p>

          <button style={deleteBtn} onClick={() => handleDelete(unit._id)}>
            Delete
          </button>
        </div>
      ))}

      {/* ✅ MODAL */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Create New Storage Unit</h3>

            <input
              placeholder="Unit Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={input}
            />

            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              style={input}
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            <input
              type="number"
              placeholder="Price per day"
              value={form.pricePerDay}
              onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
              style={input}
            />

            <button style={primaryBtn} onClick={handleCreate}>
              Create Unit
            </button>

            <button style={cancelBtn} onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const createBtn = {
  background: "#2563EB",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  marginBottom: "20px"
};

const deleteBtn = {
  marginTop: "10px",
  background: "#EF4444",
  color: "white",
  padding: "8px",
  border: "none",
  borderRadius: "5px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  marginBottom: "15px"
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const input = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ddd"
};

const primaryBtn = {
  background: "#2563EB",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "5px"
};

const cancelBtn = {
  marginTop: "5px",
  padding: "8px",
  border: "none",
  background: "#ddd",
  borderRadius: "5px"
};
