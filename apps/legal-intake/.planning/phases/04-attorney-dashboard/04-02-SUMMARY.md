---
phase: 04-attorney-dashboard
plan: 02
subsystem: dashboard-ui
tags: [sidebar, case-inbox, filtering, auto-refresh, processing-status]

# Dependency graph
requires:
  - phase: 04-attorney-dashboard
    plan: 01
    provides: NextAuth.js authentication, protected routes, session with firmId
provides:
  - Dashboard layout with sidebar navigation
  - Case inbox with status filtering
  - Processing status badges with auto-refresh
  - Fit score visualization
affects: [04-03, 04-04]

# Tech tracking
tech-stack:
  added: []
  patterns: [client components for interactivity, server components for layout, polling for real-time updates]

key-files:
  created: [src/components/dashboard/Sidebar.tsx, src/components/dashboard/Header.tsx, src/components/dashboard/CaseList.tsx, src/components/dashboard/CaseCard.tsx, src/components/dashboard/ProcessingBadge.tsx, src/app/api/dashboard/cases/route.ts]
  modified: [src/app/dashboard/layout.tsx, src/app/dashboard/page.tsx]

key-decisions:
  - "Dark blue sidebar matching firm primaryColor default (#1a365d)"
  - "Filter tabs default to Pending status for immediate action focus"
  - "5-second polling interval for processing cases"
  - "Fit score color coding: green ≥70, yellow 50-69, red <50"

patterns-established:
  - "Dashboard API routes require auth and filter by firmId (multi-tenant)"
  - "Client components for interactive lists, server components for layout"
  - "useCallback + useEffect pattern for polling with cleanup"

issues-created: []

# Metrics
duration: 12min
completed: 2026-01-13
---

# Phase 4 Plan 02: Dashboard Shell & Case Inbox Summary

**Dashboard layout with sidebar navigation and filterable case inbox**

## Performance

- **Duration:** 12 min
- **Started:** 2026-01-13T21:00:00Z
- **Completed:** 2026-01-13T21:12:00Z
- **Tasks:** 3
- **Files created/modified:** 8

## Accomplishments
- Created professional sidebar with firm branding and navigation
- Built responsive dashboard layout with header showing user info
- Implemented GET /api/dashboard/cases API with multi-tenant filtering
- Created case inbox with Pending/Accepted/Rejected/All filter tabs
- Added fit score badges with color-coded visualization
- Built processing status badges with spinner animations
- Implemented auto-refresh polling for in-progress cases

## Task Commits

Each task completed atomically:

1. **Task 1: Dashboard layout with sidebar navigation**
   - Created Sidebar component with navigation links
   - Created Header component with user info and logout
   - Updated layout.tsx to use new components

2. **Task 2: Case inbox list with filtering**
   - Created /api/dashboard/cases endpoint
   - Created CaseCard component with case details
   - Created CaseList component with filter tabs
   - Updated dashboard page to show case list

3. **Task 3: Processing status indicators and auto-refresh**
   - Extracted ProcessingBadge to dedicated component
   - Auto-refresh polls every 5 seconds for processing cases
   - Stops polling when all cases complete or fail

## Files Created/Modified
- `src/components/dashboard/Sidebar.tsx` - Left sidebar with firm name and navigation
- `src/components/dashboard/Header.tsx` - Top header with user info and logout
- `src/components/dashboard/CaseList.tsx` - Case list with filtering and auto-refresh
- `src/components/dashboard/CaseCard.tsx` - Individual case card with status badges
- `src/components/dashboard/ProcessingBadge.tsx` - Processing status indicator
- `src/app/api/dashboard/cases/route.ts` - GET endpoint for case list
- `src/app/dashboard/layout.tsx` - Updated to use new sidebar/header
- `src/app/dashboard/page.tsx` - Now shows CaseList component

## Verification Checklist
- [x] Dashboard layout renders with sidebar and header
- [x] Case list loads and displays cases
- [x] Filter tabs work correctly (Pending/Accepted/Rejected/All)
- [x] Fit score badges show with correct colors (green/yellow/red)
- [x] Processing status badges update appropriately
- [x] Auto-refresh works for processing cases (5-second interval)
- [x] `pnpm build` passes

## Decisions Made
- **Dark blue sidebar** (#1a365d) - Matches default firm primaryColor, professional look
- **Pending tab default** - Attorneys want to see actionable cases first
- **5-second polling** - Balance between responsiveness and server load
- **Relative timestamps** - "2 hours ago" more scannable than absolute dates

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

None.

## Next Phase Readiness
- Dashboard shell complete with navigation
- Case inbox displays all relevant information
- Ready for 04-03: Case Detail View

---
*Phase: 04-attorney-dashboard*
*Completed: 2026-01-13*
