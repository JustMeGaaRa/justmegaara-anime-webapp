import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge, getAuthorizationUrl } from '@/lib/mal/auth';

export async function GET(request: Request) {
  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId) {
    return new Response('MAL_CLIENT_ID is not configured in .env', { status: 500 });
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/callback`;

  const authUrl = getAuthorizationUrl({
    clientId,
    codeChallenge,
    redirectUri,
  });

  const response = NextResponse.redirect(authUrl);
  
  // Store the code verifier in an HttpOnly cookie to be read during callback
  response.cookies.set('mal_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10, // Expires in 10 minutes
  });

  return response;
}
