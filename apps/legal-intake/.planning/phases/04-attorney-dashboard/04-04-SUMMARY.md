# Summary: Accept/Reject Actions

**Plan**: 04-04-PLAN.md
**Phase**: 04-attorney-dashboard
**Completed**: 2026-01-13
**Duration**: ~12 min

## What Was Built

### Reusable UI Components
- `src/components/ui/ConfirmDialog.tsx`
  - Modal overlay with title, message, and action buttons
  - Customizable confirm/cancel text and colors (green/red)
  - Closes on Escape key and overlay click
  - Prevents body scroll while open

### Action Buttons Component
- `src/components/brief/ActionButtons.tsx`
  - Accept Case button (green) with confirmation dialog
  - Reject Case button (red) with confirmation dialog
  - Only shows for PENDING cases with COMPLETE processingStatus
  - Shows status badges for ACCEPTED/REJECTED cases with review date
  - Loading states during API calls
  - Error handling with inline error display

### Accept API Endpoint
- `src/app/api/dashboard/cases/[caseId]/accept/route.ts`
  - POST endpoint requiring authentication
  - Multi-tenant validation (firmId check)
  - Status validation (must be PENDING)
  - Updates status to ACCEPTED, sets reviewedAt
  - Returns updated case data

### Reject API Endpoint
- `src/app/api/dashboard/cases/[caseId]/reject/route.ts`
  - POST endpoint requiring authentication
  - Multi-tenant validation (firmId check)
  - Status validation (must be PENDING)
  - Generates rejection response via template
  - Updates status to REJECTED, sets reviewedAt
  - Returns updated case data + generated response

### Response Generation
- `src/lib/responses.ts`
  - `generateRejectionResponse()` function
  - Professional, empathetic template-based response
  - Uses client name, firm name, and case type
  - No AI call needed for MVP (template approach)

## Files Changed

### Created
- `src/components/ui/ConfirmDialog.tsx`
- `src/components/brief/ActionButtons.tsx`
- `src/app/api/dashboard/cases/[caseId]/accept/route.ts`
- `src/app/api/dashboard/cases/[caseId]/reject/route.ts`
- `src/lib/responses.ts`

### Modified
- `src/app/dashboard/(main)/cases/[caseId]/page.tsx` (added ActionButtons, reviewedAt)
- `src/app/api/dashboard/cases/[caseId]/route.ts` (added reviewedAt to response)
- `src/components/brief/index.ts` (export ActionButtons)

## Verification

- [x] Accept button shows on pending, complete cases
- [x] Reject button shows on pending, complete cases
- [x] Confirmation dialogs display correctly
- [x] Cancel closes dialog without action
- [x] Accept updates status to ACCEPTED
- [x] Reject updates status to REJECTED
- [x] Status badges show for processed cases
- [x] Multi-tenant isolation enforced
- [x] Can't accept/reject non-pending cases
- [x] `pnpm build` passes

## Out of Scope (Deferred)

- **Email sending**: Response is generated but not sent. Email integration planned for Phase 5+.
- **Calendar booking**: Accept action marks case but doesn't trigger scheduling. Future enhancement.

## Phase 4 Complete

With 04-04 complete, the entire Attorney Dashboard phase is finished:

| Plan | Feature | Status |
|------|---------|--------|
| 04-01 | Authentication | ✅ Complete |
| 04-02 | Dashboard Shell & Case Inbox | ✅ Complete |
| 04-03 | Case Brief Viewer | ✅ Complete |
| 04-04 | Accept/Reject Actions | ✅ Complete |

**Ready for Phase 5**: Notifications & Email Integration
