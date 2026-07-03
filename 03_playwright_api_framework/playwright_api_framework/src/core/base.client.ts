import { APIRequestContext, APIResponse } from '@playwright/test';

// ── Type helpers ───────────────────────────────────────────
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiResponse<TBody> {
  readonly status: number;
  readonly headers: Record<string, string>;
  readonly body: TBody;
}

export interface RequestLogEntry {
  method: HttpMethod;
  url: string;
  requestHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseStatus?: number;
  responseHeaders?: Record<string, string>;
  responseBody?: unknown;
}

export interface ApiErrorDetails {
  status: number;
  statusText: string;
  url: string;
  method: HttpMethod;
  responseBody: string;
}

// ── Log collector ──────────────────────────────────────────
export const requestLog: RequestLogEntry[] = [];

function recordLogEntry(entry: RequestLogEntry): void {
  requestLog.push(entry);
}

export function clearRequestLog(): void {
  requestLog.length = 0;
}

// ── Base client ────────────────────────────────────────────
export class BaseApiClient {
  protected readonly token: string | undefined;

  constructor(
    protected readonly request: APIRequestContext,
    options?: { token?: string },
  ) {
    this.token = options?.token;
  }

  // ── Private helpers ──────────────────────────────────────

  private authHeaders(): Record<string, string> {
    if (!this.token) {
      return {};
    }
    return { Authorization: `Bearer ${this.token}` };
  }

  /**
   * Merges base + auth + per-request headers.
   * Per-request headers take precedence.
   */
  private mergeHeaders(
    extra?: Record<string, string>,
  ): Record<string, string> {
    return { ...this.authHeaders(), ...extra };
  }

  /**
   * Reads a typed body from an APIResponse, coercing null → undefined
   * so callers always get a clean union type.
   */
  private async parseBody<T>(
    response: APIResponse,
  ): Promise<T | undefined> {
    const text = await response.text();
    if (text.length === 0) {
      return undefined;
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      return undefined;
    }
  }

  /**
   * Shared response handler: builds the typed ApiResponse, optionally
   * logs the interaction when the status code indicates failure.
   */
  private async handleResponse<T>(
    method: HttpMethod,
    url: string,
    response: APIResponse,
    requestBody?: unknown,
    requestHeaders?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    const status = response.status();
    const headers = response.headers() as Record<string, string>;
    const body = await this.parseBody<T>(response);

    if (status >= 400) {
      const rawBody = await response.text().catch(() => '(unreadable)');
      recordLogEntry({
        method,
        url,
        requestHeaders: headers,
        requestBody,
        responseStatus: status,
        responseHeaders: headers,
        responseBody: rawBody,
      });
    }

    return { status, headers, body: body as T };
  }

  // ── Public HTTP verb methods ─────────────────────────────

  async get<T>(
    url: string,
    options?: {
      params?: Record<string, string | number | boolean>;
      headers?: Record<string, string>;
    },
  ): Promise<ApiResponse<T>> {
    const mergedHeaders = this.mergeHeaders(options?.headers);
    const searchParams: Record<string, string> = {};

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        searchParams[key] = String(value);
      }
    }

    const response = await this.request.get(url, {
      headers: mergedHeaders,
      params: searchParams,
    });

    return this.handleResponse<T>('GET', url, response);
  }

  async post<TRequest, TResponse>(
    url: string,
    body: TRequest,
    options?: { headers?: Record<string, string> },
  ): Promise<ApiResponse<TResponse>> {
    const mergedHeaders = this.mergeHeaders(options?.headers);

    const response = await this.request.post(url, {
      headers: mergedHeaders,
      data: body,
    });

    return this.handleResponse<TResponse>(
      'POST',
      url,
      response,
      body,
      mergedHeaders,
    );
  }

  async put<TRequest, TResponse>(
    url: string,
    body: TRequest,
    options?: { headers?: Record<string, string> },
  ): Promise<ApiResponse<TResponse>> {
    const mergedHeaders = this.mergeHeaders(options?.headers);

    const response = await this.request.put(url, {
      headers: mergedHeaders,
      data: body,
    });

    return this.handleResponse<TResponse>(
      'PUT',
      url,
      response,
      body,
      mergedHeaders,
    );
  }

  async delete<T = void>(
    url: string,
    options?: { headers?: Record<string, string> },
  ): Promise<ApiResponse<T>> {
    const mergedHeaders = this.mergeHeaders(options?.headers);

    const response = await this.request.delete(url, {
      headers: mergedHeaders,
    });

    return this.handleResponse<T>('DELETE', url, response);
  }

  async patch<TRequest, TResponse>(
    url: string,
    body: TRequest,
    options?: { headers?: Record<string, string> },
  ): Promise<ApiResponse<TResponse>> {
    const mergedHeaders = this.mergeHeaders(options?.headers);

    const response = await this.request.patch(url, {
      headers: mergedHeaders,
      data: body,
    });

    return this.handleResponse<TResponse>(
      'PATCH',
      url,
      response,
      body,
      mergedHeaders,
    );
  }
}
