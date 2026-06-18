import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.name);
      navigate('/analyze');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[88vh]">
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <p className="text-red-400 mb-4 text-sm text-center">{error}</p>}
        <input className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mb-3 text-white"
          placeholder="Email" type="email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 mb-5 text-white"
          placeholder="Password" type="password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition">
          Login
        </button>
        <p className="text-center text-gray-400 mt-4 text-sm">
          No account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}