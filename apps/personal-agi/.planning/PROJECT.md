# Personal AGI

## What This Is

A 24/7 autonomous assistant powered by Claude Agents SDK that can complete tasks, manage daily workflows, and communicate via Telegram. It integrates with business tools (GHL, Gmail, Google Calendar, Google Drive), content platforms (YouTube, TikTok, Instagram), and community (Skool) to act as a personal AGI that handles tasks without constant human intervention.

## Core Value

Autonomous task completion with proactive daily communication — the system does work FOR you and texts you when done, rather than waiting to be manually prompted.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Claude Agents SDK running 24/7 on local machine or server
- [ ] Telegram MCP for bidirectional text communication
- [ ] Google Drive MCP integration
- [ ] Google Calendar MCP integration
- [ ] Gmail MCP integration
- [ ] GoHighLevel MCP integration (contacts, pipelines, conversations)
- [ ] Skool community MCP integration
- [ ] YouTube account integration
- [ ] TikTok account integration
- [ ] Instagram account integration
- [ ] Daily morning briefing (calendar, tasks, news/feeds)
- [ ] To-do list file sync and autonomous task evaluation
- [ ] Task completion notifications via Telegram

### Out of Scope

- Voice/phone call integration — text-first for v1
- Multi-user support — this is personal, single-user
- Web UI dashboard — Telegram is the interface
- Mobile app — using Telegram as the mobile interface

## Context

Inspired by the "Personal AGI" concept where Claude Code + Agents SDK + MCPs create an always-on assistant that:
- Reads a to-do list and evaluates what it can complete autonomously
- Sends text notifications when tasks are done
- Provides daily briefings (calendar, priorities, social feeds)
- Integrates with all business and content tools

The owner (Charles) runs an AI automation agency and needs this for:
- Business operations (GHL CRM, Gmail, Calendar)
- Content creation workflow (YouTube, TikTok, Instagram)
- Community management (Skool)
- File/document access (Google Drive)

## Constraints

- **Runtime**: Must run 24/7 — either always-on local machine or cloud server
- **Communication**: Telegram as primary interface (mobile-friendly, instant)
- **API Access**: Requires API keys/tokens for all integrated platforms
- **Cost**: Anthropic API usage costs for Claude — design for efficiency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Telegram over SMS/WhatsApp | Free, rich features, bot API well-documented | — Pending |
| Claude Agents SDK over raw API | Built-in tool handling, conversation management | — Pending |
| Local machine vs cloud hosting | TBD based on reliability needs | — Pending |

---
*Last updated: 2025-01-12 after initialization*
