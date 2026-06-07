'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore, axiosInstance } from '@/lib/store';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout, adminLogin } = useAuthStore();
  const [isLoginForm, setIsLoginForm] = useState(!user);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123456');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await adminLogin(username, password);
      setIsLoginForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/admin/orders');
      setOrders(response.data);
    } catch (err) {
      setError('Failed to fetch orders');
    }
  };

  useEffect(() => {
    if (user && activeTab === 'users') {
      fetchUsers();
    } else if (user && activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, activeTab]);

  if (isLoginForm) {
    return (
      <>
        <Navbar />
        <div className="bg-dark-bg min-h-screen flex items-center justify-center py-12">
          <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center">🔐 Admin Login</h1>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Admin Login'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 border border-blue-800 rounded text-blue-200 text-sm">
              <p className="font-bold mb-2">Demo Admin Account:</p>
              <p>Username: admin</p>
              <p>Password: admin123456</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-dark-bg min-h-screen py-8">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">🎛️ Admin Dashboard</h1>
            <button
              onClick={() => {
                logout();
                setIsLoginForm(true);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-800">
            {['users', 'orders', 'market', 'finances'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-bold uppercase transition ${
                  activeTab === tab
                    ? 'text-blue-500 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'users' && '👥 Users'}
                {tab === 'orders' && '📋 Orders'}
                {tab === 'market' && '📊 Market'}
                {tab === 'finances' && '💰 Finances'}
              </button>
            ))}
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-400">User ID</th>
                    <th className="px-6 py-4 text-left text-gray-400">Email</th>
                    <th className="px-6 py-4 text-left text-gray-400">Username</th>
                    <th className="px-6 py-4 text-left text-gray-400">VIP Level</th>
                    <th className="px-6 py-4 text-left text-gray-400">Created</th>
                    <th className="px-6 py-4 text-left text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-6 py-4 text-white text-sm font-mono">{u.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 text-white">{u.email}</td>
                      <td className="px-6 py-4 text-white">{u.username}</td>
                      <td className="px-6 py-4 text-yellow-500 font-bold">VIP{u.vip_level}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-gray-400">Order ID</th>
                    <th className="px-6 py-4 text-left text-gray-400">User</th>
                    <th className="px-6 py-4 text-left text-gray-400">Symbol</th>
                    <th className="px-6 py-4 text-left text-gray-400">Side</th>
                    <th className="px-6 py-4 text-left text-gray-400">Quantity</th>
                    <th className="px-6 py-4 text-left text-gray-400">Price</th>
                    <th className="px-6 py-4 text-left text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-gray-400">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-6 py-4 text-white text-sm font-mono">{o.id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 text-white text-sm">{o.user_id.substring(0, 8)}...</td>
                      <td className="px-6 py-4 text-white font-bold">{o.symbol}</td>
                      <td className={`px-6 py-4 font-bold ${o.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                        {o.side}
                      </td>
                      <td className="px-6 py-4 text-white">{o.quantity}</td>
                      <td className="px-6 py-4 text-white">${o.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-white text-sm ${
                          o.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(o.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Market Tab */}
          {activeTab === 'market' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">📊 Market Control</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price Trend</label>
                    <select className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2">
                      <option>📈 Uptrend</option>
                      <option>📉 Downtrend</option>
                      <option>➡️ Sideways</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Volatility Range (%)</label>
                    <input type="number" min="0" max="100" defaultValue="2" className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2" />
                  </div>
                  <button className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                    Apply
                  </button>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-white font-bold mb-4">🔧 K-Line Generation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Symbol</label>
                    <select className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2">
                      <option>BTC/USD</option>
                      <option>ETH/USD</option>
                      <option>SOL/USD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Period</label>
                    <select className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2">
                      <option>1m</option>
                      <option>5m</option>
                      <option>1h</option>
                      <option>1d</option>
                    </select>
                  </div>
                  <button className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Finances Tab */}
          {activeTab === 'finances' && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-white font-bold mb-4">💰 Financial Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Users', value: users.length },
                  { label: 'Total Orders', value: orders.length },
                  { label: 'Platform Assets', value: '$0' },
                  { label: 'Daily Revenue', value: '$0' },
                ].map((stat, i) => (
                  <div key={i} className="bg-gray-800 rounded p-4">
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
