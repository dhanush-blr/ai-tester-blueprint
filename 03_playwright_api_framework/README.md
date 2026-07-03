# Playwright API Test Framework

Enterprise-grade, type-safe API testing framework built on Playwright's native `APIRequestContext` with **zero external HTTP clients**.

This framework was generated using the **RICE POT** prompt framework — **R**ole, **I**nstructions, **C**ontext, **E**xample, **P**arameters, **O**utput, **T**one — guided by a [`skill.md`](./skill.md) specification and validated against [`Anti_Hallucinations_Rules.md`](./Anti_Hallucinations_Rules.md) to ensure every assertion is traceable to provided input with no hallucinated behavior.

## Directory Layout

```
playwright_api_framework/
├── core/
│   ├── base.client.ts       # Typed GET/POST/PUT/DELETE/PATCH + auto-failure logging
│   └── env.config.ts        # Pre-flight env var validator (fails fast)
├── api/
│   ├── types/               # Request/response interfaces (no `any`)
│   │   ├── auth.types.ts
│   │   └── user.types.ts
│   ├── auth.client.ts       # OAuth2 client-credentials grant
│   └── user.client.ts       # /users controller (extends BaseApiClient)
├── data/
│   └── user.factory.ts      # Pure builder function — deterministic payloads
├── fixtures/
│   └── api.fixture.ts       # Custom test base — auto-auth, auto-log on failure
└── tests/
    ├── users.spec.ts        # Authenticated CRUD scenarios
    └── smoke.spec.ts        # Quick plumbing verification
```

## Quick Start

```bash
cd playwright_api_framework
npm install
cp .env.example .env        # Fill in your environment values
npm test                    # Runs all tests
npm run test:qa             # Target QA environment
npm run test:staging        # Target Staging environment
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ENVIRONMENT` | No (default: `dev`) | One of `dev`, `qa`, `staging` |
| `BASE_URL_DEV` | Yes | Base URL for Dev environment |
| `BASE_URL_QA` | Yes | Base URL for QA environment |
| `BASE_URL_STAGING` | Yes | Base URL for Staging environment |
| `OAUTH_CLIENT_ID` | Yes | OAuth2 client ID |
| `OAUTH_CLIENT_SECRET` | Yes | OAuth2 client secret |
| `OAUTH_TOKEN_URL` | Yes | Token endpoint for client-credentials grant |

The config validator runs before any test and throws immediately if a required var is missing.

## Adding a New API Domain

1. Define request/response types in `src/api/types/`
2. Create a controller class in `src/api/` extending `BaseApiClient`
3. Optionally add a typed fixture in `src/fixtures/api.fixture.ts`
4. Write tests in `src/tests/` using the fixture

```typescript
// src/api/order.client.ts
export class OrderClient extends BaseApiClient {
  async create(body: CreateOrderRequest): Promise<OrderResponse | undefined> {
    const res = await this.post<CreateOrderRequest, OrderResponse>('/orders', body);
    return res.body;
  }
}
```

## CI

The `.github/workflows/api-tests.yml` workflow runs tests in a 4-shard matrix with:

- **npm cache** — restores `~/.npm` and `node_modules` via `actions/cache`
- **Secrets** — all env vars passed securely via GitHub Secrets
- **HTML report** — uploaded as a build artifact on failure, 7-day retention

## Design Decisions

| Decision | Rationale |
|---|---|
| **No `any` type** | Every request/response has a dedicated interface — zero type escapes |
| **No Axios / fetch** | Uses only Playwright's native `APIRequestContext` per spec requirement |
| **Fixture-based auth** | `bearerToken` fetched at worker scope; `userClient` injected per-test — zero auth boilerplate in test files |
| **Auto-failure logging** | `_requestLog` auto-fixture attaches full request/response JSON to the HTML report only when a test fails |
| **Pure builder factory** | `buildCreateUserPayload()` is a plain function with no class state — deterministic with overrides |
| **`fullyParallel: true`** | No shared state between tests; each test gets its own auth token |
| **RICE POT generation** | Framework scaffolded via Role → Instructions → Context → Example → Parameters → Output → Tone prompt chain |
| **Anti-hallucination audit** | Every assertion cross-checked against `Anti_Hallucinations_Rules.md` — inferred values explicitly labelled |
