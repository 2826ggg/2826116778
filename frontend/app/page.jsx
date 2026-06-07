'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useMarketStore } from '@/lib/store';
import MarketTable from '@/components/MarketTable';
import PriceChart from '@/components/PriceChart';

export default function Home() {
  const router = useRouter();
  const { symbols, fetchSymbols } = useMarketStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSymbols = async () => {
      try {
        await fetchSymbols();
      } catch (error) {
        console.error('Failed to load symbols:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSymbols();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-dark-bg min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-900 to-dark-bg py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">🚀 Virtual Trading Platform</h1>
              <p className="text-xl text-gray-400 mb-8">Practice trading with virtual assets - No real money involved</p>
              <div className="flex gap-4 justify-center">
                <Link href="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                  Get Started
                </Link>
                <Link href="/market" className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-600 hover:text-white">
                  View Market
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Market Overview */}
        <section className="py-12 border-t border-gray-800">
          <div className="container">
            <h2 className="text-3xl font-bold text-white mb-8">📊 Market Overview</h2>
            {isLoading ? (
              <div className="text-center text-gray-400">Loading market data...</div>
            ) : (
              <>
                <PriceChart />
                <div className="mt-8">
                  <MarketTable symbols={symbols} />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 border-t border-gray-800">
          <div className="container">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">✨ Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📈', title: 'Real-time Charts', desc: 'Advanced K-line charts with technical indicators' },
                { icon: '💼', title: 'Trading', desc: 'Buy and sell with market and limit orders' },
                { icon: '👛', title: 'Portfolio', desc: 'Track your positions and performance' },
                { icon: '🎁', title: 'Rewards', desc: 'VIP tiers and referral bonuses' },
              ].map((feature, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-600 transition">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
