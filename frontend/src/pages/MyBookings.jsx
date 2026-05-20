import { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [selectedBooking, setSelectedBooking] = useState(null);
const [showPayModal, setShowPayModal] = useState(false);



  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  const [paymentForm, setPaymentForm] = useState({
  name: "",
  cardNumber: "",
  expiry: "",
  cvv: ""
});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/bookings/my",
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
      <h2>My Bookings</h2>

      {/* ✅ FILTER + SORT */}
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
              <td style={td}>{new Date(b.startDate).toLocaleDateString()}</td>
              <td style={td}>{new Date(b.endDate).toLocaleDateString()}</td>
              <td style={td}>{b.status}</td>
            <td style={td}>
  ${b.totalCost}

  {b.status === "pending" && (
    <button
      onClick={() => {
        setSelectedBooking(b);
        setShowPayModal(true);
      }}
      style={payNowBtn}
    >
      Pay Now
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>

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
            await axios.put(
              `http://localhost:5001/api/bookings/pay/${selectedBooking._id}`,
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

// ✅ STYLES
const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const thead = {
  background: "#1D4ED8",
  color: "white",
};

const th = {
  padding: "10px",
  textAlign: "left"
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #ddd"
};

const payNowBtn = {
  marginLeft: "10px",
  padding: "5px 8px",
  background: "#10B981",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
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
  width: "300px"
};

const payBtn = {
  background: "#10B981",
  color: "white",
  padding: "10px",
  border: "none",
  width: "100%",
  marginTop: "15px"
};

const cancelBtn = {
  marginTop: "10px",
  padding: "8px",
  width: "100%"
};



const input = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  marginTop: "10px",
  width: "100%"
};


export default MyBookings;