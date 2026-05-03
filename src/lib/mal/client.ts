const API_BASE = 'https://api.myanimelist.net/v2';

export interface MALClientConfig {
  /** OAuth2 Bearer access token — required for user-specific endpoints. */
  accessToken?: string;
  /** Client ID — sufficient for public, read-only endpoints. */
  clientId?: string;
}

type QueryParams = Record<string, string | number | boolean | undefined>;

export class MALClient {
  private readonly accessToken?: string;
  private readonly clientId?: string;

  constructor(config: MALClientConfig) {
    if (!config.accessToken && !config.clientId) {
      throw new Error('MALClient requires at least one of: accessToken, clientId');
    }
    this.accessToken = config.accessToken;
    this.clientId = config.clientId;
  }

  private authHeaders(): Record<string, string> {
    if (this.accessToken) {
      return { Authorization: `Bearer ${this.accessToken}` };
    }
    return { 'X-MAL-CLIENT-ID': this.clientId! };
  }

  async get<T>(path: string, params?: object): Promise<T> {
    const url = new URL(`${API_BASE}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params as QueryParams)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.authHeaders(),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new MALError(res.status, body, `GET ${path}`);
    }

    return res.json() as Promise<T>;
  }

  async patch<T>(path: string, params: object): Promise<T> {
    const body = new URLSearchParams();
    for (const [key, value] of Object.entries(params as QueryParams)) {
      if (value !== undefined) body.set(key, String(value));
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method: 'PATCH',
      headers: {
        ...this.authHeaders(),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new MALError(res.status, text, `PATCH ${path}`);
    }

    return res.json() as Promise<T>;
  }

  async delete(path: string): Promise<void> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: this.authHeaders(),
    });

    if (!res.ok && res.status !== 404) {
      const body = await res.text();
      throw new MALError(res.status, body, `DELETE ${path}`);
    }
  }
}

export class MALError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly request: string,
  ) {
    super(`MAL API ${status} on ${request}: ${body}`);
    this.name = 'MALError';
  }
}
