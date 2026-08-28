'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RakhiCard from '@/components/RakhiCard';

interface RakhiDetail {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
  design: { name: string; imageUrl: string; description: string | null };
}

export default function RakhiDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [rakhi, setRakhi] = useState<RakhiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && params.id) {
      fetch(`/api/dashboard/rakhi/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRakhi(data.rakhi);
          }
        })
        .catch(() => setError('Something went wrong'))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, params.id, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner !border-maroon/30 !border-t-maroon" />
      </div>
    );
  }

  if (error || !rakhi) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <span className="text-5xl mb-4 block">😔</span>
          <h1 className="font-display text-xl font-bold text-charcoal mb-3">
            {error || 'Rakhi not found'}
          </h1>
          <button onClick={() => router.push('/dashboard')} className="btn-primary !text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-maroon text-sm font-medium hover:underline mb-6 inline-block cursor-pointer bg-transparent border-none"
        >
          ← Back to My Rakhis
        </button>

        <RakhiCard
          senderName={rakhi.senderName}
          message={rakhi.message}
          designImage={rakhi.design.imageUrl}
          designName={rakhi.design.name}
          createdAt={rakhi.createdAt}
          large
        />

        {rakhi.design.description && (
          <p className="text-center text-xs text-charcoal-light/50 mt-4">
            Design: {rakhi.design.name} — {rakhi.design.description}
          </p>
        )}
      </div>
    </div>
  );
}
