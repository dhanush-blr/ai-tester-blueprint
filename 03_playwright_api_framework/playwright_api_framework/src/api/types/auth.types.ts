// ── Auth endpoint request / response contracts ─────────────

export interface LoginRequest {
  readonly client_id: string;
  readonly client_secret: string;
  readonly grant_type: 'client_credentials';
}

export interface LoginResponse {
  readonly access_token: string;
  readonly token_type: string;
  readonly expires_in: number;
}
