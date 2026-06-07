'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MarketTable from '@/components/MarketTable';
import { useMarketStore } from '@/lib/store';
import { useAuthStore } from '@/lib/store';

export default function MarketPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { symbols, fetchSymbols, isLoading } = useMarketStore();
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    fetchSymbols();
    const interval = setInterval(fetchSymbols, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-dark-bg min-h-screen py-8">
        <div className="container">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <h3 className="text-white font-bold mb-4">📊 Symbols</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {symbols.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => setSelectedSymbol(s.symbol)}
                      className={`w-full text-left px-4 py-2 rounded transition ${
                        selectedSymbol === s.symbol
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {s.symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-8">Market Data</h1>
              {isLoading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : (
                <MarketTable symbols={symbols} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
