'use client';

import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateChartData = () => {
  const data = [];
  let value = 100;
  for (let i = 0; i < 30; i++) {
    value += (Math.random() - 0.5) * 5;
    data.push({
      time: `${i}h`,
      price: Math.round(value * 100) / 100,
    });
  }
  return data;
};

export default function PriceChart() {
  const [data, setData] = React.useState(generateChartData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateChartData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg p-4 border border-gray-800">
      <h3 className="text-white font-bold mb-4">Price Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1e27',
              border: '1px solid #444',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#1976d2"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
