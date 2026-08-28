'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreatePage() {
  const [displayName, setDisplayName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name);
    }
  }, [user]);

  const generateSlugPreview = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: Record<string, string> = { displayName };
      if (slug.trim()) {
        body.slug = slug.toLowerCase().trim();
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.status === 409 && data.profile?.slug) {
        // User already has a profile, redirect to share
        router.push(`/share?slug=${data.profile.slug}`);
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      router.push(`/share?slug=${data.profile.slug}`);
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner !border-maroon/30 !border-t-maroon" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🪢</span>
          <h1 className="font-display text-3xl font-bold text-charcoal mt-4">
            Create your Rakhi page
          </h1>
          <p className="text-charcoal-light mt-2">
            Your sisters will use this link to tie you a Rakhi
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-charcoal mb-2">
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
              required
              minLength={2}
              maxLength={50}
            />
            <p className="text-xs text-charcoal-light/60 mt-1.5">
              This is what your sisters will see
            </p>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-charcoal mb-2">
              Custom Link <span className="text-charcoal-light/50">(optional)</span>
            </label>
            <div className="flex items-center gap-0">
              <span className="bg-cream-dark text-charcoal-light text-sm px-3 py-3.5 rounded-l-xl border-2 border-r-0 border-cream-dark">
                /rakhi/
              </span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder={generateSlugPreview(displayName) || 'your-name'}
                className="input-field !rounded-l-none"
                maxLength={30}
              />
            </div>
            <p className="text-xs text-charcoal-light/60 mt-1.5">
              Leave empty to auto-generate from your name
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !displayName.trim()}
            className="btn-primary w-full"
          >
            {loading ? <span className="spinner" /> : '✨ Create My Rakhi Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
