import { useEffect, useState } from "react";
import api from "../axiosConfig";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [units, setUnits] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
  name: "",
  cardNumber: "",
  expiry: "",
  cvv: ""
});

  const [updateForm, setUpdateForm] = useState({
    unitId: "",
    startDate: "",
    endDate: "",
    pricePerDay: 0
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // ✅ FETCH BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await api.get(
        "/api/bookings/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(data);
    };

    if (token) fetchBookings();
  }, [token]);

  // ✅ FETCH UNITS
  useEffect(() => {
    const fetchUnits = async () => {
      const { data } = await api.get("/api/units");
      setUnits(data);
    };
    fetchUnits();
  }, []);

  // ✅ CALCULATE PRICE (UPDATE MODAL)
  const calculateUpdatedCost = () => {
    if (!updateForm.startDate || !updateForm.endDate) return 0;

    const start = new Date(updateForm.startDate);
    const end = new Date(updateForm.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end - start;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

    return days > 0 ? days * updateForm.pricePerDay : 0;
  };

  // ✅ FILTER + SORT
  let filteredBookings =
    filterStatus === "all"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

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
      <h2>My Bookings</h2>

      {/* ✅ FILTER */}
      <div style={{ marginBottom: "15px" }}>
        <label>Status: </label>
        <select onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
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
        <thead style={thead}>
          <tr>
            <th style={th}>Unit</th>
            <th style={th}>Start Date</th>
            <th style={th}>End Date</th>
            <th style={th}>Status</th>
            <th style={th}>Total Cost</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.map((b) => (
            <tr key={b._id}>
              <td style={td}>{b.unitId?.name}</td>
              <td style={td}>{new Date(b.startDate).toLocaleDateString()}</td>
              <td style={td}>{new Date(b.endDate).toLocaleDateString()}</td>

              <td style={td}>
                <span style={statusStyle(b.status)}>{b.status}</span>
              </td>

              <td style={td}>
                ${b.totalCost}

                {/* PAY */}
                {b.status === "pending" && (
                  <button style={payBtn} onClick={() => {
                    setSelectedBooking(b);
                    setShowPayModal(true);
                  }}>
                    Pay Now
                  </button>
                )}

                {/* UPDATE */}
                {b.status !== "cancelled" && (
                  <button style={updateBtn} onClick={() => {
                    setSelectedBooking(b);
                    setUpdateForm({
                      unitId: b.unitId._id,
                      startDate: b.startDate.split("T")[0],
                      endDate: b.endDate.split("T")[0],
                      pricePerDay: b.unitId.pricePerDay
                    });
                    setShowUpdateModal(true);
                  }}>
                    Update
                  </button>
                )}

                {/* CANCEL */}
                {b.status !== "cancelled" && (
                  <button style={cancelBtnRow} onClick={async () => {
                    if (!window.confirm("Cancel booking?")) return;

                    await api.put(
                      `/api/bookings/cancel/${b._id}`,
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    window.location.reload();
                  }}>
                    Cancel
                  </button>
                )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ UPDATE MODAL */}
      {showUpdateModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Update Booking</h3>

            <label>Unit</label>
            <select
              value={updateForm.unitId}
              onChange={(e) => {
                const unit = units.find(u => u._id === e.target.value);
                setUpdateForm({
                  ...updateForm,
                  unitId: e.target.value,
                  pricePerDay: unit.pricePerDay
                });
              }}
              style={input}
            >
              {units.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} (${u.pricePerDay}/day)
                </option>
              ))}
            </select>

            <label>Start Date</label>
            <input
              type="date"
              value={updateForm.startDate}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, startDate: e.target.value })
              }
              style={input}
            />

            <label>End Date</label>
            <input
              type="date"
              value={updateForm.endDate}
              onChange={(e) =>
                setUpdateForm({ ...updateForm, endDate: e.target.value })
              }
              style={input}
            />

            <p><strong>Updated Cost:</strong> ${calculateUpdatedCost()}</p>

            <button style={primaryBtn} onClick={async () => {
              await api.put(
                `/api/bookings/update/${selectedBooking._id}`,
                updateForm,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              window.location.reload();
            }}>
              Save Changes
            </button>

            <button style={cancelBtn} onClick={() => setShowUpdateModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      
{/* ✅ PAY MODAL */}
{showPayModal && selectedBooking && (
  <div style={overlay}>
    <div style={modal}>
      <h3>Payment Details</h3>

      <p><strong>Unit:</strong> {selectedBooking.unitId?.name}</p>
      <p><strong>Total:</strong> ${selectedBooking.totalCost}</p>

      {/* ✅ CARD FORM */}
      <input
        placeholder="Name on Card"
        value={paymentForm.name}
        onChange={(e) =>
          setPaymentForm({ ...paymentForm, name: e.target.value })
        }
        style={input}
      />

      <input
        placeholder="Card Number"
        value={paymentForm.cardNumber}
        onChange={(e) =>
          setPaymentForm({ ...paymentForm, cardNumber: e.target.value })
        }
        style={input}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="MM/YY"
          value={paymentForm.expiry}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, expiry: e.target.value })
          }
          style={input}
        />

        <input
          placeholder="CVV"
          value={paymentForm.cvv}
          onChange={(e) =>
            setPaymentForm({ ...paymentForm, cvv: e.target.value })
          }
          style={input}
        />
      </div>

      {/* ✅ CONFIRM BUTTON */}
      <button
        style={payBtn}
        onClick={async () => {
          // ✅ Simple validation (frontend only)
          if (
            !paymentForm.name ||
            !paymentForm.cardNumber ||
            !paymentForm.expiry ||
            !paymentForm.cvv
          ) {
            alert("Please fill all payment fields");
            return;
          }

          try {
            await api.put(
              `/api/bookings/pay/${selectedBooking._id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            alert("✅ Payment successful! Your storage unit is booked!");

            setShowPayModal(false);
            setSelectedBooking(null);

            // ✅ Clear form
            setPaymentForm({
              name: "",
              cardNumber: "",
              expiry: "",
              cvv: ""
            });

            window.location.reload();

          } catch (error) {
            alert("Payment failed");
          }
        }}
      >
        Pay Now
      </button>

      <button style={cancelBtn} onClick={() => setShowPayModal(false)}>
        Cancel
      </button>
    </div>
  </div>
)}

    </div>
  );
};


/* ✅ STYLES */

const table = { width: "100%", borderCollapse: "collapse" };

const thead = { background: "#1D4ED8", color: "white" };

const th = { padding: "10px", textAlign: "left" };

const td = { padding: "10px", borderBottom: "1px solid #ddd" };

const payBtn = {
  marginLeft: "10px",
  padding: "6px 10px",
  background: "#10B981",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

const updateBtn = {
  marginLeft: "10px",
  padding: "6px 10px",
  background: "#F59E0B",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

const cancelBtnRow = {
  marginLeft: "10px",
  padding: "6px 10px",
  background: "#EF4444",
  color: "white",
  border: "none",
  borderRadius: "5px"
};

const statusStyle = (status) => ({
  color: status === "confirmed" ? "green" :
         status === "pending" ? "orange" : "red",
  fontWeight: "bold"
});

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
  width: "320px"
};

const input = {
  padding: "8px",
  marginTop: "8px",
  width: "100%"
};

const primaryBtn = {
  background: "#2563EB",
  color: "white",
  padding: "10px",
  marginTop: "10px",
  width: "100%",
  border: "none"
};

const cancelBtn = {
  marginTop: "10px",
  padding: "8px",
  width: "100%"
};

export default MyBookings;