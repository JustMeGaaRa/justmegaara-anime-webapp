import type { MALToken } from './types';

const AUTH_BASE = 'https://myanimelist.net/v1/oauth2';

function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generates a cryptographically random code verifier for PKCE.
 * Store this alongside the auth flow — you'll need it in exchangeCode().
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array.buffer);
}

/**
 * MAL only supports the "plain" code_challenge_method, so the challenge
 * equals the verifier verbatim.
 */
export function generateCodeChallenge(codeVerifier: string): string {
  return codeVerifier;
}

export interface GetAuthorizationUrlParams {
  clientId: string;
  codeChallenge: string;
  redirectUri?: string;
  state?: string;
}

/** Builds the authorization URL the user should be redirected to. */
export function getAuthorizationUrl(params: GetAuthorizationUrlParams): string {
  const url = new URL(`${AUTH_BASE}/authorize`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', 'plain');
  if (params.redirectUri) url.searchParams.set('redirect_uri', params.redirectUri);
  if (params.state) url.searchParams.set('state', params.state);
  return url.toString();
}

export interface ExchangeCodeParams {
  clientId: string;
  clientSecret?: string;
  code: string;
  codeVerifier: string;
  redirectUri?: string;
}

/** Exchanges the authorization code for an access + refresh token pair. */
export async function exchangeCode(params: ExchangeCodeParams): Promise<MALToken> {
  const body = new URLSearchParams({
    client_id: params.clientId,
    grant_type: 'authorization_code',
    code: params.code,
    code_verifier: params.codeVerifier,
  });
  if (params.clientSecret) body.set('client_secret', params.clientSecret);
  if (params.redirectUri) body.set('redirect_uri', params.redirectUri);

  const res = await fetch(`${AUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MAL token exchange failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<MALToken>;
}

export interface RefreshAccessTokenParams {
  clientId: string;
  clientSecret?: string;
  refreshToken: string;
}

/** Uses a refresh token to obtain a fresh access token. */
export async function refreshAccessToken(params: RefreshAccessTokenParams): Promise<MALToken> {
  const body = new URLSearchParams({
    client_id: params.clientId,
    grant_type: 'refresh_token',
    refresh_token: params.refreshToken,
  });
  if (params.clientSecret) body.set('client_secret', params.clientSecret);

  const res = await fetch(`${AUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MAL token refresh failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<MALToken>;
}
