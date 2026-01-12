# Roadmap: Personal AGI

## Overview

Build a 24/7 autonomous assistant powered by Claude Agents SDK that communicates via Telegram, integrates with business tools (GHL, Google suite), content platforms (YouTube, TikTok, Instagram), and community (Skool). The system evaluates tasks, completes them autonomously, and provides daily briefings.

## Domain Expertise

None (general agentic system)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation** - Agents SDK setup, project structure, 24/7 runtime
- [x] **Phase 2: Communication** - Telegram for bidirectional chat
- [ ] **Phase 3: Google Suite** - Drive, Calendar, Gmail MCP integrations
- [ ] **Phase 4: Business Tools** - GoHighLevel MCP integration
- [ ] **Phase 5: Community & Content** - Skool, YouTube, TikTok, Instagram integrations
- [ ] **Phase 6: Daily Assistant** - Morning briefing, to-do sync, autonomous task execution

## Phase Details

### Phase 1: Foundation
**Goal**: Get Claude Agents SDK running with basic tool usage, able to run 24/7
**Depends on**: Nothing (first phase)
**Research**: Likely (Agents SDK patterns, runtime architecture)
**Research topics**: Claude Agents SDK setup, Python async patterns, process management for 24/7 operation
**Plans**: TBD

Plans:
- [x] 01-01: Project setup and Agents SDK installation
- [x] 01-02: Basic agent loop with tool registration
- [x] 01-03: 24/7 runtime configuration

### Phase 2: Communication
**Goal**: Bidirectional Telegram communication - send commands, receive responses
**Depends on**: Phase 1
**Research**: Likely (Telegram Bot API, MCP integration)
**Research topics**: Telegram Bot setup, python-telegram-bot library, MCP server patterns
**Plans**: TBD

Plans:
- [x] 02-01: Dependencies and bot configuration
- [x] 02-02: TelegramBot implementation
- [x] 02-03: Human verification

### Phase 3: Google Suite
**Goal**: Connect Google Drive, Calendar, and Gmail for document access, scheduling, and email
**Depends on**: Phase 2
**Research**: Likely (Google OAuth, multiple API integrations)
**Research topics**: Google OAuth2 flow, Drive API, Calendar API, Gmail API, existing MCP servers
**Plans**: TBD

Plans:
- [ ] 03-01: Google OAuth setup and credential management
- [ ] 03-02: Google Drive MCP integration
- [ ] 03-03: Google Calendar MCP integration
- [ ] 03-04: Gmail MCP integration

### Phase 4: Business Tools
**Goal**: GoHighLevel integration for CRM, contacts, pipelines, conversations
**Depends on**: Phase 3
**Research**: Likely (GHL API patterns)
**Research topics**: GHL API authentication, available MCP server, contact/pipeline operations
**Plans**: TBD

Plans:
- [ ] 04-01: GHL authentication and MCP setup
- [ ] 04-02: Contact and pipeline operations
- [ ] 04-03: Conversation management

### Phase 5: Community & Content
**Goal**: Connect Skool community and social media platforms (YouTube, TikTok, Instagram)
**Depends on**: Phase 4
**Research**: Likely (Multiple platform APIs)
**Research topics**: Skool API/scraping, YouTube Data API, TikTok API, Instagram Graph API
**Plans**: TBD

Plans:
- [ ] 05-01: Skool community integration
- [ ] 05-02: YouTube integration
- [ ] 05-03: TikTok integration
- [ ] 05-04: Instagram integration

### Phase 6: Daily Assistant
**Goal**: Autonomous daily workflow - morning briefings, to-do evaluation, task completion, notifications
**Depends on**: Phase 5
**Research**: Unlikely (internal orchestration using established patterns)
**Plans**: TBD

Plans:
- [ ] 06-01: To-do list file sync and parsing
- [ ] 06-02: Task evaluation and autonomous completion logic
- [ ] 06-03: Morning briefing generation
- [ ] 06-04: Notification and completion reporting

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2025-01-12 |
| 2. Communication | 3/3 | Complete | 2025-01-12 |
| 3. Google Suite | 0/4 | Not started | - |
| 4. Business Tools | 0/3 | Not started | - |
| 5. Community & Content | 0/4 | Not started | - |
| 6. Daily Assistant | 0/4 | Not started | - |
