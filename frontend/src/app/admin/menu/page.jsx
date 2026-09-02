'use client';

import React, { useState, useEffect } from 'react';
import MenuManager from '../../../components/MenuManager';
import AdminLoginModal from '../../../components/AdminLoginModal';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function AdminMenuPage() {
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-2 text-royal-crimson font-bold text-sm">
          <ShieldCheck className="w-5 h-5 animate-spin" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLoginModal onLoginSuccess={(user) => setAdmin(user)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
          <Link
            href="/admin"
            className="text-xs font-bold text-royal-crimson hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders Dashboard
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-gray-600 hover:text-royal-crimson transition"
          >
            Visit Customer Website
          </Link>
        </div>

        <MenuManager />
      </div>
    </div>
  );
}
