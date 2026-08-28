'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-gold-light/30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-maroon font-bold text-lg no-underline">
          <span className="text-2xl">🪢</span>
          <span className="font-display">Digital Rakhi</span>
        </Link>

        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-charcoal-light hover:text-maroon transition-colors text-sm font-medium no-underline"
                >
                  My Rakhis
                </Link>
                <Link
                  href="/settings"
                  className="text-charcoal-light hover:text-maroon transition-colors text-sm font-medium no-underline"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-charcoal-light hover:text-maroon transition-colors font-medium bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-charcoal-light hover:text-maroon transition-colors font-medium no-underline"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary !py-2 !px-5 !text-sm !min-h-0 !rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
