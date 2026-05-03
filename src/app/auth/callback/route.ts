import { NextRequest, NextResponse } from 'next/server';
import { exchangeCode } from '@/lib/mal/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  // Next.js 16 allows synchronously accessing request.cookies in route handlers when using NextRequest.
  const codeVerifier = request.cookies.get('mal_code_verifier')?.value;

  if (!codeVerifier) {
    return NextResponse.redirect(new URL('/?error=missing_verifier', request.url));
  }

  const clientId = process.env.MAL_CLIENT_ID;
  const clientSecret = process.env.MAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('Missing client credentials in .env', { status: 500 });
  }

  try {
    const redirectUri = `${url.origin}/auth/callback`;
    const tokens = await exchangeCode({
      clientId,
      clientSecret,
      code,
      codeVerifier,
      redirectUri,
    });

    const response = NextResponse.redirect(new URL('/', request.url));
    
    // Set access token
    response.cookies.set('mal_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: tokens.expires_in,
    });
    
    // Set refresh token
    response.cookies.set('mal_refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Clean up the code verifier cookie
    response.cookies.delete('mal_code_verifier');

    return response;
  } catch (err) {
    console.error('MAL Token Exchange Error:', err);
    return NextResponse.redirect(new URL('/?error=exchange_failed', request.url));
  }
}
