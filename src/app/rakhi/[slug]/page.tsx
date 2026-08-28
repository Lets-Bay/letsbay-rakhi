'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RakhiSelector from '@/components/RakhiSelector';
import MessageSuggestions from '@/components/MessageSuggestions';
import TyingAnimation from '@/components/TyingAnimation';

interface RakhiDesign {
  id: string;
  name: string;
  imageUrl: string;
  description: string | null;
}

interface Profile {
  id: string;
  displayName: string;
  slug: string;
  customMessage: string | null;
}

export default function PublicRakhiPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [designs, setDesigns] = useState<RakhiDesign[]>([]);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [step, setStep] = useState<'select' | 'details'>('select');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setPageError(data.error || 'This Rakhi link doesn\'t exist');
          setLoading(false);
          return;
        }

        setProfile(data.profile);
        setDesigns(data.designs);
      } catch {
        setPageError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [slug]);

  const handleAnimationComplete = useCallback(() => {
    router.push(`/rakhi/${slug}/success?name=${encodeURIComponent(senderName)}&designId=${selectedDesignId}&message=${encodeURIComponent(message)}`);
  }, [router, slug, senderName, selectedDesignId, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDesignId || submitting) return;
    
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/rakhi/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          designId: selectedDesignId,
          senderName: senderName.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      // Show tying animation
      setShowAnimation(true);
    } catch {
      setError('Something went wrong while tying your Rakhi. Please try again.');
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner !border-maroon/30 !border-t-maroon mx-auto mb-4" />
          <p className="text-charcoal-light text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (pageError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-md">
          <span className="text-5xl mb-4 block">😔</span>
          <h1 className="font-display text-2xl font-bold text-charcoal mb-3">
            {pageError}
          </h1>
          <p className="text-charcoal-light mb-6">
            {pageError.includes('doesn\'t exist')
              ? 'This Rakhi link may have been removed or the URL is incorrect.'
              : 'Please check the link and try again.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const selectedDesign = designs.find((d) => d.id === selectedDesignId);

  return (
    <>
      {/* Tying Animation Overlay */}
      {showAnimation && selectedDesign && (
        <TyingAnimation
          rakhiImage={selectedDesign.imageUrl}
          senderName={senderName}
          brotherName={profile.displayName}
          message={message}
          onComplete={handleAnimationComplete}
        />
      )}

      <div className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="decorative-dot" />
              <div className="decorative-border w-8" />
              <span className="text-3xl">❤️</span>
              <div className="decorative-border w-8" />
              <div className="decorative-dot" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              <span className="text-maroon">{profile.displayName}</span> wants you
              <br /> to tie him a Rakhi
            </h1>

            <p className="text-charcoal-light text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Even if we&apos;re far apart, you can still make this Raksha Bandhan special.
            </p>
          </div>

          {step === 'select' && (
            <>
              {/* Rakhi Selection */}
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-charcoal mb-5 text-center">
                  Choose a Rakhi for {profile.displayName}
                </h2>
                <RakhiSelector
                  designs={designs}
                  selectedId={selectedDesignId}
                  onSelect={(id) => {
                    setSelectedDesignId(id);
                  }}
                />
              </div>

              {selectedDesignId && (
                <div className="text-center">
                  <button
                    onClick={() => setStep('details')}
                    className="btn-primary"
                  >
                    Continue →
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit} className="card max-w-md mx-auto">
              {/* Selected Rakhi preview */}
              {selectedDesign && (
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-2">
                    <img
                      src={selectedDesign.imageUrl}
                      alt={selectedDesign.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-xs text-charcoal-light">
                    {selectedDesign.name}
                    <button
                      type="button"
                      onClick={() => setStep('select')}
                      className="ml-2 text-maroon underline cursor-pointer bg-transparent border-none text-xs"
                    >
                      Change
                    </button>
                  </p>
                </div>
              )}

              <h2 className="font-display text-xl font-semibold text-charcoal mb-5">
                Your Rakhi
              </h2>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-charcoal mb-2">
                    Your Name
                  </label>
                  <input
                    id="senderName"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Enter your name"
                    className="input-field"
                    required
                    minLength={2}
                    maxLength={50}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write something for your brother..."
                    className="input-field !min-h-[100px] resize-none"
                    required
                    maxLength={500}
                  />
                  <p className="text-xs text-charcoal-light/50 mt-1 text-right">
                    {message.length}/500
                  </p>
                </div>

                {/* Message suggestions */}
                <div>
                  <p className="text-xs text-charcoal-light/60 mb-2">Or pick a message:</p>
                  <MessageSuggestions onSelect={setMessage} />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !senderName.trim() || !message.trim()}
                  className="btn-primary w-full"
                >
                  {submitting ? <span className="spinner" /> : '🪢 Tie Rakhi'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
