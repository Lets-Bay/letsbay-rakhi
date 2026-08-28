'use client';

import { useEffect, useState, useRef } from 'react';

interface TyingAnimationProps {
  rakhiImage: string;
  senderName: string;
  brotherName: string;
  message: string;
  onComplete: () => void;
}

export default function TyingAnimation({
  rakhiImage,
  senderName,
  brotherName,
  message,
  onComplete,
}: TyingAnimationProps) {
  const [phase, setPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Skip to final state
      setPhase(4);
      setTimeout(onComplete, 500);
      return;
    }

    const timers = [
      setTimeout(() => setPhase(1), 300),   // Rakhi appears
      setTimeout(() => setPhase(2), 1200),  // Tying animation
      setTimeout(() => setPhase(3), 2200),  // Celebration
      setTimeout(() => setPhase(4), 3200),  // Message appears
      setTimeout(onComplete, 4500),          // Complete
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Spawn particles
  useEffect(() => {
    if (phase === 3 && containerRef.current) {
      // Use canvas-confetti if available
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#800020', '#FF9933', '#D4A574', '#E8A0B0', '#FFD700'],
          disableForReducedMotion: true,
        });
      }).catch(() => {
        // Graceful fallback — no confetti
      });
    }
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream/95 backdrop-blur-sm"
    >
      <div className="text-center px-6 max-w-md">
        {/* Phase 0-1: Rakhi appears */}
        <div
          className={`
            transition-all duration-700 ease-out mb-6
            ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
        >
          <div className={`
            w-32 h-32 mx-auto mb-4
            ${phase === 2 ? 'animate-pulse-slow' : ''}
            ${phase >= 2 ? 'rotate-0' : '-rotate-12'}
            transition-transform duration-700
          `}>
            <img
              src={rakhiImage}
              alt="Rakhi"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Phase 2: Tying text */}
        <div
          className={`
            transition-all duration-500
            ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <p className="text-lg text-maroon font-display font-semibold">
            {phase === 2 ? 'Tying your Rakhi...' : ''}
          </p>
        </div>

        {/* Phase 3-4: Celebration */}
        <div
          className={`
            transition-all duration-700
            ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <div className="space-y-3">
            <p className="text-3xl">❤️</p>
            <h2 className="text-2xl font-display font-bold text-maroon">
              Rakhi tied successfully!
            </h2>
            <p className="text-charcoal-light">
              Your Rakhi has been delivered to <span className="font-semibold text-charcoal">{brotherName}</span>
            </p>
          </div>
        </div>

        {/* Phase 4: Message */}
        <div
          className={`
            mt-6 transition-all duration-700
            ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          `}
        >
          <div className="card !p-5">
            <p className="text-sm text-charcoal-light/60 mb-1">{senderName}&apos;s message:</p>
            <p className="text-charcoal italic">&ldquo;{message}&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}
