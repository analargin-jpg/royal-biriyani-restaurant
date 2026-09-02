'use client';

import React, { useState, useEffect } from 'react';
import AdminLoginModal from '../../components/AdminLoginModal';
import AdminDashboard from '../../components/AdminDashboard';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('royal_admin_token');
    const userStr = localStorage.getItem('royal_admin_user');
    if (token && userStr) {
      try {
        setAdmin(JSON.parse(userStr));
      } catch (e) {
        setAdmin({ username: 'admin', phone: '6384945599', role: 'admin' });
      }
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    localStorage.removeItem('royal_admin_token');
    localStorage.removeItem('royal_admin_user');
    setAdmin(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-2 text-royal-crimson font-bold text-sm">
          <ShieldCheck className="w-5 h-5 animate-spin" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back to public website bar */}
      <div className="bg-royal-charcoal text-white text-xs py-2 px-4 flex justify-between items-center border-b border-gray-800">
        <Link
          href="/"
          className="hover:text-royal-gold transition flex items-center gap-1.5 font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Royal Biriyani Customer Website
        </Link>
        <span className="text-gray-400">
          Logged in as: <strong className="text-yellow-300">{admin ? admin.username : 'Guest'}</strong>
        </span>
      </div>

      {!admin ? (
        <AdminLoginModal onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminDashboard admin={admin} onLogout={handleLogout} />
      )}
    </div>
  );
}
