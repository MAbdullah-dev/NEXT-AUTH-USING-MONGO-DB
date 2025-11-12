// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicPath = ['/login', '/signup', '/verify'].includes(path);
    const token = request.cookies.get('token')?.value || "";

    // Redirect logged-in users away from public pages
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect unauthenticated users to login
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Otherwise, let request continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/signup',
        '/profile/:id*', // support dynamic profile routes
        '/verify'
    ]
};
