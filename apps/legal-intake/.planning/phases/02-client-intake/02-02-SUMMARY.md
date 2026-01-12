---
phase: 02-client-intake
plan: 02
subsystem: ui
tags: [next.js, dynamic-routes, file-upload, drag-drop, prisma-7]

# Dependency graph
requires:
  - phase: 02-client-intake-01
    provides: Supabase client utilities, storage bucket documentation
  - phase: 01-foundation-02
    provides: Prisma schema with Firm model
provides:
  - Dynamic firm landing page at /[firmSlug]
  - FileDropzone component for multi-file drag-and-drop upload
  - FileList component for displaying selected files with progress
affects: [intake-form, document-submission, case-creation]

# Tech tracking
tech-stack:
  added: []
  patterns: [dynamic-route-fetching, prisma-7-accelerateUrl, html5-drag-drop]

key-files:
  created:
    - src/app/[firmSlug]/layout.tsx
    - src/app/[firmSlug]/page.tsx
    - src/components/intake/FileDropzone.tsx
    - src/components/intake/FileList.tsx
  modified:
    - src/lib/db.ts

key-decisions:
  - "Used force-dynamic export for firm pages to avoid build-time database queries"
  - "Prisma 7 requires accelerateUrl for prisma+postgres:// URLs - updated db.ts"
  - "Native HTML5 drag-and-drop without external libraries for simplicity"
  - "File validation at component level (10MB max, PDF/DOC/DOCX/JPG/PNG)"

patterns-established:
  - "Dynamic firm routes: Server components fetch firm by slug, pass to children"
  - "File upload pattern: FileDropzone.onFilesSelected returns validated SelectedFile[]"
  - "Firm branding: CSS variable --firm-primary set from firm.primaryColor"

issues-created: []

# Metrics
duration: 12min
completed: 2026-01-12
---

# Phase 02 Plan 02: Firm Landing Page and File Upload Components Summary

**Dynamic firm landing pages with multi-file drag-and-drop upload components using native HTML5 APIs**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-12T23:15:00Z
- **Completed:** 2026-01-12T23:27:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Created dynamic firm landing page at `/[firmSlug]` with firm branding
- Built FileDropzone component with HTML5 drag-and-drop support
- Built FileList component for displaying selected files with progress tracking
- Fixed Prisma 7 client initialization for build compatibility

## Task Commits

Each task was committed atomically:

1. **Task 1: Create firm landing page with dynamic routing** - `d266d2e` (feat)
2. **Task 2: Build file upload dropzone component** - `d969eb3` (feat)
3. **Fix: Prisma 7 build compatibility** - `a64aa9f` (fix)

## Files Created/Modified

- `src/app/[firmSlug]/layout.tsx` - Server component fetching firm by slug, applies branding
- `src/app/[firmSlug]/page.tsx` - Professional landing page with firm logo, intro, CTA
- `src/components/intake/FileDropzone.tsx` - Drag-and-drop file selection with validation
- `src/components/intake/FileList.tsx` - File list display with progress and remove functionality
- `src/lib/db.ts` - Updated for Prisma 7 accelerateUrl configuration

## Decisions Made

- Used `export const dynamic = 'force-dynamic'` for firm layout to ensure request-time rendering (required since database queries cannot run at build time)
- Updated Prisma client to pass `accelerateUrl` for `prisma+postgres://` URLs (Prisma 7 breaking change)
- Native HTML5 drag-and-drop without external libraries - keeps dependencies minimal
- File validation enforces: PDF, DOC, DOCX, JPG, PNG formats and 10MB max size per file

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prisma 7 client initialization failing during build**
- **Found during:** Verification (pnpm build)
- **Issue:** Prisma 7 with `prisma+postgres://` URL requires `accelerateUrl` constructor option; `new PrismaClient()` without options caused PrismaClientInitializationError
- **Fix:** Updated db.ts to detect prisma+postgres:// URLs and pass accelerateUrl option
- **Files modified:** src/lib/db.ts, src/app/[firmSlug]/layout.tsx (added force-dynamic)
- **Verification:** pnpm build succeeds, pnpm lint passes
- **Committed in:** a64aa9f

---

**Total deviations:** 1 auto-fixed (blocking issue)
**Impact on plan:** Fix was necessary for build to succeed. Pre-existing Prisma 7 configuration issue.

## Issues Encountered

- Prisma 7 has significant breaking changes from previous versions - URL configuration moved from schema to client constructor. Documentation: [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)

## Next Phase Readiness

- Firm landing page ready at `/[firmSlug]`
- File upload components ready for integration in intake form
- Next step: Create `/[firmSlug]/intake` page with actual intake form
- File upload to Supabase storage still needed (components handle selection, not upload)

---
*Phase: 02-client-intake*
*Completed: 2026-01-12*
