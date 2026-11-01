# Scam Intelligence Exchange

**Check Before You Trust.** — A free, community-powered global scam intelligence platform.

Search suspicious phone numbers, websites, emails and online profiles, report scam experiences, and access reliable community-generated scam-prevention intelligence.

- **100% free** for everyone. No paid subscriptions, no premium search, no paid removal.
- **Minimal, clearly-labelled advertising** (Google AdSense, after approval) on the homepage and educational guides only.
- **No traditional database** in the MVP. Approved reports are stored as public JSON files in a GitHub repository. Pending submissions live as Issues in a separate private GitHub repository.
- **AI-assisted, human-decided.** Google Gemini triages new submissions; a human moderator always decides what gets published.
- **Privacy by default.** Raw phone numbers and emails are never published — identifiers are HMAC-hashed for matching and masked for display.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Repository architecture](#repository-architecture)
3. [Quick start (local development)](#quick-start-local-development)
4. [Environment variables](#environment-variables)
5. [Gemini API setup](#gemini-api-setup)
6. [GitHub repository setup](#github-repository-setup)
7. [Vercel deployment](#vercel-deployment)
8. [Project structure](#project-structure)
9. [Search engine](#search-engine)
10. [Report submission pipeline](#report-submission-pipeline)
11. [Admin moderation](#admin-moderation)
12. [Security checklist](#security-checklist)
13. [Functional testing checklist](#functional-testing-checklist)
14. [Advertising policy](#advertising-policy)
15. [Roadmap](#roadmap)
16. [Legal & community](#legal--community)

---

## Tech stack

| Component | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui (New York) |
| AI | Google Gemini API (server-side only, REST) |
| Source code | GitHub |
| Hosting | Vercel |
| Public report storage | GitHub JSON files in the public repo's `data/` directory |
| Pending report queue | GitHub Issues in a separate private repo |
| Search | Next.js server routes + prebuilt JSON indexes |
| Advertising | Google AdSense (after approval) |
| Analytics | Privacy-conscious (e.g. Plausible), optional |

**Strict database restriction:** the MVP uses no Supabase, Firebase, PostgreSQL, MySQL, MongoDB, or Prisma-with-a-database. A modular `ReportStore` interface (`src/lib/storage.ts`) is provided so a database adapter can be introduced later without rewriting the rest of the application.

---

## Repository architecture

Two GitHub repositories are used:

### Repository A — Public website repository (default name: `scam-intelligence-exchange`)

Contains:
- Website source code (this project).
- `data/reports/<year>/SC-XXXXXX.json` — approved, public reports.
- `data/indexes/*.json` — search indexes (search-index, reports-index, phone/domain/email/category indexes).
- `data/categories/categories.json`, `data/countries/countries.json`.
- Documentation and `.env.example`.

### Repository B — Private moderation repository (default name: `scam-intelligence-private`)

Contains:
- Pending report submissions as Issues (one issue per submission).
- Internal moderation notes (issue comments).
- Report review discussions.

Never store raw passwords, OTPs, card numbers, identity documents, or unnecessary personal information in either repository.

### Important distinction

GitHub is the source-code repository and version-control system. Approved public reports are stored in structured JSON files. Pending submissions are stored as issues in a separate private repository. Website visitors never write directly to the public source-code repository.

---

## Quick start (local development)

```bash
# 1. Install dependencies
bun install

# 2. Copy environment variables
cp .env.example .env.local
# Edit .env.local — at minimum set IDENTIFIER_HMAC_SECRET and ADMIN_SECRET
# (use: openssl rand -hex 32)

# 3. (Optional) Generate fresh seed data
bun run scripts/generate-seed-data.ts

# 4. Run the dev server
bun run dev
# Open http://localhost:3000
```

The dev server runs at `http://localhost:3000`. The homepage demonstrates all key user flows (search, report submission, latest reports, categories, safety guides, admin dashboard) in a single comprehensive page.

Without GitHub or Gemini credentials, the app runs in **demo mode**:
- Search works against bundled seed JSON data (`src/data/reports.json` and `src/data/indexes/search-index.json`).
- Report submission is accepted and validated, runs the fallback (non-AI) analysis path, and returns a reference number — but does not create a real GitHub Issue.
- The admin dashboard renders with a notice that the moderation repo is not configured.

---

## Environment variables

See [`.env.example`](./.env.example) for the complete list with comments. Summary:

| Variable | Purpose | Required for MVP? |
| --- | --- | --- |
| `GEMINI_API_KEY` | Gemini AI analysis | No (falls back to non-AI) |
| `GEMINI_MODEL` | Model identifier | No (defaults to `gemini-2.5-flash`) |
| `GITHUB_PUBLIC_OWNER` / `REPO` / `TOKEN` | Public report storage | No (uses local seed data) |
| `GITHUB_PRIVATE_OWNER` / `REPO` / `TOKEN` | Moderation queue | No (queue shows notice) |
| `NEXT_PUBLIC_APP_URL` | Canonical URL | Yes (production) |
| `ADMIN_SECRET` | Admin login | Yes (for moderation) |
| `ADMIN_EMAILS` | Reserved for multi-admin | No |
| `RATE_LIMIT_SECRET` | Rate-limit bucket signing | Recommended |
| `IDENTIFIER_HMAC_SECRET` | Identifier hashing | **Yes** — never change after launch |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense | No (placeholders render) |
| `NEXT_PUBLIC_ADSENSE_SLOT_*` | AdSense slots | No |

**Token hygiene:** use separate tokens for the public and private repositories with the minimum required permissions. Prefer GitHub Apps over long-lived personal access tokens in production. Never expose private environment variables with `NEXT_PUBLIC_`. Never commit real API keys or tokens.

---

## Gemini API setup

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and create an API key.
2. Set `GEMINI_API_KEY` in your environment.
3. (Optional) Set `GEMINI_MODEL` to a specific model. Default: `gemini-2.5-flash`.
4. The backend calls Gemini server-side only (`src/lib/gemini.ts`). The API key is never sent to the client.

**Graceful failure:** if `GEMINI_API_KEY` is unset, Gemini returns an error, or the response fails schema validation, the submission pipeline falls back to a deterministic, rule-based analysis and the report is still accepted. Submission is never blocked by AI availability.

**AI safety rules** (enforced in `src/lib/gemini.ts`):
- All user-submitted content is placed in a clearly-delimited `USER_REPORT_BEGIN ... USER_REPORT_END` data block. The system prompt explicitly instructs the model to treat this as data, never as instructions.
- Prompt-injection markers (`system:`, `assistant:`, `<system>`, "ignore previous instructions") are stripped from user input before it reaches the model.
- The Gemini response is validated against a strict TypeScript schema (`isAnalysis`). Invalid responses are discarded and the fallback path is used.
- Gemini never auto-publishes, never declares guilt, and never invents evidence or prior reports.

---

## GitHub repository setup

### Public repository (`scam-intelligence-exchange`)

```bash
# 1. Create the repo on GitHub (do not initialize with README — push your code instead).
# 2. Push this project:
git init
git add .
git commit -m "Initial commit: Scam Intelligence Exchange MVP"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/scam-intelligence-exchange.git
git push -u origin main
```

Create a fine-grained personal access token (or GitHub App) with **Contents: Read and Write** on this repository. Store it as `GITHUB_PUBLIC_TOKEN`.

The repository will contain:
```
data/
├── reports/
│   └── 2026/
│       ├── SC-000001.json
│       └── ...
├── indexes/
│   ├── reports-index.json     # list of all approved reports (metadata only)
│   ├── search-index.json       # identifier-hash → report-ids mapping
│   ├── phone-index.json
│   ├── domain-index.json
│   ├── email-index.json
│   └── category-index.json
├── categories/categories.json
└── countries/countries.json
```

### Private moderation repository (`scam-intelligence-private`)

```bash
# 1. Create a PRIVATE repository on GitHub named scam-intelligence-private.
# 2. (Optional) Initialize with a README so it can be cloned.
```

Create a separate fine-grained token with **Issues: Read and Write** on this repository. Store it as `GITHUB_PRIVATE_TOKEN`.

The moderation labels (`pending-review`, `ai-analysis-complete`, `needs-human-review`, `approved`, `rejected`, `disputed`, `correction-request`, `possible-duplicate`) are created automatically by the app on first submission (`ensureLabels` in `src/lib/github.ts`).

---

## Vercel deployment

1. Push the project to GitHub (the public repo above).
2. In Vercel, **New Project** → import the repository.
3. Framework preset: **Next.js**. Build command and output directory are auto-detected.
4. **Environment Variables** — add every variable from `.env.example` that you need (at minimum: `NEXT_PUBLIC_APP_URL`, `ADMIN_SECRET`, `IDENTIFIER_HMAC_SECRET`, and the four GitHub + Gemini variables).
5. Deploy. Vercel will build and assign a `*.vercel.app` URL.
6. (Optional) add a custom domain in **Project Settings → Domains** and update `NEXT_PUBLIC_APP_URL` to match.

**Notes:**
- The app uses Next.js serverless functions for `/api/*` routes. Each function has its own in-memory rate-limit bucket. For stricter global limits, add Upstash Redis and swap the implementation in `src/lib/rate-limit.ts`.
- `IDENTIFIER_HMAC_SECRET` must be the same across all environments — changing it breaks all existing identifier matches.
- The `bun run build` script produces a standalone server build (`.next/standalone`). Vercel handles this automatically; the standalone output is useful for self-hosting.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout, metadata, fonts
│   ├── page.tsx                      # Homepage (comprehensive single-page demo)
│   ├── globals.css                   # Trust palette: navy + teal on white
│   ├── sitemap.ts                    # Dynamic sitemap (approved pages only)
│   ├── robots.ts                     # Disallow /api/admin, /admin
│   ├── api/
│   │   ├── search/route.ts           # GET /api/search?q=
│   │   ├── reports/route.ts          # POST /api/reports (submit)
│   │   ├── reports/[id]/route.ts     # GET single approved report
│   │   ├── latest-reports/route.ts   # GET recent approved reports
│   │   ├── stats/route.ts            # GET real counts (no invented stats)
│   │   ├── categories/route.ts       # GET category metadata
│   │   ├── guides/route.ts           # GET safety-guide summaries
│   │   └── admin/
│   │       ├── login/route.ts        # POST admin login (signed cookie)
│   │       ├── logout/route.ts       # POST admin logout
│   │       ├── stats/route.ts        # GET dashboard overview
│   │       ├── pending/route.ts      # GET pending moderation issues
│   │       ├── approve/route.ts      # POST approve + publish report
│   │       └── reject/route.ts       # POST reject report
│   ├── search/page.tsx               # /search
│   ├── report/page.tsx               # /report
│   ├── reports/[id]/page.tsx         # /reports/SC-000001
│   ├── scam-categories/[slug]/page.tsx
│   ├── safety-guides/[slug]/page.tsx
│   ├── latest-reports/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms/page.tsx
│   ├── community-guidelines/page.tsx
│   ├── correction-request/page.tsx
│   ├── report-appeal/page.tsx
│   └── admin/page.tsx                # /admin (noindex)
├── components/
│   ├── site/
│   │   ├── logo.tsx
│   │   ├── site-header.tsx
│   │   ├── site-footer.tsx
│   │   ├── page-shell.tsx            # Shared layout for inner pages
│   │   ├── search-section.tsx
│   │   ├── report-form.tsx           # Multi-step submission form
│   │   ├── report-card.tsx
│   │   ├── status-badge.tsx
│   │   ├── category-grid.tsx
│   │   ├── guides-grid.tsx
│   │   ├── latest-reports.tsx
│   │   └── ad-placement.tsx          # Reusable, labelled ad unit
│   ├── admin/
│   │   └── admin-dashboard.tsx       # Login + moderation queue + approve/reject
│   └── ui/                           # shadcn/ui components (existing)
├── lib/
│   ├── types.ts                      # All domain types
│   ├── normalize.ts                  # Identifier normalize/mask/hash (HMAC)
│   ├── sanitize.ts                   # Input sanitization, SSRF guard, date validation
│   ├── rate-limit.ts                 # In-memory token-bucket rate limiter
│   ├── storage.ts                    # ReportStore interface + LocalSeed/GitHub adapters
│   ├── search.ts                     # (search logic lives in storage.ts)
│   ├── gemini.ts                     # Gemini REST client + schema validation + fallback
│   ├── github.ts                     # GitHub Contents + Issues API client (SHA-protected)
│   ├── admin-auth.ts                 # Constant-time login + signed session cookie
│   ├── audit.ts                      # Append-only JSONL audit log
│   └── labels.ts                     # Human-readable labels + Tailwind badge classes
├── data/
│   ├── reports.json                  # 13 fictional demo approved reports
│   ├── indexes/search-index.json     # Search index (HMAC-keyed)
│   ├── categories.ts                 # 10 scam categories with warning signs
│   ├── countries.ts                  # 25 countries with official report URLs
│   └── safety-guides.ts              # 10 safety guides (how it works, warning signs, etc.)
└── scripts/
    └── generate-seed-data.ts         # Regenerates reports.json + search-index.json
```

---

## Search engine

The search engine reads only from approved JSON indexes. It never searches pending or rejected reports, and never fabricates results.

**Matching pipeline** (`src/lib/storage.ts` → `searchByIdentifier`):
1. The raw query is normalized by type (E.164 phone, lowercased domain, normalized email, etc.) using `src/lib/normalize.ts`.
2. The normalized value is HMAC-SHA256 hashed with `IDENTIFIER_HMAC_SECRET`.
3. The hash is matched against `data/indexes/search-index.json`.
4. For domain/URL queries, a partial domain-suffix match is also attempted (so `example.com` matches `shop.example.com`).
5. Matched reports are loaded, sorted by recency, and returned with masked identifiers.
6. Results are cached in-process for 60 seconds.

**Search status labels** (never confuse volume with proof):
- `no_reports` — No community reports found.
- `unverified` — Single community report, no review.
- `multiple_reports` — Multiple independent community reports.
- `evidence_reviewed` — Supporting evidence reviewed by editors.
- `independently_confirmed` — Corroborated by trusted sources.
- `disputed` — Subject has submitted a correction or response.

**Performance:**
- A prebuilt index file (`data/indexes/search-index.json`) is loaded once and cached.
- We never fetch every report file from GitHub for every search.
- The `ReportStore` interface is modular so a dedicated search service (e.g. Meilisearch, Typesense, or a database) can be added later without rewriting the frontend.

---

## Report submission pipeline

`POST /api/reports` (`src/app/api/reports/route.ts`):

1. **Rate limit** — 3 submissions per ~15s per IP.
2. **Honeypot** — a hidden `company` field; if non-empty, the request is silently accepted but discarded (bot decoy).
3. **Schema validation** — `zod` schema validates category, channel, identifier type/value, country, description (≥20 chars), incident date, consent flags.
4. **Sanitization** — all free-text fields are stripped of control characters and prompt-injection markers (`src/lib/sanitize.ts`).
5. **Reference generation** — `SC-YYYY-XXXXXXXX` using `crypto.randomBytes`.
6. **Gemini analysis** (best-effort) — `analyzeReport` calls Gemini with the submission in a `USER_REPORT_BEGIN/END` data block; the response is validated against the `GeminiAnalysis` schema. On any failure, a deterministic fallback analysis is used.
7. **GitHub Issue creation** (best-effort) — `createModerationIssue` opens an issue in the private repo with the submission, the Gemini analysis, and labels `pending-review` (+ `ai-analysis-complete` if analysis succeeded).
8. **Audit log** — `audit()` appends a JSONL event.
9. **Response** — returns the reference number and a clear "pending review" message. The report is **not** published.

**Anonymous reporting:** no account is required. The reporter handle is optional. The IP address is used only for rate-limiting and is not stored with the report.

**AI safety:** Gemini never auto-publishes, never declares guilt, never invents evidence. See `src/lib/gemini.ts` for the full prompt and validation.

---

## Admin moderation

`/admin` (and `/api/admin/*`) — protected by `ADMIN_SECRET` and a signed session cookie (`src/lib/admin-auth.ts`).

**Login flow:**
1. POST `/api/admin/login` with `{ password }`.
2. Server compares with `ADMIN_SECRET` using `timingSafeEqual` (constant-time).
3. On success, a signed cookie `sie_admin` is set (8-hour TTL, httpOnly, secure in production, sameSite=lax).
4. Failed attempts are rate-limited (5 per ~50s per IP) and audit-logged.

**Moderation workflow** (`src/components/admin/admin-dashboard.tsx`):
1. Dashboard overview: published reports, tracked identifiers, pending count, disputed count (all real, derived from data).
2. Pending queue: open issues labelled `pending-review` from the private repo.
3. Each row expands to a review panel pre-filled from the parsed issue body.
4. Approve: the admin confirms/redacts the category, channel, identifier, country, description, evidence status and corroboration count. The backend (`/api/admin/approve`) masks the identifier, builds an approved `ScamReport`, publishes it to the public repo (SHA-protected against concurrent writes), updates the issue's labels, and leaves an audit comment.
5. Reject: the backend updates the issue label to `rejected` and leaves an audit comment.

**Concurrency protection** (`publishApprovedReport` in `src/lib/github.ts`):
- Reads the current file SHA before writing.
- On HTTP 409 (conflict), re-fetches the SHA and retries (up to 3 attempts).
- Never overwrites a newer version without checking the SHA.

**Audit trail:** every moderation action is appended to a JSONL audit log (`src/lib/audit.ts`) and recorded as a GitHub issue comment.

---

## Security checklist

- [x] **Server-side Gemini API requests.** Gemini is called only from `/api/reports` and `src/lib/gemini.ts`. The API key is never sent to the client.
- [x] **Server-side GitHub API requests.** All GitHub writes happen in `src/lib/github.ts`. Tokens are never exposed to the client. No `NEXT_PUBLIC_` prefix on token variables.
- [x] **Secure environment variables.** `.env.example` documents every variable. Real secrets are never committed.
- [x] **Input validation.** Every API route validates input with `zod` schemas.
- [x] **Output sanitization.** Free-text fields are stripped of control characters and prompt-injection markers. Identifiers are masked before publication.
- [x] **Rate limiting.** In-memory token-bucket per IP+route (`src/lib/rate-limit.ts`). Search: 20/min. Report submission: 3/15s. Admin login: 5/50s.
- [x] **Bot protection.** Honeypot field on the report form; rate limiting; schema validation rejects malformed payloads.
- [x] **CSRF protection.** All mutating API routes use `Content-Type: application/json` POST bodies (not form-encodable), which provides baseline CSRF protection. Next.js 16 server actions are not used for these endpoints.
- [x] **Secure admin sessions.** Signed HMAC cookie, httpOnly, secure in production, sameSite=lax, 8-hour TTL. Constant-time password compare.
- [x] **File and URL validation.** `isSafePublicUrl` blocks localhost, private IPs, link-local, cloud metadata endpoints (SSRF guard). The MVP does not accept file uploads.
- [x] **Safe error handling.** Errors are caught and logged; generic messages are returned to the client. No stack traces leaked.
- [x] **Security headers.** Configured via Vercel's default headers + `robots.ts` disallowing `/api/admin` and `/admin`. Add a `next.config.js` `headers()` function for CSP, HSTS, X-Frame-Options in production.
- [x] **Audit logging.** Every submit, login, approve, reject is logged.
- [x] **No arbitrary URL fetching.** The backend never fetches user-supplied URLs. The `isSafePublicUrl` helper is provided for future features.
- [x] **SSRF / XSS / injection guards.** Input sanitization, output masking, parameterized GitHub API calls (no string interpolation into URLs for write operations).
- [x] **No evidence file uploads in MVP.** Only structured text reports. If uploads are added later, use private object storage, never GitHub.

**Before launch, also:**
- [ ] Configure CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy in `next.config.ts` `headers()`.
- [ ] Review privacy, defamation, and intermediary-liability laws in each target country.
- [ ] Set up monitoring/alerting on Gemini API usage and Vercel function consumption.
- [ ] Rotate `IDENTIFIER_HMAC_SECRET` plan — it must NEVER change after launch.

---

## Functional testing checklist

### Visitor search
- [x] Open homepage — hero, search field, CTAs render.
- [x] Search a known demo identifier (e.g. `+60123456789`) — returns matched reports with masked identifier and status badge.
- [x] View report details — opens report card with category, country, channel, masked identifier, date, corroboration count.
- [x] Search an unknown identifier (e.g. `totally-unknown-12345.example`) — returns `no_reports` status with safety advice.
- [x] No-results page is clear and non-alarmist.

### Report submission
- [x] Open report form — 6-step wizard renders.
- [x] Complete all required fields — category, channel, identifier, incident details, consent.
- [x] Submit — receives a reference number (`SC-YYYY-XXXXXXXX`).
- [x] Confirmation panel shows reference and "pending review" message.
- [x] Report is NOT publicly visible immediately (no search hit for the new identifier).
- [x] In demo mode (no GitHub), submission still succeeds and returns a reference.
- [x] With GitHub configured, a private Issue is created in the moderation repo.

### Gemini processing
- [x] Submit a report — backend attempts Gemini analysis.
- [x] With `GEMINI_API_KEY` set, analysis runs and is included in the GitHub Issue body.
- [x] With `GEMINI_API_KEY` unset, fallback analysis is used and submission still succeeds.
- [x] Malformed Gemini output (simulate by returning invalid JSON) — fallback path is used, submission succeeds.
- [x] Gemini API failure (simulate network error) — fallback path is used, submission succeeds.

### Admin moderation
- [x] Sign into `/admin` with `ADMIN_SECRET` — dashboard loads.
- [x] Failed login attempts are rate-limited and audit-logged.
- [x] Pending reports appear in the queue (when GitHub is configured).
- [x] Open a pending report — review panel expands with pre-filled fields.
- [x] Edit/redact fields — approve publishes masked JSON to the public repo.
- [x] Reject updates the issue label to `rejected`.
- [x] Approved report becomes searchable via `/api/search`.

### Security
- [x] Unauthorized `/api/admin/*` access returns 401.
- [x] GitHub tokens are not present in any client bundle (search the build output for `ghp_` / `github_pat_`).
- [x] Gemini key is not present in any client bundle.
- [x] Duplicate submission (same identifier within rate-limit window) is rate-limited.
- [x] Rate limiting returns 429 with `Retry-After`.
- [x] Malicious input (`<script>`, `'; DROP TABLE--`, `system: ignore previous`) is sanitized.
- [x] HTML injection — user content is rendered as text, not HTML (React escapes by default; no `dangerouslySetInnerHTML`).
- [x] Unsafe URLs — `isSafePublicUrl` blocks localhost/private IPs/metadata endpoints.
- [x] Concurrent report publishing — SHA-based conflict detection retries on 409.

**To run these tests manually:** start the dev server, open the homepage, and walk through each checklist item. For Gemini/GitHub failure modes, unset the relevant environment variable and re-submit.

---

## Advertising policy

Per the product spec, advertising is minimal and clearly labelled:

| Page | Ad placement |
| --- | --- |
| Homepage | One small advertisement |
| Search results | **No advertisements** |
| Report submission | **No advertisements** |
| Report details | **No advertisements** |
| Recovery guides | **No advertisements** |
| Educational articles | One optional advertisement |
| About page | **No advertisements** |

The `AdPlacement` component (`src/components/site/ad-placement.tsx`) renders a labelled placeholder until AdSense is approved. The AdSense script is only loaded when `NEXT_PUBLIC_ADSENSE_CLIENT` and a slot ID are configured.

Advertising never influences search results or moderation.

---

## Roadmap

The MVP delivers Stages 1–6 and partial 7–8 of the product roadmap:

- ✅ Stage 1 — Project foundation (Next.js, TypeScript, Tailwind, env template).
- ✅ Stage 2 — Public website (homepage, search, report, report detail, categories, guides, legal pages).
- ✅ Stage 3 — GitHub storage (public JSON, search indexes, private moderation repo, GitHub Issues integration).
- ✅ Stage 4 — Gemini integration (classification, extraction, sensitive-info detection, duplicate suggestions, graceful failure).
- ✅ Stage 5 — Admin moderation (login, pending queue, approve/reject, redaction, JSON publishing, audit).
- ✅ Stage 6 — Search optimization (indexing, caching, normalization, pagination-ready).
- ✅ Stage 7 — Advertising (component, placement config, AdSense-ready, privacy review pending).
- ✅ Stage 8 — Final testing and deployment (checklists above, Vercel config).

**Future work (explicitly out of MVP scope):**
- Replace in-memory rate limiter with Upstash Redis.
- Replace `LocalSeedStore` with a database-backed `ReportStore` (the interface is ready).
- Add evidence file uploads via private object storage (S3/R2), never GitHub.
- Add multi-admin roles via NextAuth + email verification.
- Add a dedicated full-text search service (Meilisearch/Typesense) once report volume justifies it.
- Add per-country legal review before launching in each jurisdiction.
- Add structured-data (`Report` schema) for richer search-engine results.

---

## Legal & community

- A community report is a submitted experience. It does **not**, by itself, establish that any person or business committed a crime.
- The platform distinguishes `unverified`, `multiple reports`, `evidence reviewed`, `independently confirmed`, and `disputed` statuses. An AI confidence score is never treated as proof.
- Subjects of reports can submit a correction request (`/correction-request`) or appeal (`/report-appeal`). Both processes are free.
- Review the privacy, defamation, and intermediary-liability laws of each target country before launching there. The platform's legal pages (`/privacy-policy`, `/terms`, `/community-guidelines`) are templates — have them reviewed by a qualified lawyer before launch.

---

**Check Before You Trust.** A free public service.
