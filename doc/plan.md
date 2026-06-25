## Plans

- Explore Market list
    - see current bet
    - bet your position
- Wallet
    - deposit, charge money to bet

### Feature implementation:
- Lost cut / profit off (e.g. exit from the bet before it close)
- Categories
- sort market by popularity - time
- Transaction Chart
- notification
- email notification
- support feature(intercom integration)?
- save market as favorite
- open API - transaction by system
- dark mode
- Comment board where users can discuss
- Mobile
- Instead of zero-sum bet, introduce moderate betting logic(e.g. Max 20% lost)
- Payment service using the balance - QR/Card - want internatinal usability


### Common implementation plan
- Foundation
    - pnpm init + tsconfig✅
    ESM, NodeNext, strict — do this before anything else
    - env config (zod)
    config.ts validates all env vars on startup — needed before DB
    - DB connection pool✅
    pg pool in shared/db/pool.ts — test the connection before writing routes
    - migrations setup✅
    ⚠️ missing in your plan — use node-pg-migrate or Flyway from day 1, not hand-run SQL
    - logger (pino)✅
    needed from the start — everything else logs through it
    - app.ts + index.ts✅
    server boot + graceful shutdown wired before any feature work

- Middleware
    - CORS✅
    configure origins explicitly — never use wildcard * in prod
    - rate limiter✅
    express-rate-limit — apply globally first, then tighten per-route
    - request ID middleware✅
    ⚠️ missing — attach x-request-id to every request via AsyncLocalStorage for log correlation
    - global error handler✅
    registered last in app.ts — centralizes all next(err) calls
    - request logger middleware✅
    ⚠️ missing — log every req/res with method, path, status, duration
    - helmet✅
    ⚠️ missing — sets secure HTTP headers in one line

- Auth feature
    - password hashing✅
    bcrypt in auth.service — never store plaintext or md5
    - JWT sign + verify✅
    short-lived access token (15m) + refresh token (7d)
    - authenticate middleware✅
    verifies JWT, attaches user to req — applied per-router not globally
    - refresh token rotation✅
    ⚠️ missing — store refresh tokens in DB, rotate on use, invalidate on logout
    - token blacklist / revocation
    ⚠️ missing — needed for logout to actually work with JWTs

- Feature layer
    - router + controller✅❗️
    one feature at a time — users first as it's referenced by everything else
    - DTO + zod validation✅❗️
    validate request body in middleware before it hits the controller
    - mapper✅❗️
    DB row → response DTO — never return raw DB objects to clients. Remove validation logic
    - service + domain errors✅❗️
    custom error classes (NotFoundError, ConflictError) caught by global handler
    - repository✅
    parameterized queries only — never string-interpolate user input into SQL. Error
    - integration tests
    ⚠️ missing — test each feature with supertest against a real test DB, not mocks

- Resilience
    - circuit breaker
    opossum — wrap external HTTP calls and DB queries that can cascade-fail
    - Redis cache✅
    cache expensive queries — define TTL and invalidation strategy before implementing
    - cache invalidation✅ 
    ⚠️ missing — write strategy: on mutation, or TTL-only? Document the decision
    - health endpoints✅
    ⚠️ missing — /healthz (liveness) + /readyz (checks DB + Redis) for k8s / Render 

- Queue / Backgoud job
    - BullMQ (Redis-backed)
    async jobs — email, notifications, report generation
    - dead letter queue
    ⚠️ missing — failed jobs need a retry limit + DLQ, not silent discard
    - idempotency
    ⚠️ missing — jobs must be safe to retry; use idempotency keys for side effects

- Frontend
    - React + React Router
    or Next.js if you want SSR — decide before building, hard to switch
    - API client layer
    ⚠️ missing — centralize fetch/axios calls; handle token refresh transparently
    - error boundaries
    ⚠️ missing — catch render errors so one broken component doesn't blank the page

- CI/CD
    - GitHub Actions
    lint → typecheck → test → build on every PR — fail fast
    - Docker image
    ⚠️ missing — multi-stage Dockerfile: build stage + lean prod stage (node:alpine)
    - secrets management
    ⚠️ missing — GitHub Secrets or Doppler; never .env files in the image
    - deploy target
    Render / Railway / Fly.io for portfolio — real k8s if you want to show that skill

- Obserbality
    - structured logs → Datadog
    pino JSON logs shipped via dd-agent or log drain
    - APM traces
    dd-trace auto-instruments Express, pg, Redis — add to index.ts before any import
    - custom metrics
    ⚠️ missing — track business KPIs (orders/min, auth failures) not just infra metrics
    - alerts
    ⚠️ missing — at minimum: p99 latency spike + error rate threshold


### Todo:
- document
- Google Oauth
- payment integration for deposit
- bank withdrawal integration
- logout/delete - revoke jwt token

- Admin page
- unit test

Quick 
- prevent bet on non opened prediction/market - other edge cases as well
- market list filter by status
- wallet prevent wallet edit for deleted account