'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ShareButtons from '@/components/ShareButtons';

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [slug, setSlug] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const slugParam = searchParams.get('slug');
    if (slugParam) {
      setSlug(slugParam);
    }

    // Fetch profile if no slug in params
    if (!slugParam && user) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setSlug(data.profile.slug);
            setDisplayName(data.profile.displayName);
          } else {
            router.push('/create');
          }
        });
    }
  }, [user, authLoading, searchParams, router]);

  useEffect(() => {
    if (user?.name && !displayName) {
      setDisplayName(user.name);
    }
  }, [user, displayName]);

  if (authLoading || !slug) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner !border-maroon/30 !border-t-maroon" />
      </div>
    );
  }

  const rakhiUrl = `/rakhi/${slug}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-maroon/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✨</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal">
            Your Rakhi link is ready!
          </h1>
          <p className="text-charcoal-light mt-2">
            Share it with your sisters so they can tie you a Rakhi
          </p>
        </div>

        {/* Link preview */}
        <div className="card !bg-maroon/5 !border-maroon/15 mb-6 text-center">
          <p className="text-sm text-charcoal-light mb-1">Your Rakhi page:</p>
          <p className="text-maroon font-semibold text-lg break-all">
            {typeof window !== 'undefined' ? window.location.origin : ''}{rakhiUrl}
          </p>
          <p className="text-sm text-charcoal-light mt-2">
            for <span className="font-semibold text-charcoal">{displayName || user?.name}</span>
          </p>
        </div>

        {/* Share Buttons */}
        <div className="card">
          <h2 className="font-semibold text-charcoal mb-4">Share your link</h2>
          <ShareButtons url={rakhiUrl} displayName={displayName || user?.name || ''} />
        </div>

        {/* Dashboard link */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-maroon font-medium hover:underline text-sm cursor-pointer bg-transparent border-none"
          >
            Go to my dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner !border-maroon/30 !border-t-maroon" />
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
