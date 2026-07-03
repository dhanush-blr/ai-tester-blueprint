// ── User endpoint request / response contracts ─────────────

export interface CreateUserRequest {
  readonly name: string;
  readonly email: string;
  readonly role: 'admin' | 'viewer' | 'editor';
}

export interface UserResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'admin' | 'viewer' | 'editor';
  readonly createdAt: string;
}

export interface GetUsersResponse {
  readonly data: UserResponse[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}
