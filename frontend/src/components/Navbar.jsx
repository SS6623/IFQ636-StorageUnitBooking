import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      
      {/* ✅ App Name */}
      <Link to="/" className="text-2xl font-bold">
        Storage Booking System
      </Link>

      <div>
        {user ? (
          <>
            {/* ✅ USER LINKS */}
            <Link to="/" className="mr-4">Dashboard</Link>
            <Link to="/my-bookings" className="mr-4">My Bookings</Link>
            <Link to="/profile" className="mr-4">Profile</Link>

            {/* ✅ ADMIN LINKS */}
            {user.role === "admin" && (
              <>
                <Link to="/admin" className="mr-4">Admin Units</Link>
                <Link to="/admin/bookings" className="mr-4">Admin Bookings</Link>
              </>
            )}

            {/* ✅ LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;