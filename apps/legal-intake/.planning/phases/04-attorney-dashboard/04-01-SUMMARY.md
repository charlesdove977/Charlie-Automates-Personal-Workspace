---
phase: 04-attorney-dashboard
plan: 01
subsystem: auth
tags: [nextauth, jwt, bcryptjs, credentials, middleware]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: User model with email, name, role, firmId
provides:
  - NextAuth.js v5 authentication
  - JWT session with custom fields (id, role, firmId, firmSlug)
  - Protected /dashboard/* routes
  - Login/logout functionality
affects: [04-02, 04-03, 04-04]

# Tech tracking
tech-stack:
  added: [next-auth@5.0.0-beta.30, @auth/prisma-adapter, bcryptjs]
  patterns: [JWT sessions, credentials provider, middleware protection]

key-files:
  created: [src/lib/auth.ts, src/middleware.ts, src/app/dashboard/login/page.tsx, src/app/dashboard/layout.tsx, src/app/dashboard/page.tsx, src/app/dashboard/logout-button.tsx, src/types/next-auth.d.ts, src/app/api/auth/[...nextauth]/route.ts]
  modified: [prisma/schema.prisma, package.json]

key-decisions:
  - "NextAuth.js v5 beta for authentication (free, self-hosted)"
  - "JWT strategy for serverless compatibility"
  - "passwordHash field added to User model"

patterns-established:
  - "Middleware protects /dashboard/* routes"
  - "Session includes custom fields (id, role, firmId, firmSlug)"
  - "Server components use auth() for session access"

issues-created: []

# Metrics
duration: 8min
completed: 2026-01-13
---

# Phase 4 Plan 01: Authentication Setup Summary

**NextAuth.js v5 with credentials provider, JWT sessions, and protected dashboard routes**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-13T20:15:00Z
- **Completed:** 2026-01-13T20:23:00Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Installed and configured NextAuth.js v5 beta with credentials provider
- Added passwordHash field to User model for secure password storage
- Created professional login page at /dashboard/login
- Protected all /dashboard/* routes with middleware
- Added logout functionality with session clearing
- Extended session to include custom fields (id, role, firmId, firmSlug)

## Task Commits

Each task was committed atomically:

1. **Task 1: Authentication decision** - (checkpoint: chose nextauth)
2. **Task 2: Install and configure NextAuth.js** - `ccbb83f` (feat)
3. **Task 3: Create login page and protect dashboard routes** - `500f4c6` (feat)

**Plan metadata:** (pending)

## Files Created/Modified
- `src/lib/auth.ts` - NextAuth configuration with credentials provider and JWT callbacks
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API route handler
- `src/middleware.ts` - Route protection for /dashboard/*
- `src/app/dashboard/login/page.tsx` - Login form with email/password
- `src/app/dashboard/layout.tsx` - Dashboard layout with header and logout
- `src/app/dashboard/logout-button.tsx` - Client-side logout button
- `src/app/dashboard/page.tsx` - Placeholder dashboard showing session info
- `src/types/next-auth.d.ts` - TypeScript declarations for extended session
- `prisma/schema.prisma` - Added passwordHash field to User model
- `package.json` - Added next-auth, @auth/prisma-adapter, bcryptjs

## Decisions Made
- **NextAuth.js v5 beta** over Clerk or simple credentials - Free, self-hosted, uses existing User model directly
- **JWT strategy** over database sessions - Better for serverless environments
- **Middleware-based protection** - Intercepts requests before reaching pages

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Next.js 16 shows deprecation warning for `middleware.ts` in favor of `proxy` - functionality still works, can be addressed in future cleanup

## Next Phase Readiness
- Authentication foundation complete
- Dashboard routes protected
- Ready for 04-02: Dashboard Shell & Case Inbox

---
*Phase: 04-attorney-dashboard*
*Completed: 2026-01-13*
