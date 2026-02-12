import React from 'react';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }} />
    </div>
  );
};
