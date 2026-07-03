import { test as base, APIRequestContext } from '@playwright/test';
import { AuthClient } from '../api/auth.client';
import { UserClient } from '../api/user.client';
import { clearRequestLog, requestLog } from '../core/base.client';

// ── Fixture types ──────────────────────────────────────────
export interface ApiFixtures {
  /** Pre-authenticated client for the /users domain. */
  userClient: UserClient;
  /** A raw auth client — useful for negative-auth tests. */
  authClient: AuthClient;
  /** The bearer token obtained at login — exposed so tests can inspect or override it. */
  bearerToken: string;
}

// ── Test base with fixtures ────────────────────────────────
export const test = base.extend<ApiFixtures>({
  /**
   * Automatically obtains an OAuth2 token via client-credentials grant,
   * then injects it into the UserClient.  Tests that use `userClient`
   * never see auth boilerplate.
   */
  bearerToken: [
    async ({ request }: { request: APIRequestContext }, use) => {
      const authClient = new AuthClient(request);
      const token = await authClient.login();
      const bearerToken = token?.access_token ?? '';
      await use(bearerToken);
    },
    { scope: 'worker' },
  ],

  userClient: [
    async (
      { request, bearerToken }: { request: APIRequestContext; bearerToken: string },
      use,
    ) => {
      const client = new UserClient(request, { token: bearerToken });
      await use(client);
    },
    { scope: 'test' },
  ],

  authClient: [
    async ({ request }: { request: APIRequestContext }, use) => {
      const client = new AuthClient(request);
      await use(client);
    },
    { scope: 'test' },
  ],

  /**
   * Automatically attach request logs to a failed test report.
   * This clears between tests and dumps the log only on failure.
   */
  // eslint-disable-next-line no-empty-pattern
  _requestLog: [
    async ({}, use, testInfo) => {
      clearRequestLog();
      await use();
      if (testInfo.status !== 'passed' && requestLog.length > 0) {
        // Attach as JSON so the HTML report renders it beautifully
        await testInfo.attach('request-log.json', {
          body: Buffer.from(
            JSON.stringify(requestLog, null, 2),
            'utf-8',
          ),
          contentType: 'application/json',
        });
      }
    },
    { scope: 'test', auto: true },
  ],
});

export { expect } from '@playwright/test';
