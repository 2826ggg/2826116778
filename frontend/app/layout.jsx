'use client';

import './globals.css';

export const metadata = {
  title: 'Virtual Trading Platform',
  description: 'Practice trading with virtual assets',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
