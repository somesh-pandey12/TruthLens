import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-400">
        🔍 TruthLens
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/analyze" className="hover:text-blue-400 transition">Analyze</Link>
        {user && <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>}
        {user ? (
          <button onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm transition">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
            <Link to="/register"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-sm transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}