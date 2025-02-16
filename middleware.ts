import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');
    console.log(token)
    if (!token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/customers/:path*', '/drivers/:path*', '/trip/:path*', '/vehicle/:path*', '/forms/:path*', '/users/:path*'],
};