# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-12)

**Core value:** Attorneys can make informed accept/reject decisions on cases in under 2 minutes without reading raw documents or taking free consults that go nowhere.
**Current focus:** Phase 4 — Attorney Dashboard (COMPLETE)

## Current Position

Phase: 4 of 6 (Attorney Dashboard) — **COMPLETE**
Plan: 4 of 4 complete
Status: Phase 4 finished, ready for Phase 5
Last activity: 2026-01-13 — Completed 04-04-PLAN.md (Accept/Reject Actions)

Progress: █████████████████ 100% (Phase 4)

## Performance Metrics

**Velocity:**
- Total plans completed: 13
- Average duration: 13 min
- Total execution time: 174 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 11 min | 4 min |
| 02-client-intake | 4 | 74 min | 19 min |
| 03-ai-analysis | 3 | 57 min | 19 min |
| 04-attorney-dashboard | 4 | 32 min | 8 min |

**Recent Trend:**
- Last 5 plans: 03-03 (20 min), 04-01 (8 min), 04-02 (12 min), 04-03 (25 min), 04-04 (12 min)
- Trend: Dashboard UI complete with all core features

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-02 | Prisma 7 config format with prisma.config.ts | Breaking change from Prisma 7, required for Supabase DIRECT_URL |
| 01-02 | Multi-tenant by firmId | All entities linked to Firm for data isolation |
| 01-03 | Cache-Control: no-store for API routes | Prevent stale data in API responses |
| 01-03 | iad1 Vercel region | US-East deployment for typical law firm users |
| 02-01 | @supabase/ssr (not auth-helpers) | Modern SSR package for Next.js 14+ |
| 02-01 | Storage path: {firmId}/{caseId}/{filename} | Multi-tenant file organization |
| 02-02 | force-dynamic export for firm pages | Database queries cannot run at build time |
| 02-02 | Native HTML5 drag-drop (no libraries) | Keep dependencies minimal, standard browser APIs |
| 02-02 | Prisma 7 accelerateUrl config in db.ts | Required for prisma+postgres:// URLs |
| 02-03 | Native form with React state (no form library) | Keep dependencies minimal |
| 02-03 | 4-step intake flow | Prevents overwhelming users with long single form |
| 02-03 | Legal disclaimer requires checkbox acceptance | Compliance before submission |
| 03-01 | unpdf instead of pdf-parse | pdf-parse has unfixable test file loading issues |
| 03-01 | Signed URLs for private storage | Service role key generates temp URLs, docs stay private |
| 03-02 | OpenAI GPT-4o instead of Claude | Switched mid-implementation for provider preference |
| 03-02 | Temperature 0 for analysis | Consistent, reproducible fact extraction |
| 03-02 | Paralegal persona in prompts | Constrains AI to facts only, no legal advice |
| 03-03 | Fire-and-forget processing on submission | Immediate response to client; serverless-friendly |
| 03-03 | ProcessingStatus state machine | QUEUED → EXTRACTING → ANALYZING → COMPLETE/FAILED |
| 03-03 | Basic fit score: 50 baseline | Adjusted by key facts (+10/+5) and red flags (-15/-5) |
| 04-01 | NextAuth.js v5 for authentication | Free, self-hosted, JWT strategy for serverless |
| 04-01 | passwordHash field on User model | Secure credential storage with bcryptjs |
| 04-02 | Sidebar + header layout pattern | Professional dashboard shell with firm branding |
| 04-02 | 5-second polling for processing cases | Balance responsiveness with server load |
| 04-02 | Fit score color coding (green/yellow/red) | Quick visual assessment at 70/50 thresholds |
| 04-04 | Template-based rejection response | No AI needed for MVP; professional and empathetic |
| 04-04 | Reusable ConfirmDialog component | Modal pattern for all confirmation actions |

### Deferred Issues

| Issue | Reason | Revisit |
|-------|--------|---------|
| Email sending on reject | Out of MVP scope | Phase 5 |
| Calendar booking on accept | Out of MVP scope | Phase 5+ |

### Blockers/Concerns

None.

## Session Continuity

Last session: 2026-01-13
Stopped at: Completed 04-04-PLAN.md (Accept/Reject Actions)
Resume file: None
Next: Plan Phase 5 (Notifications & Email Integration) or deploy MVP
