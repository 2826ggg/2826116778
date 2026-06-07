'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-blue-500">
          💰 Trading
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/market" className="text-gray-400 hover:text-white">
                Market
              </Link>
              <Link href="/trade" className="text-gray-400 hover:text-white">
                Trade
              </Link>
              <Link href="/portfolio" className="text-gray-400 hover:text-white">
                Portfolio
              </Link>
              <Link href="/profile" className="text-gray-400 hover:text-white">
                {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-blue-500 hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
