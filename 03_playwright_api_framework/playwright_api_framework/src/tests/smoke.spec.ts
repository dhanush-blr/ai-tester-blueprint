import { test, expect } from '@playwright/test';

/**
 * Simple smoke test against JSONPlaceholder to validate
 * framework plumbing (APIRequestContext, config, reporting).
 */
test('GET /posts returns 200 with an array of posts', async ({ request }) => {
  const response = await request.get('/posts');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);

  const first = body[0];
  expect(first).toHaveProperty('id');
  expect(first).toHaveProperty('title');
  expect(first).toHaveProperty('body');
  expect(first).toHaveProperty('userId');
});
