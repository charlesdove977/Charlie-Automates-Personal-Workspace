---
phase: 02-client-intake
plan: 04
subsystem: api
tags: [supabase, storage, multipart, prisma, formdata]

# Dependency graph
requires:
  - phase: 02-03
    provides: Intake form UI with questionnaire and legal disclaimer
  - phase: 01-02
    provides: Prisma schema with Case and Document models
provides:
  - POST /api/cases/submit endpoint
  - File upload to Supabase Storage
  - Document record creation with storage URLs
  - Complete client intake submission flow
affects: [phase-3-ai-analysis, attorney-dashboard]

# Tech tracking
tech-stack:
  added: ["@supabase/supabase-js"]
  patterns: ["multipart form handling", "Supabase Storage uploads", "service role client for storage"]

key-files:
  created:
    - src/app/api/cases/submit/route.ts
    - src/lib/storage.ts
  modified:
    - src/app/[firmSlug]/intake/page.tsx
    - src/components/intake/IntakeForm.tsx
    - package.json

key-decisions:
  - "Service role key for storage uploads (bypasses RLS for server-side uploads)"
  - "Storage path pattern: case-documents/{firmId}/{caseId}/{timestamp}-{filename}"
  - "Partial upload handling: Case saved even if some files fail"

patterns-established:
  - "Multipart form parsing with request.formData() in Next.js API routes"
  - "File validation before upload (type + size)"
  - "Storage utility abstraction in src/lib/storage.ts"

issues-created: []

# Metrics
duration: 54 min
completed: 2026-01-13
---

# Phase 2 Plan 4: Case Submission API Summary

**POST /api/cases/submit endpoint with Supabase Storage file uploads and Document record creation**

## Performance

- **Duration:** 54 min (includes Supabase setup and manual testing)
- **Started:** 2026-01-13T18:50:40Z
- **Completed:** 2026-01-13T19:44:31Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 5

## Accomplishments

- Case submission API endpoint with multipart/form-data handling
- File upload to Supabase Storage with validation (type + size)
- Document records created with storage URLs
- Intake form integrated with submission API
- Complete end-to-end intake flow working

## Task Commits

1. **Task 1: Create case submission API endpoint** - `c0bc537` (feat)
2. **Task 2: Handle file upload to Supabase Storage** - `168b2b0` (feat)
3. **Bug fix: Form navigation** - `e812014` (fix)
4. **API integration in intake form** - `0848984` (feat)

## Files Created/Modified

- `src/app/api/cases/submit/route.ts` - POST handler for case submission with validation
- `src/lib/storage.ts` - Supabase Storage upload utility with file validation
- `src/app/[firmSlug]/intake/page.tsx` - Integrated form with submission API
- `src/components/intake/IntakeForm.tsx` - Added form ID for external submission
- `package.json` - Added @supabase/supabase-js dependency

## Decisions Made

- Used service role key for storage uploads to bypass RLS on server side
- Storage path: `case-documents/{firmId}/{caseId}/{timestamp}-{filename}` for organization
- Partial upload handling: Case is saved even if some file uploads fail
- File validation: PDF, DOC, DOCX, JPG, JPEG, PNG up to 10MB

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Form continue button not working**
- **Found during:** Checkpoint verification
- **Issue:** Form missing `id` attribute, contact step button not triggering navigation
- **Fix:** Added `id="intake-form"` to form, fixed button onClick handler
- **Files modified:** IntakeForm.tsx, intake/page.tsx
- **Verification:** Form navigation works correctly
- **Committed in:** e812014

**2. [Rule 2 - Missing Critical] Form not connected to API**
- **Found during:** Checkpoint verification
- **Issue:** handleFinalSubmit was using placeholder setTimeout, not calling actual API
- **Fix:** Integrated with /api/cases/submit, added FormData building with files
- **Files modified:** src/app/[firmSlug]/intake/page.tsx
- **Verification:** Form submission creates Case and Document records
- **Committed in:** 0848984

---

**Total deviations:** 2 auto-fixed (1 bug, 1 missing critical), 0 deferred
**Impact on plan:** Both fixes essential for working intake flow. No scope creep.

## Issues Encountered

None - implementation proceeded smoothly after deviations were fixed.

## Phase 2 Complete

All 4 plans in Phase 2 (Client Intake Interface) are now complete:

1. **02-01:** Supabase integration and file storage setup
2. **02-02:** Firm landing page and file upload dropzone
3. **02-03:** Intake questionnaire and legal disclaimer
4. **02-04:** Case submission API and storage (this plan)

**Phase 2 delivers:** Clients can visit a firm's intake page, fill out the questionnaire, upload documents, accept the legal disclaimer, and submit - creating Case and Document records with files stored in Supabase.

## Next Phase Readiness

- Case and Document records ready for AI analysis (Phase 3)
- Storage URLs available for document text extraction
- briefJson field ready for AI-generated case summaries
- fitScore field ready for case fit scoring

---
*Phase: 02-client-intake*
*Completed: 2026-01-13*
