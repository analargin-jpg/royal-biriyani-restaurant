'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DeliveryTrackingView from '../../components/DeliveryTrackingView';

function DeliveryMapPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('order') || searchParams.get('q') || '';

  return <DeliveryTrackingView initialQuery={initialQuery} />;
}

export default function DeliveryMapPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-[#121010] text-amber-300">
        <p className="font-extrabold text-sm tracking-wide">Loading Royal Biriyani Satellite Map...</p>
      </div>
    }>
      <DeliveryMapPageContent />
    </Suspense>
  );
}
