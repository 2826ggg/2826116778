'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuthStore, useTradeStore, axiosInstance } from '@/lib/store';

export default function TradePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { buyOrder, sellOrder } = useTradeStore();
  const [symbol, setSymbol] = useState('BTC/USD');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assets, setAssets] = useState(null);

  const SYMBOLS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'TSLA', 'AAPL', 'NVDA', 'META', 'AMZN'];

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchAssets();
    }
  }, [user, router]);

  const fetchAssets = async () => {
    try {
      const response = await axiosInstance.get('/user/assets');
      setAssets(response.data);
    } catch (err) {
      setError('Failed to fetch assets');
    }
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await buyOrder(symbol, parseFloat(quantity), parseFloat(price), orderType);
      setSuccess(`Buy order placed for ${quantity} ${symbol}`);
      setQuantity('');
      setPrice('');
      await fetchAssets();
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await sellOrder(symbol, parseFloat(quantity), parseFloat(price), orderType);
      setSuccess(`Sell order placed for ${quantity} ${symbol}`);
      setQuantity('');
      setPrice('');
      await fetchAssets();
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-dark-bg min-h-screen py-8">
        <div className="container">
          <h1 className="text-4xl font-bold text-white mb-8">📈 Trading</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trading Panel */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-white font-bold text-xl mb-6">Trading</h2>

              {error && (
                <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded mb-4 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Symbol</label>
                  <select
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2"
                  >
                    {SYMBOLS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2"
                  >
                    <option value="market">Market Order</option>
                    <option value="limit">Limit Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2"
                  />
                </div>

                {orderType === 'limit' && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Enter price"
                      className="w-full bg-gray-800 border border-gray-700 text-white rounded px-4 py-2"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleBuy}
                    disabled={isLoading || !quantity}
                    className="flex-1 bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : '💰 BUY'}
                  </button>
                  <button
                    onClick={handleSell}
                    disabled={isLoading || !quantity}
                    className="flex-1 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : '📊 SELL'}
                  </button>
                </div>
              </div>
            </div>

            {/* Assets Info */}
            <div className="lg:col-span-2 space-y-6">
              {assets && (
                <>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4">💰 Assets</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Total Assets</p>
                        <p className="text-white text-2xl font-bold">${assets.totalAssets?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Available</p>
                        <p className="text-green-500 text-2xl font-bold">${assets.availableAssets?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Frozen</p>
                        <p className="text-yellow-500 text-2xl font-bold">${assets.frozenAssets?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Positions</p>
                        <p className="text-blue-500 text-2xl font-bold">${assets.positionAssets?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h3 className="text-white font-bold mb-4">💳 Wallets</h3>
                    <div className="space-y-2">
                      {assets.wallets?.map((wallet) => (
                        <div key={wallet.currency} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                          <span className="text-white font-bold">{wallet.currency}</span>
                          <span className="text-gray-400 text-sm">${wallet.balance.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
