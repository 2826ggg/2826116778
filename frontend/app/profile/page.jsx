'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuthStore, axiosInstance } from '@/lib/store';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [assets, setAssets] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchData();
    }
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [profileRes, assetsRes, ordersRes] = await Promise.all([
        axiosInstance.get('/user/profile'),
        axiosInstance.get('/user/assets'),
        axiosInstance.get('/user/orders'),
      ]);
      setProfile(profileRes.data);
      setAssets(assetsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-dark-bg min-h-screen flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-dark-bg min-h-screen py-8">
        <div className="container">
          <h1 className="text-4xl font-bold text-white mb-8">👤 Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-white font-bold text-xl mb-4">Account Info</h2>
              {profile && (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Username</p>
                    <p className="text-white font-bold">{profile.username}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-bold">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">VIP Level</p>
                    <p className="text-yellow-500 font-bold text-lg">VIP {profile.vip_level}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Joined</p>
                    <p className="text-white">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Assets Summary */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-white font-bold text-xl mb-4">💰 Assets</h2>
              {assets && (
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Total Assets</p>
                    <p className="text-white font-bold text-2xl">${assets.totalAssets?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Available</p>
                    <p className="text-green-500 font-bold">${assets.availableAssets?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Frozen</p>
                    <p className="text-yellow-500 font-bold">${assets.frozenAssets?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">In Positions</p>
                    <p className="text-blue-500 font-bold">${assets.positionAssets?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Wallets */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-white font-bold text-xl mb-4">💳 Wallets</h2>
              {assets?.wallets && (
                <div className="space-y-2">
                  {assets.wallets.map((wallet) => (
                    <div key={wallet.currency} className="bg-gray-800 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="text-white font-bold">{wallet.currency}</span>
                        <span className="text-gray-400">${wallet.balance.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Available: ${wallet.available.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Orders History */}
          <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-white font-bold text-xl">📊 Order History</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-gray-400">Symbol</th>
                  <th className="px-6 py-4 text-left text-gray-400">Side</th>
                  <th className="px-6 py-4 text-right text-gray-400">Quantity</th>
                  <th className="px-6 py-4 text-right text-gray-400">Price</th>
                  <th className="px-6 py-4 text-left text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="px-6 py-4 text-white font-bold">{order.symbol}</td>
                      <td className={`px-6 py-4 font-bold ${order.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                        {order.side}
                      </td>
                      <td className="px-6 py-4 text-white text-right">{order.quantity}</td>
                      <td className="px-6 py-4 text-white text-right">${order.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-sm ${
                          order.status === 'completed' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
