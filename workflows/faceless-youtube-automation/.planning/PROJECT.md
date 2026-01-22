# Project: Faceless YouTube Automation

## Core Value

Fully automated content pipeline that generates and publishes faceless YouTube videos without manual intervention.

## Overview

End-to-end automation system for faceless YouTube content creation. AI generates trending topics, writes scripts, synthesizes voiceover, sources/generates visuals, assembles videos, creates thumbnails, optimizes SEO, and publishes to YouTube — all without human involvement.

## Requirements

### Functional
- AI-powered topic generation (trending/niche content discovery)
- Automated script writing from topics
- Text-to-speech voiceover generation
- Stock footage and/or AI-generated visual sourcing
- Automated video assembly (audio + visuals)
- Thumbnail generation
- SEO optimization (titles, descriptions, tags)
- YouTube upload via API

### Non-Functional
- Runs autonomously on schedule
- Produces consistent quality output
- Handles errors gracefully without breaking pipeline
- Scalable to multiple channels/niches

## Video Style

- **Format**: AI voiceover + stock/AI visuals
- **Platform**: YouTube (long-form)
- **Content source**: AI-generated topics

## Tech Stack

- **Orchestration**: n8n workflows
- **AI**: Claude/OpenAI for scripts and topics
- **TTS**: ElevenLabs or similar
- **Visuals**: Pexels/Pixabay API, AI image generation
- **Video**: FFmpeg or cloud video API
- **Upload**: YouTube Data API v3

## Constraints

- Must respect YouTube API quotas
- TTS costs scale with content volume
- Stock footage must be properly licensed
- Videos should pass YouTube's automated checks

## Success Criteria

- [ ] Pipeline runs end-to-end without manual intervention
- [ ] Produces watchable, coherent videos
- [ ] Successfully uploads to YouTube
- [ ] Can be scheduled for regular content output

## Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| n8n for orchestration | Already in stack, visual workflow builder | 2026-01-22 |
| YouTube only (not multi-platform) | Focus on one platform first | 2026-01-22 |
| AI-generated topics | Full automation, no manual input needed | 2026-01-22 |

## Out of Scope (v1)

- Multi-platform publishing (TikTok, Instagram)
- YouTube Shorts
- Manual topic input interface
- Analytics dashboard
- A/B testing thumbnails
