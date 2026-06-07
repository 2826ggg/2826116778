'use client';

import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function MarketTable({ symbols = [] }) {
  return (
    <div className="w-full bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-800">
            <th className="px-6 py-4 text-left text-gray-400">Symbol</th>
            <th className="px-6 py-4 text-right text-gray-400">Price</th>
            <th className="px-6 py-4 text-right text-gray-400">24h Change</th>
            <th className="px-6 py-4 text-right text-gray-400">24h High</th>
            <th className="px-6 py-4 text-right text-gray-400">24h Low</th>
            <th className="px-6 py-4 text-right text-gray-400">Volume</th>
          </tr>
        </thead>
        <tbody>
          {symbols.map((symbol) => {
            const isPositive = symbol.change >= 0;
            return (
              <tr key={symbol.symbol} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="px-6 py-4 font-medium text-white">{symbol.symbol}</td>
                <td className="px-6 py-4 text-right text-white font-bold">${symbol.price.toFixed(2)}</td>
                <td className={`px-6 py-4 text-right flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <FiArrowUp /> : <FiArrowDown />}
                  {symbol.changePercent?.toFixed(2)}%
                </td>
                <td className="px-6 py-4 text-right text-gray-400">${symbol.high?.toFixed(2) || 'N/A'}</td>
                <td className="px-6 py-4 text-right text-gray-400">${symbol.low?.toFixed(2) || 'N/A'}</td>
                <td className="px-6 py-4 text-right text-gray-400">{(symbol.volume / 1000000).toFixed(2)}M</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
