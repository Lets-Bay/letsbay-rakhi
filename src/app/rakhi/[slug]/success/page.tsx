'use client';

import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function SuccessContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const senderName = searchParams.get('name') || 'You';
  const message = searchParams.get('message') || '';
  const designId = searchParams.get('designId') || '';

  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    fetch(`/api/profile/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setProfileName(data.profile.displayName);
        }
      })
      .catch(() => {});
  }, [slug]);

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        {/* Success header */}
        <div className="mb-8">
          <div className="text-5xl mb-4">❤️</div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-3">
            You just tied a Rakhi!
          </h1>
          <p className="text-charcoal-light text-base leading-relaxed">
            Even though you couldn&apos;t be there in person, your Rakhi reached{' '}
            <span className="font-semibold text-charcoal">{profileName || 'your brother'}</span>.
          </p>
        </div>

        {/* Rakhi Card */}
        <div className="card mb-8">
          <div className="text-center">
            <p className="text-sm text-charcoal-light mb-1">Rakhi delivered ❤️</p>
            <p className="text-charcoal font-medium">
              {profileName} now has your Rakhi.
            </p>
          </div>

          <div className="decorative-border my-4" />

          <div className="text-left space-y-3">
            <div>
              <p className="text-xs text-charcoal-light/60">From</p>
              <p className="font-semibold text-charcoal">{senderName}</p>
            </div>
            {message && (
              <div>
                <p className="text-xs text-charcoal-light/60">Message</p>
                <p className="text-charcoal italic">&ldquo;{message}&rdquo;</p>
              </div>
            )}
            <div>
              <p className="text-xs text-charcoal-light/60">Date</p>
              <p className="text-sm text-charcoal">
                {new Date().toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Viral CTA */}
        <div className="card !bg-cream-dark/30 mb-6">
          <p className="text-sm text-charcoal-light mb-1">Are you a brother?</p>
          <p className="text-charcoal font-medium mb-4">
            Create your own Rakhi link and let your sisters tie you a Digital Rakhi.
          </p>
          <Link href="/signup" className="btn-primary !text-sm">
            🪢 Get My Rakhi Link
          </Link>
        </div>

        {/* Letsbay branding */}
        <div className="mt-10 pt-6 border-t border-cream-dark">
          <p className="text-xs text-charcoal-light/50 mb-2">
            Made with ❤️ by{' '}
            <a
              href="https://letsbay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon hover:underline font-medium"
            >
              Letsbay
            </a>
          </p>
          <p className="text-xs text-charcoal-light/40 max-w-sm mx-auto">
            Technology that helps people connect with the places and things they need.
          </p>
          <a
            href="https://letsbay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-xs text-maroon hover:underline font-medium"
          >
            Explore Letsbay →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner !border-maroon/30 !border-t-maroon" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
