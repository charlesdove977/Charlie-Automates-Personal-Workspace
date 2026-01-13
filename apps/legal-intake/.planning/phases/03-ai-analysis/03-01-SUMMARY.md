---
phase: 03-ai-analysis
plan: 01
subsystem: api
tags: [pdf, docx, extraction, unpdf, mammoth, supabase-storage]

# Dependency graph
requires:
  - phase: 02-04
    provides: Document records with storageUrl in Supabase Storage
provides:
  - Document text extraction service
  - POST /api/cases/[caseId]/extract endpoint
  - Document.extractedText population
affects: [03-02-claude-analysis, 03-03-pipeline]

# Tech tracking
tech-stack:
  added: [unpdf, mammoth]
  patterns: [signed URL for private storage, dynamic import for heavy libs]

key-files:
  created:
    - src/lib/extraction.ts
    - src/app/api/cases/[caseId]/extract/route.ts
  modified:
    - package.json

key-decisions:
  - "Use unpdf instead of pdf-parse (pdf-parse has unfixable test file loading issues)"
  - "Use signed URLs for private Supabase storage bucket (documents stay private)"
  - "Dynamic import for unpdf to avoid build-time issues"

patterns-established:
  - "Signed URL pattern for private storage access"
  - "Dynamic import for heavy PDF libraries"

issues-created: []

# Metrics
duration: 22 min
completed: 2026-01-13
---

# Phase 3 Plan 1: Document Text Extraction Summary

**PDF and DOCX text extraction service using unpdf and mammoth with signed URLs for private Supabase storage**

## Performance

- **Duration:** 22 min
- **Started:** 2026-01-13T19:55:51Z
- **Completed:** 2026-01-13T20:17:50Z
- **Tasks:** 4 (3 auto + 1 checkpoint)
- **Files modified:** 3

## Accomplishments

- Document text extraction service with PDF and DOCX support
- API endpoint to trigger extraction for case documents
- Signed URL generation for private storage bucket access
- Document.extractedText populated in database

## Task Commits

1. **Task 1: Install dependencies** - `f02c323` (chore)
2. **Task 2: Create extraction service** - `1a1486a` (feat)
3. **Task 3: Create extraction API endpoint** - `2bc52e0` (feat)

## Files Created/Modified

- `src/lib/extraction.ts` - Text extraction service with PDF (unpdf) and DOCX (mammoth) support
- `src/app/api/cases/[caseId]/extract/route.ts` - POST endpoint to trigger extraction for case documents
- `package.json` - Added unpdf and mammoth dependencies

## Decisions Made

- Used unpdf instead of pdf-parse (pdf-parse v1 and v2 both have unfixable test file loading issues with Next.js)
- Use signed URLs for private Supabase storage (documents stay private, server generates temporary access URLs)
- Dynamic import for unpdf to avoid build-time issues

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Storage bucket requires authentication**
- **Found during:** Checkpoint verification
- **Issue:** Supabase storage bucket `case-documents` has no public read policy, HTTP 400 on fetch
- **Fix:** Generate signed URLs server-side using service role key instead of using public URLs directly
- **Files modified:** src/lib/extraction.ts
- **Verification:** Signed URL fetch succeeds
- **Committed in:** 930d745

**2. [Rule 3 - Blocking] pdf-parse v2 worker issues with Next.js**
- **Found during:** Checkpoint verification
- **Issue:** pdf-parse v2 requires worker files that don't exist in Next.js build
- **Fix:** Attempted downgrade to v1, but v1 has test file loading issue
- **Files modified:** package.json, src/lib/extraction.ts
- **Committed in:** 4c7b871

**3. [Rule 3 - Blocking] pdf-parse v1 test file loading issue**
- **Found during:** Checkpoint verification
- **Issue:** Even with dynamic import, pdf-parse v1 tries to load `./test/data/05-versions-space.pdf` at runtime
- **Fix:** Switched to unpdf library which has no such issues
- **Files modified:** package.json, src/lib/extraction.ts
- **Verification:** PDF extraction works
- **Committed in:** 0361a53

**4. [Rule 1 - Bug] unpdf requires Uint8Array, not Buffer**
- **Found during:** Checkpoint verification
- **Issue:** unpdf throws error when passed Buffer
- **Fix:** Convert Buffer to Uint8Array before passing to extractText
- **Files modified:** src/lib/extraction.ts
- **Verification:** PDF extraction succeeds
- **Committed in:** 46e33e5

---

**Total deviations:** 4 auto-fixed (4 blocking), 0 deferred
**Impact on plan:** All fixes required for working extraction. Switched from pdf-parse to unpdf due to fundamental library issues. No scope creep.

## Issues Encountered

None beyond the blocking issues documented above.

## Next Phase Readiness

- Document text extraction working for PDF and DOCX
- Ready for Claude AI analysis in 03-02-PLAN.md
- Image OCR not implemented (returns appropriate error message)

---
*Phase: 03-ai-analysis*
*Completed: 2026-01-13*
