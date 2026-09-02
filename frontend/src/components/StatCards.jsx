'use client';

import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, CheckCheck, Users } from 'lucide-react';

export default function StatCards({ stats = {}, orders = [] }) {
  const total = stats.total ?? orders.length;
  const pending = stats.pending ?? orders.filter(o => o.status === 'pending').length;
  const confirmed = stats.confirmed ?? orders.filter(o => o.status === 'confirmed').length;
  const completed = stats.completed ?? orders.filter(o => o.status === 'completed').length;
  const totalGuests = stats.totalGuests ?? orders.reduce((sum, o) => {
    const val = parseInt(o.guestCount, 10);
    return !isNaN(val) ? sum + val : sum;
  }, 0);

  const cards = [
    {
      label: 'Total Orders',
      value: total,
      icon: ShoppingBag,
      color: 'border-royal-gold text-royal-gold-dark bg-amber-50/50',
      badge: 'All Time'
    },
    {
      label: 'Pending Approval',
      value: pending,
      icon: Clock,
      color: 'border-amber-500 text-amber-600 bg-amber-50/50',
      badge: 'Needs Review'
    },
    {
      label: 'Confirmed Orders',
      value: confirmed,
      icon: CheckCircle2,
      color: 'border-blue-500 text-blue-600 bg-blue-50/50',
      badge: 'In Prep'
    },
    {
      label: 'Completed Orders',
      value: completed,
      icon: CheckCheck,
      color: 'border-emerald-500 text-emerald-600 bg-emerald-50/50',
      badge: 'Delivered'
    },
    {
      label: 'Est. Guests Served',
      value: totalGuests,
      icon: Users,
      color: 'border-purple-500 text-purple-600 bg-purple-50/50',
      badge: 'Catered'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-white border-2 shadow-xs flex flex-col justify-between ${c.color} transition hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                {c.label}
              </span>
              <Icon className="w-4 h-4 opacity-75" />
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-black text-gray-900">
                {c.value}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border border-gray-200 text-gray-600">
                {c.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
