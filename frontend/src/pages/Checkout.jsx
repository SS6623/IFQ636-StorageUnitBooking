import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const token = user?.token;

  const handlePayment = async () => {
    try {
      await axios.put(
        `http://localhost:5001/api/bookings/pay/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ Payment successful!");
      navigate("/my-bookings");

    } catch (error) {
      alert("Payment failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Checkout</h2>

      <p>Complete your booking payment to confirm your storage unit.</p>

      <button
        style={{
          background: "#10B981",
          color: "white",
          padding: "15px",
          border: "none",
          borderRadius: "6px",
          marginTop: "20px"
        }}
        onClick={handlePayment}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Checkout;
