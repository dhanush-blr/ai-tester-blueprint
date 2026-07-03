import 'dotenv/config';

/**
 * Environment configuration validator.
 *
 * Reads environment variables at startup and fails fast with a clear message
 * when required variables are missing. This prevents cryptic failures mid-run
 * in CI or on a new developer's machine.
 *
 * Singleton-like by design: validated once at import time in playwright.config.ts.
 */
const ENVIRONMENTS = ['dev', 'qa', 'staging'] as const;
export type Environment = (typeof ENVIRONMENTS)[number];

export interface EnvironmentConfig {
  environment: Environment;
  baseURL: string;
  oauthClientId: string;
  oauthClientSecret: string;
  oauthTokenURL: string;
}

function isEnvironment(value: string | undefined): value is Environment {
  return ENVIRONMENTS.includes(value as Environment);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `  Copy .env.example to .env and fill in the values, or set ${name} in CI secrets.`,
    );
  }
  return value;
}

export function validateEnvironment(): EnvironmentConfig {
  const rawEnv = process.env.ENVIRONMENT;
  const environment: Environment = isEnvironment(rawEnv)
    ? rawEnv
    : 'dev';

  const baseURLKey = `BASE_URL_${environment.toUpperCase()}` as const;
  const baseURL = requireEnv(baseURLKey);

  const oauthClientId = requireEnv('OAUTH_CLIENT_ID');
  const oauthClientSecret = requireEnv('OAUTH_CLIENT_SECRET');
  const oauthTokenURL = requireEnv('OAUTH_TOKEN_URL');

  return {
    environment,
    baseURL,
    oauthClientId,
    oauthClientSecret,
    oauthTokenURL,
  };
}

let cachedConfig: EnvironmentConfig | undefined;

/**
 * Returns the validated config, caching it after the first call.
 */
export function getConfig(): EnvironmentConfig {
  if (!cachedConfig) {
    cachedConfig = validateEnvironment();
  }
  return cachedConfig;
}
