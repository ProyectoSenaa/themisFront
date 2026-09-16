import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers
    const headers = response.headers;
    headers.set('X-DNS-Prefetch-Control', 'on');
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    headers.set('X-Frame-Options', 'SAMEORIGIN');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'origin-when-cross-origin');

    // Basic CSRF Protection for Mutations
    // Check Origin/Referer for POST/PUT/DELETE/PATCH requests
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const origin = request.headers.get('origin');
        const referer = request.headers.get('referer');
        const host = request.headers.get('host'); // e.g. localhost:3000

        // Allow requests if Origin/Referer matches the Host
        // Note: In production, you might need to check against a list of allowed domains
        if (origin) {
            const originHost = new URL(origin).host;
            if (originHost !== host) {
                return new NextResponse(JSON.stringify({ message: 'CSRF Validation Failed' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
            }
        } else if (referer) {
            const refererHost = new URL(referer).host;
            if (refererHost !== host) {
                return new NextResponse(JSON.stringify({ message: 'CSRF Validation Failed' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
            }
        }
        // If neither Origin nor Referer is present, you might choose to block or allow depending on strictness.
        // For now, we allow to avoid blocking legitimate clients that suppress these headers, but warn in logs.
    }

    return response;
}

export const config = {
    matcher: '/:path*',
};
