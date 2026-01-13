# Roadmap: Legal Intake

## Overview

Build an AI-powered case intake and triage system for law firms. The journey goes from foundational setup, through client-facing intake forms, to AI document analysis, then attorney-facing dashboards with accept/reject flows, and finally firm configuration and embeddable widgets. Each phase delivers a working piece that builds toward the complete system.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Project setup, tech stack, database schema
- [x] **Phase 2: Client Intake Interface** - Document upload, questionnaire, disclaimers
- [ ] **Phase 3: AI Analysis Engine** - Document parsing, case brief generation
- [ ] **Phase 4: Attorney Dashboard** - Auth, inbox, case brief display, accept/reject
- [ ] **Phase 5: Firm Configuration** - Fit criteria, custom questions, branding
- [ ] **Phase 6: Embeddable Widget** - Widget version for firm websites

## Phase Details

### Phase 1: Foundation
**Goal**: Establish project structure, tech stack, database schema, and deployment pipeline
**Depends on**: Nothing (first phase)
**Research**: Unlikely (standard project setup patterns)
**Plans**: 3 (01-01 Project Scaffolding, 01-02 Database Foundation, 01-03 API & Deployment)

Key deliverables:
- Project scaffolding (Next.js or similar)
- Database setup (schema for firms, cases, documents)
- Basic API structure
- Development environment
- Deployment config

### Phase 2: Client Intake Interface
**Goal**: Build the client-facing intake flow where potential clients upload documents and answer questions
**Depends on**: Phase 1
**Research**: Likely (document upload/storage patterns)
**Research topics**: File upload handling, secure document storage, form validation, legal disclaimer UI patterns
**Plans**: 4 (02-01 Supabase Storage, 02-02 Intake Form UI, 02-03 Questionnaire & Disclaimer, 02-04 Case Submission API)

Key deliverables:
- Document upload interface (multi-file)
- Intake questionnaire (family law focused)
- Legal disclaimer display and acceptance
- Standalone landing page per firm
- Basic submission flow

### Phase 3: AI Analysis Engine
**Goal**: Build the AI backend that parses documents and generates structured case briefs
**Depends on**: Phase 2
**Research**: Likely (Claude API, document parsing)
**Research topics**: Claude API structured output, PDF/document text extraction, fact extraction prompts, uncertainty flagging
**Plans**: TBD

Key deliverables:
- Document parsing and text extraction
- Claude integration for analysis
- Structured case brief generation:
  - Case type identification
  - Jurisdiction detection
  - Parties involved
  - Timeline of events
  - Key facts extracted
  - Red flags identified
- Uncertainty flagging system

### Phase 4: Attorney Dashboard
**Goal**: Build the attorney-facing dashboard with auth, inbox, and case review/decision flow
**Depends on**: Phase 3
**Research**: Likely (authentication decision)
**Research topics**: Auth provider options (Clerk/Auth0/NextAuth), session management, role-based access
**Plans**: TBD

Key deliverables:
- Secure authentication system
- Inbox view of pending cases
- One-page AI case brief display
- Accept button with book consult flow
- Reject button with auto-generated response
- Fit score display

### Phase 5: Firm Configuration
**Goal**: Enable firm-specific customization of fit criteria, intake questions, and branding
**Depends on**: Phase 4
**Research**: Unlikely (internal CRUD patterns)
**Plans**: TBD

Key deliverables:
- Fit criteria definition interface
- Custom intake questions per firm
- Branding customization (logo, colors)
- Firm settings management

### Phase 6: Embeddable Widget
**Goal**: Create an embeddable version of the intake form for firm websites
**Depends on**: Phase 2, Phase 5
**Research**: Likely (embed security patterns)
**Research topics**: iframe security, cross-origin policies, embed script best practices, responsive widget design
**Plans**: TBD

Key deliverables:
- Embeddable widget script
- Iframe-based intake form
- Cross-origin security handling
- Widget customization (inherits firm branding)
- Installation instructions for firms

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-01-12 |
| 2. Client Intake Interface | 4/4 | Complete | 2026-01-13 |
| 3. AI Analysis Engine | 0/TBD | Not started | - |
| 4. Attorney Dashboard | 0/TBD | Not started | - |
| 5. Firm Configuration | 0/TBD | Not started | - |
| 6. Embeddable Widget | 0/TBD | Not started | - |
