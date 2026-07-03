import { CreateUserRequest } from '../api/types';

/**
 * Test data factory for user payloads.
 *
 * Pure builder function pattern — zero dependencies, fully deterministic
 * when called with the same overrides.  No class instantiation, no state,
 * just composable defaults.
 */

let emailCounter = 0;

export function buildCreateUserPayload(
  overrides?: Partial<CreateUserRequest>,
): CreateUserRequest {
  emailCounter += 1;

  const defaults: CreateUserRequest = {
    name: 'Test User',
    email: `test.user.${emailCounter}@example.com`,
    role: 'viewer',
  };

  return { ...defaults, ...overrides };
}

/**
 * Resets the email counter — useful between tests that need deterministic values.
 */
export function resetUserFactory(): void {
  emailCounter = 0;
}
