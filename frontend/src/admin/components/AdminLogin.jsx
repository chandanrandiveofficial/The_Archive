import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleClearStorage = () => {
    localStorage.clear();
    setError('Storage cleared. Please login again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      console.log('Login response:', result); // Debug log

      if (result.success) {
        // Token is in result.data.token
        console.log('Token:', result.data.token); // Debug log
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify({
          _id: result.data._id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.role,
        }));
        navigate('/admin');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] px-4">
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-black flex items-center justify-center">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
        </div>

        {/* HEADER */}
        <h1 className="text-center text-2xl font-bold text-black">
          Catalog Admin
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2">
          Welcome back, please login to manage your timeline.
        </p>

        {/* CARD */}
        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm font-medium text-black block mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <FiMail className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label className="text-sm font-medium text-black block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* REMEMBER ME */}
          <div className="flex items-center mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="rounded border-gray-300 w-4 h-4"
              />
              Remember me
            </label>
          </div>

          {/* LOGIN BUTTON */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-3.5 text-white text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {/* DIVIDER */}
          <div className="my-6 border-t border-gray-200" />

          {/* CLEAR STORAGE BUTTON */}
          <button 
            type="button"
            onClick={handleClearStorage}
            className="w-full mb-4 px-4 py-2 text-xs text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg hover:border-red-200 transition"
          >
            Clear Storage (if having login issues)
          </button>

          {/* RETURN */}
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black mx-auto transition"
          >
            <FiArrowLeft className="w-4 h-4" />
            Return to Site
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2025 The Archive. Secure Admin Access.
        </p>
      </div>
    </div>
  );
}
