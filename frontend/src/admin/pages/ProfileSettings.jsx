import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiLock, FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProfileSettings = () => {
  const [user, setUser] = useState({
    name: '',
    email: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Get user data from localStorage or fetch profile
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        name: savedUser.name || '',
        email: savedUser.email || ''
      });
    }
  }, []);

  const getAuthToken = () => localStorage.getItem('token');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email
        })
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ ...data, token }));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: passwords.newPassword // Backend handles password hashing if provided
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="border-b border-neutral-200 pb-8">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 uppercase">Account Settings</h1>
          <p className="text-neutral-500 text-sm mt-2 font-medium tracking-wide">Manage your administrative profile and security credentials.</p>
        </div>

        {/* Status Messages */}
        {message.text && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            {message.type === 'success' ? <FiCheckCircle className="shrink-0" /> : <FiAlertCircle className="shrink-0" />}
            <p className="text-sm font-bold uppercase tracking-wider">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Profile Section */}
          <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-8">Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Admin Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Login Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiSave className="text-base" />
                {loading ? 'Updating...' : 'Save Profile'}
              </button>
            </form>
          </section>

          {/* Security Section */}
          <section className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-8">Security & Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm font-medium"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-black focus:bg-white transition-all text-sm font-medium"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FiLock className="text-base" />
                {loading ? 'Updating...' : 'Change Password'}
              </button>

              <p className="text-[10px] text-neutral-400 text-center font-bold uppercase tracking-widest mt-4">
                Password must be at least 6 characters long
              </p>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
