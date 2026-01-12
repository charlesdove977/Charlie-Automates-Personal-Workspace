# Legal Intake

## What This Is

An internal AI case intake + triage system for law firms. Potential clients upload documents and answer intake questions, AI produces a structured case brief, and attorneys quickly decide to accept or reject cases before any consultation happens. Time = money for lawyers, and this gives them time back.

## Core Value

Attorneys can make informed accept/reject decisions on cases in under 2 minutes without reading raw documents or taking free consults that go nowhere.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Client Intake (Minimal)**
- [ ] Document upload interface
- [ ] Intake questionnaire (family law focused)
- [ ] Legal disclaimer display
- [ ] Standalone landing page per firm
- [ ] Embeddable widget for firm websites

**Attorney Dashboard (The Product)**
- [ ] Secure login and authentication
- [ ] Inbox of pending cases
- [ ] One-page AI case brief per submission:
  - Case type
  - Jurisdiction
  - Parties involved
  - Timeline of events
  - Key facts extracted
  - Red flags identified
  - Fit score (firm-defined criteria)
- [ ] Accept button → book consult flow
- [ ] Reject button → auto-generated response

**AI Analysis Engine**
- [ ] Document parsing and extraction
- [ ] Structured case brief generation
- [ ] Fact extraction (not opinion/interpretation)
- [ ] Uncertainty flagging
- [ ] Fit score calculation based on firm criteria

**Firm Configuration**
- [ ] Firm-specific fit criteria definition
- [ ] Custom intake questions per firm
- [ ] Branding customization (logo, colors)

### Out of Scope

- Client chat/messaging — no back-and-forth communication
- Multi-firm marketplace — each firm is siloed, no lead distribution
- Payment processing — no billing, retainers, or payment collection
- Legal advice features — AI summarizes, never interprets law or recommends action
- Consumer-first SaaS — this is B2B for law firms

## Context

**Business Partner**: Haider (co-building/co-owning this product)

**Initial Market Strategy**:
- One jurisdiction (TBD)
- One legal category: Family law (divorce, custody, child support)
- One zip-code blast radius
- Direct sales to law firms
- Subscription model
- Win small and local first, then expand

**The Core Pain**:
- Law firms waste hours reviewing documents
- Pay paralegals to read junk cases
- Take free consults that go nowhere
- Lack fast, structured summaries before engaging

**AI Philosophy**:
AI acts like a junior paralegal that never bills hours:
- Summarize, not advise
- Extract facts, not opinions
- Flag uncertainty clearly
- Never interpret law
- Never recommend action

**UX Philosophy**:
Lawyers must feel: "This won't get me sued."
- Boring, safe, professional UI
- No experimental UX
- Clear compliance disclaimers throughout

## Constraints

- **Compliance**: Must handle documents securely with appropriate legal industry standards
- **AI Safety**: AI must never give legal advice or interpret law — pure summarization only
- **Trust**: UI must feel safe and professional for risk-averse attorney users

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Family law first | Focused vertical for v1, clear document types | — Pending |
| Firm-defined fit criteria | Each firm knows what makes a good case for them | — Pending |
| Both standalone + embeddable | Maximum flexibility for firm adoption | — Pending |
| Claude for AI analysis | Strong reasoning, good at structured extraction | — Pending |

---
*Last updated: 2026-01-12 after initialization*
