'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-saffron/5 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-maroon/5 blur-3xl" />
        </div>

        <div className="relative max-w-2xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="decorative-dot" />
            <div className="decorative-border w-12" />
            <span className="text-4xl">🪢</span>
            <div className="decorative-border w-12" />
            <div className="decorative-dot" />
          </div>

          {/* Main headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight mb-6">
            Can&apos;t be together this{' '}
            <span className="text-maroon">Raksha Bandhan</span>?
          </h1>

          <p className="text-xl sm:text-2xl text-maroon font-display font-medium mb-4">
            Let your sisters tie you a Digital Rakhi ❤️
          </p>

          <p className="text-charcoal-light text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Create your personal Rakhi link, share it with your sisters, and collect their Rakhis wherever you are.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="btn-primary w-full sm:w-auto">
              🪢 Create My Rakhi Link
            </Link>
            <Link href="/login" className="btn-secondary w-full sm:w-auto">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Decorative separator */}
      <div className="decorative-border mx-8" />

      {/* How it works */}
      <section className="px-4 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center text-charcoal mb-12">
            How it works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-maroon/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Create your link</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Sign up and get your personal Rakhi link in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-saffron/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Share with sisters</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Send your link via WhatsApp or any messenger. Sisters don&apos;t need an account.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="font-semibold text-charcoal mb-2">Collect Rakhis</h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Your sisters choose a Rakhi, write a message, and tie it digitally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary CTA for sisters */}
      <section className="px-4 pb-16">
        <div className="max-w-md mx-auto text-center card !bg-cream-dark/30">
          <p className="text-sm text-charcoal-light mb-1">Looking to tie a Rakhi?</p>
          <p className="text-charcoal font-medium mb-4">
            Sisters don&apos;t need an account! Just open your brother&apos;s link.
          </p>
          <p className="text-xs text-charcoal-light/60">
            If you have a Rakhi link from your brother, simply open it in your browser.
          </p>
        </div>
      </section>
    </div>
  );
}
