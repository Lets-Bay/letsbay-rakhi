'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RakhiCard from '@/components/RakhiCard';
import ShareButtons from '@/components/ShareButtons';

interface RakhiData {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
  design: { name: string; imageUrl: string };
}

interface ProfileData {
  id: string;
  slug: string;
  displayName: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rakhis, setRakhis] = useState<RakhiData[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetch('/api/dashboard')
        .then((res) => res.json())
        .then((data) => {
          setProfile(data.profile);
          setRakhis(data.rakhis || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner !border-maroon/30 !border-t-maroon" />
      </div>
    );
  }

  // No profile yet
  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <span className="text-5xl mb-4 block">🪢</span>
          <h1 className="font-display text-2xl font-bold text-charcoal mb-3">
            Create your Rakhi page first
          </h1>
          <p className="text-charcoal-light mb-6">
            You need to create your Rakhi page before anyone can tie you a Rakhi.
          </p>
          <button onClick={() => router.push('/create')} className="btn-primary">
            ✨ Create My Rakhi Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-2">
            My Rakhis 🪢
          </h1>
          <p className="text-charcoal-light">
            Rakhis received from your sisters ❤️
          </p>
          {rakhis.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-maroon/10 rounded-full">
              <span className="font-display font-bold text-maroon text-lg">{rakhis.length}</span>
              <span className="text-sm text-maroon">
                {rakhis.length === 1 ? 'Rakhi' : 'Rakhis'}
              </span>
            </div>
          )}
        </div>

        {rakhis.length === 0 ? (
          /* Empty state */
          <div className="text-center max-w-md mx-auto">
            <div className="card !bg-cream-dark/30 mb-6">
              <span className="text-4xl block mb-3">🪢</span>
              <h2 className="font-display text-xl font-semibold text-charcoal mb-2">
                Your Rakhi collection is empty
              </h2>
              <p className="text-charcoal-light text-sm mb-5">
                Share your link with your sisters and let them tie you a Rakhi.
              </p>
              <button
                onClick={() => setShowShare(!showShare)}
                className="btn-primary !text-sm"
              >
                📱 Share My Rakhi Link
              </button>
            </div>

            {showShare && (
              <div className="card">
                <ShareButtons url={`/rakhi/${profile.slug}`} displayName={profile.displayName} />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Share button */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowShare(!showShare)}
                className="btn-secondary !text-sm"
              >
                📱 {showShare ? 'Hide' : 'Share My Rakhi Link'}
              </button>
              {showShare && (
                <div className="card mt-4 max-w-md mx-auto">
                  <ShareButtons url={`/rakhi/${profile.slug}`} displayName={profile.displayName} />
                </div>
              )}
            </div>

            {/* Rakhi grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {rakhis.map((rakhi) => (
                <RakhiCard
                  key={rakhi.id}
                  senderName={rakhi.senderName}
                  message={rakhi.message}
                  designImage={rakhi.design.imageUrl}
                  designName={rakhi.design.name}
                  createdAt={rakhi.createdAt}
                  onClick={() => router.push(`/dashboard/rakhi/${rakhi.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
