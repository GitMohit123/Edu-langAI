import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/aws/auth';

export async function authMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add the decoded user to the request headers for use in the route handler
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);
    requestHeaders.set('x-user-name', decoded.name);
    requestHeaders.set('x-user-role', decoded.role);
    requestHeaders.set('x-user-tokens-available', decoded.tokensAvailable.toString());

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 