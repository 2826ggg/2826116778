'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123456');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(email, password);
      router.push('/market');
    } catch (err) {
      setLocalError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-dark-bg min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">Login</h1>

          {(error || localError) && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-4">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              No account?{' '}
              <Link href="/register" className="text-blue-500 hover:text-blue-400">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-900 bg-opacity-30 border border-blue-800 rounded text-blue-200 text-sm">
            <p className="font-bold mb-2">Demo Account:</p>
            <p>Email: demo@example.com</p>
            <p>Password: demo123456</p>
          </div>
        </div>
      </div>
    </>
  );
}
