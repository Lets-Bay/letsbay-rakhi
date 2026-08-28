import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication (client-side redirect handles the actual redirect,
// but this middleware ensures API-like protection)
const PROTECTED_ROUTES = ['/dashboard', '/create', '/share', '/settings'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route requires authentication
    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/create', '/share', '/settings'],
};
