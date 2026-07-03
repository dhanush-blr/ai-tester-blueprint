import { BaseApiClient } from '../core/base.client';
import {
  CreateUserRequest,
  UserResponse,
  GetUsersResponse,
} from './types';

/**
 * UserClient wraps the /users endpoint group.
 *
 * Each method maps to a controller action, keeping route concerns
 * isolated from auth and test logic.
 */
export class UserClient extends BaseApiClient {
  private readonly basePath = '/users';

  public async create(
    body: CreateUserRequest,
  ): Promise<UserResponse | undefined> {
    const response = await this.post<CreateUserRequest, UserResponse>(
      this.basePath,
      body,
    );
    return response.body;
  }

  public async list(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<GetUsersResponse | undefined> {
    const response = await this.get<GetUsersResponse>(this.basePath, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.body;
  }

  public async getById(id: string): Promise<UserResponse | undefined> {
    const response = await this.get<UserResponse>(
      `${this.basePath}/${id}`,
    );
    return response.body;
  }

  public async delete(id: string): Promise<number> {
    const response = await this.delete<void>(`${this.basePath}/${id}`);
    return response.status;
  }
}
