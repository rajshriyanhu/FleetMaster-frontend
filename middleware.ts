import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('accessToken');
    const isAuthPage = request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up';
    
    // If user is logged in and trying to access sign-in page
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is not logged in and trying to access protected routes
    if (!token && !isAuthPage) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
        const verify = await jwtVerify(token?.value || '', secret);
        console.log("Verify token : ",verify)
        return NextResponse.next();
    } catch (error) {
        // Token is invalid or expired
        console.log("error : ", error)
        if (!isAuthPage) {
            const response = NextResponse.redirect(new URL('/sign-in', request.url));
            response.cookies.set('accessToken', '', { maxAge: 0 });
            return response;
          }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/', '/sign-in', '/customers/:path*', '/drivers/:path*', '/trip/:path*', '/vehicle/:path*', '/forms/:path*', '/users/:path*'],
};