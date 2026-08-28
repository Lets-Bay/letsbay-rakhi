'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { showToast } from '@/components/Toast';

export default function SettingsPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileSlug, setProfileSlug] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      setName(user.name);
      // Fetch profile slug
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) setProfileSlug(data.profile.slug);
        });
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body: Record<string, string> = {};
      if (name !== user?.name) body.name = name;
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      if (Object.keys(body).length === 0) {
        showToast('No changes to save', 'info');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Failed to update settings', 'error');
      } else {
        showToast('Settings updated!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        await refreshUser();
      }
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
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
    <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
      <div className="max-w-md mx-auto">
        <h1 className="font-display text-3xl font-bold text-charcoal mb-8">
          Settings
        </h1>

        {/* Rakhi Link Info */}
        {profileSlug && (
          <div className="card !bg-maroon/5 !border-maroon/15 mb-6">
            <p className="text-xs text-charcoal-light/60 mb-1">Your Rakhi Link</p>
            <p className="text-maroon font-medium break-all">
              {typeof window !== 'undefined' ? window.location.origin : ''}/rakhi/{profileSlug}
            </p>
            <button
              onClick={() => router.push(`/share?slug=${profileSlug}`)}
              className="text-sm text-maroon font-medium hover:underline mt-2 cursor-pointer bg-transparent border-none"
            >
              Share →
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="input-field !bg-cream-dark/30"
              disabled
            />
            <p className="text-xs text-charcoal-light/50 mt-1">Email cannot be changed</p>
          </div>

          <div className="decorative-border" />

          <div>
            <h3 className="font-medium text-charcoal mb-3">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="currentPassword" className="block text-xs text-charcoal-light mb-1.5">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-xs text-charcoal-light mb-1.5">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? <span className="spinner" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
