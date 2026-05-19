import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      backgroundColor: "#1D4ED8",
      color: "white"
    }}>
      
      {/* ✅ Logo + Title */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img 
          src={logo} 
          alt="SS Storage Solutions logo" 
          style={{ width: "50px", marginRight: "10px" }} 
        />
        <h2 style={{ margin: 0 }}>SS Storage Solutions</h2>
      </div>

      {/* ✅ Navigation + User Info */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {user ? (
          <>
            {/* ✅ User Name */}
            <span
              style={{
                marginRight: "15px",
                padding: "6px 10px",
                background: "white",
                color: "#1D4ED8",
                borderRadius: "5px",
                fontWeight: "bold"
              }}
            >
              Welcome, {user.name}
            </span>

            {/* ✅ Menu Links */}
            <Link to="/" style={link}>Dashboard</Link>
            <Link to="/my-bookings" style={link}>Bookings</Link>
            <Link to="/profile" style={link}>Profile</Link>

            {/* ✅ Admin Menu */}
            {user.role === "admin" && (
              <>
                <Link to="/admin" style={link}>Manage Units</Link>
                <Link to="/admin/bookings" style={link}>All Bookings</Link>
              </>
            )}

            {/* ✅ Logout */}
            <button onClick={handleLogout} style={logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={link}>Login</Link>
            <Link to="/register" style={registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const link = {
  marginRight: "15px",
  color: "white",
  textDecoration: "none",
  fontWeight: "500"
};

const logoutBtn = {
  background: "#EF4444",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const registerBtn = {
  background: "#10B981",
  padding: "6px 12px",
  borderRadius: "5px",
  color: "white",
  textDecoration: "none"
};

export default Navbar;