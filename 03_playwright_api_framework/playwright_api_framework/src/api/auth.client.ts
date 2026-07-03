import { BaseApiClient } from '../core/base.client';
import { LoginRequest, LoginResponse } from './types';
import { getConfig } from '../core/env.config';

/**
 * AuthClient handles the OAuth2 client-credentials grant.
 *
 * Controller (API Page Object) pattern: each domain endpoint maps to a class
 * that extends BaseApiClient, keeping auth concerns isolated from other domains.
 */
export class AuthClient extends BaseApiClient {
  public async login(): Promise<LoginResponse | undefined> {
    const config = getConfig();

    const body: LoginRequest = {
      client_id: config.oauthClientId,
      client_secret: config.oauthClientSecret,
      grant_type: 'client_credentials',
    };

    const response = await this.post<LoginRequest, LoginResponse>(
      config.oauthTokenURL,
      body,
    );

    return response.body;
  }
}
