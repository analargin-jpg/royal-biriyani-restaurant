'use client';

import React, { useState } from 'react';
import { X, User, Phone, Lock, Mail, MapPin, Sparkles, CheckCircle2, AlertCircle, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { authApi } from '../lib/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login Form State
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  // Signup Form State
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authApi.userLogin(loginData.identifier, loginData.password);
      setSuccessMsg(res.message || 'Login successful!');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }, 700);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await authApi.userRegister(signupData);
      setSuccessMsg(res.message || 'Account created successfully!');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }, 800);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 z-10 transition transform">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-royal-crimson via-royal-crimson-dark to-royal-crimson p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-royal-gold text-[11px] font-bold uppercase tracking-wider mb-2 border border-royal-gold/30">
            <Sparkles className="w-3.5 h-3.5 text-royal-gold" /> Royal Biriyani Customer Club
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            {tab === 'login' ? 'Sign In to Your Account' : 'Create Customer Account'}
          </h3>
          <p className="text-amber-200 text-xs mt-1">
            {tab === 'login' 
              ? 'Access fast 1-click checkout, past orders & special offers' 
              : 'Join to save your address & track royal orders effortlessly'}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-5 border border-white/10">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-white text-royal-crimson shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                tab === 'signup'
                  ? 'bg-white text-royal-crimson shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" /> Sign Up
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN TAB */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-royal-crimson" /> Phone Number or Email *
                </label>
                <input
                  type="text"
                  required
                  value={loginData.identifier}
                  onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                  placeholder="e.g. 9876543210 or name@example.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-royal-crimson" /> Password *
                </label>
                <input
                  type="password"
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:border-royal-crimson focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-royal-crimson to-royal-crimson-dark text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
              >
                {loading ? 'Signing In...' : (
                  <>
                    Sign In to Royal Biriyani <ArrowRight className="w-4 h-4 text-royal-gold" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('signup'); setError(''); }}
                    className="text-royal-crimson font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* 2. SIGN UP TAB */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-royal-crimson" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  placeholder="e.g. Karthick Raja"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-royal-crimson" /> Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-royal-crimson" /> Create Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  placeholder="At least 4 characters"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-royal-crimson" /> Default Delivery Address (Optional)
                </label>
                <input
                  type="text"
                  value={signupData.address}
                  onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                  placeholder="Street, Area, Komarapalayam"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-crimson focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-royal-crimson to-royal-crimson-dark text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 mt-2"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    <UserPlus className="w-4 h-4 text-royal-gold" /> Create My Account
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setError(''); }}
                    className="text-royal-crimson font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
