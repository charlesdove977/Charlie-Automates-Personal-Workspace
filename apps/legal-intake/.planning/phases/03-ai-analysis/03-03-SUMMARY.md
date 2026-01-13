---
phase: 03-ai-analysis
plan: 03
subsystem: api
tags: [prisma, processing-pipeline, status-tracking, background-jobs, api]

# Dependency graph
requires:
  - phase: 03-01
    provides: Document text extraction service
  - phase: 03-02
    provides: OpenAI analysis service
provides:
  - Automated processing pipeline (extract → analyze → score)
  - Processing status tracking with ProcessingStatus enum
  - Status API endpoint for polling
  - Reprocess endpoint for retries
affects: [04-attorney-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns: [fire-and-forget-processing, status-polling, processing-state-machine]

key-files:
  created:
    - src/lib/processing.ts
    - src/app/api/cases/[caseId]/status/route.ts
    - src/app/api/cases/[caseId]/reprocess/route.ts
  modified:
    - prisma/schema.prisma
    - src/app/api/cases/submit/route.ts

key-decisions:
  - "Fire-and-forget processing on submission - returns immediately"
  - "ProcessingStatus enum: QUEUED → EXTRACTING → ANALYZING → COMPLETE/FAILED"
  - "Basic fit score algorithm: 50 baseline, +10/+5 for key facts, -15/-5 for red flags"
  - "Reprocess clears extracted text to force re-extraction"

patterns-established:
  - "Processing state machine with status tracking"
  - "Background processing with error capture to processingError field"
  - "Status polling pattern for async operations"

issues-created: []

# Metrics
duration: ~20min
completed: 2026-01-13
---

# Phase 03 Plan 03: Processing Pipeline Integration Summary

**Automated case processing pipeline with status tracking, background processing on submission, and manual reprocess capability**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-01-13T21:20:00Z
- **Completed:** 2026-01-13T21:43:50Z
- **Tasks:** 5 auto + 1 checkpoint
- **Files created:** 3
- **Files modified:** 2

## Accomplishments

- ProcessingStatus enum added to Prisma schema (QUEUED, EXTRACTING, ANALYZING, COMPLETE, FAILED)
- Unified processing service orchestrates extraction → analysis → scoring
- Automatic processing triggered on case submission (fire-and-forget)
- Status API endpoint for polling processing state
- Reprocess endpoint for manual retries and debugging
- Basic fit score calculation (50 baseline, adjusted by key facts and red flags)

## Task Commits

Each task was committed atomically (combined in this session):

1. **Task 1: Add processing status to Case model** - Schema updated, `pnpm prisma db push`
2. **Task 2: Create unified processing service** - `src/lib/processing.ts`
3. **Task 3: Trigger processing on case submission** - Updated submit route
4. **Task 4: Create processing status API endpoint** - `GET /api/cases/[caseId]/status`
5. **Task 5: Create manual reprocess endpoint** - `POST /api/cases/[caseId]/reprocess`

## Files Created/Modified

- `prisma/schema.prisma` - Added ProcessingStatus enum and Case fields
- `src/lib/processing.ts` - Orchestrates full extract → analyze → score pipeline
- `src/app/api/cases/submit/route.ts` - Triggers background processing on submission
- `src/app/api/cases/[caseId]/status/route.ts` - GET endpoint for status polling
- `src/app/api/cases/[caseId]/reprocess/route.ts` - POST endpoint for manual reprocessing

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Fire-and-forget processing | Allows immediate response to client; serverless-friendly |
| ProcessingStatus state machine | Clear visibility into pipeline stages |
| 50-point baseline fit score | Neutral starting point; adjusted by extracted facts |
| Reprocess clears extractedText | Forces fresh extraction, handles document updates |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Type Error] Fixed Prisma JsonNull for briefJson reset**
- **Found during:** Task 5 (reprocess endpoint)
- **Issue:** `briefJson: null` doesn't work with Prisma JSON type
- **Fix:** Changed to `Prisma.JsonNull` import
- **Files modified:** src/app/api/cases/[caseId]/reprocess/route.ts
- **Verification:** Build passes

**2. [Rule 3 - Missing Error Handling] Added try-catch to status endpoint**
- **Found during:** Human verification (500 errors on status check)
- **Issue:** Database errors not caught, returned empty 500 response
- **Fix:** Added try-catch with errorResponse
- **Files modified:** src/app/api/cases/[caseId]/status/route.ts, reprocess route
- **Verification:** Endpoint returns proper JSON error messages

---

**Total deviations:** 2 auto-fixed (1 type error, 1 missing error handling)
**Impact on plan:** Minor fixes for correctness. No scope creep.

## Issues Encountered

- Prisma client regeneration required after schema changes for dev server to pick up new fields
- Initial submissions before pipeline existed have `QUEUED` status but won't auto-process (use reprocess endpoint)

## Processing Performance Characteristics

- **Text extraction:** ~1-2 seconds per document (PDF/DOCX)
- **AI analysis:** ~3-5 seconds (GPT-4o)
- **Total pipeline:** ~5-10 seconds for typical single-document case
- **Serverless note:** Fire-and-forget may timeout; production should use queue/background tasks

## Next Phase Readiness

- **Phase 3 COMPLETE**: AI analysis engine fully functional
- All components working end-to-end:
  - Document upload → Text extraction → AI analysis → Fit scoring → Status tracking
- Ready for **Phase 4: Attorney Dashboard**
  - Case list with processing status
  - Brief viewer with AI-generated content
  - Fit score display

---
*Phase: 03-ai-analysis*
*Completed: 2026-01-13*
