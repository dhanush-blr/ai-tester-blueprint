import { test, expect } from '../fixtures/api.fixture';
import { buildCreateUserPayload, resetUserFactory } from '../data/user.factory';
import { UserResponse } from '../api/types';

/**
 * ── Authenticated user API scenarios ───────────────────────
 *
 * These tests run with fullyParallel: true. Each test obtains its own
 * bearer token via the fixture, so there is zero cross-test coupling.
 */

test.describe('Users API', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(() => {
    resetUserFactory();
  });

  test('creates a user and returns the expected schema', async ({ userClient }) => {
    const payload = buildCreateUserPayload({ role: 'editor' });
    const user = await userClient.create(payload);

    expect(user).toBeDefined();
    expect(user!.name).toBe(payload.name);
    expect(user!.email).toBe(payload.email);
    expect(user!.role).toBe(payload.role);

    // Structural contract validation — enforce the response shape
    expect(user!.id).toEqual(expect.any(String));
    expect(user!.createdAt).toEqual(expect.any(String));
  });

  test('lists users with pagination', async ({ userClient }) => {
    // Arrange — seed two users
    const userA = await userClient.create(
      buildCreateUserPayload({ name: 'Alice' }),
    );
    const userB = await userClient.create(
      buildCreateUserPayload({ name: 'Bob' }),
    );
    expect(userA).toBeDefined();
    expect(userB).toBeDefined();

    // Act
    const list = await userClient.list({ page: 1, pageSize: 10 });

    // Assert — structural contract validation
    expect(list).toBeDefined();
    expect(list!.page).toBe(1);
    expect(list!.pageSize).toBe(10);
    expect(Array.isArray(list!.data)).toBe(true);
    // At minimum the two users we just created exist
    expect(list!.total).toBeGreaterThanOrEqual(2);
  });

  test('fetches a single user by id', async ({ userClient }) => {
    const payload = buildCreateUserPayload({ name: 'Charlie' });
    const created = await userClient.create(payload);
    expect(created).toBeDefined();

    const fetched: UserResponse | undefined = await userClient.getById(created!.id);

    expect(fetched).toBeDefined();
    expect(fetched!.id).toBe(created!.id);
    expect(fetched!.name).toBe('Charlie');
    expect(fetched!.email).toBe(payload.email);
  });

  test('deletes a user and returns 204', async ({ userClient }) => {
    const payload = buildCreateUserPayload();
    const created = await userClient.create(payload);
    expect(created).toBeDefined();

    const status = await userClient.delete(created!.id);
    expect(status).toBe(204);
  });

  test('rejects a user payload with missing required fields', async ({ userClient }) => {
    // Intentionally send an incomplete payload via the raw request context
    const response = await userClient.post<Record<string, unknown>, unknown>(
      '/users',
      { name: 'No Role' }, // missing email + role
    );

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });
});
