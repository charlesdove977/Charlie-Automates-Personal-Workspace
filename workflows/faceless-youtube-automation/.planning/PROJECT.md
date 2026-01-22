# Faceless YouTube Automation

## What This Is

A multi-workflow n8n system that produces faceless YouTube videos on autopilot. Scrapes top AI/tech channels, analyzes trends, generates video ideas + scripts + assets, and tracks everything through an Airtable production pipeline. Modular architecture using Execute Workflow nodes for orchestration.

## Core Value

**Fully autonomous content pipeline**: From channel scraping to publish-ready scripts + assets with zero daily intervention — the system runs, generates, and queues content automatically.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Workflow Architecture (8 workflows)**
- [ ] WF-00 Orchestrator — Master scheduler, runs daily, coordinates all child workflows
- [ ] WF-10 Channel Scraper — Per-channel video scraping via Apify, upserts to Airtable
- [ ] WF-20 Trend & Pattern Analyzer — LLM analysis of videos → insights with virality scoring
- [ ] WF-30 Idea Generator — Generate video ideas from insights, dedupe + priority ranking
- [ ] WF-40 Script Factory — Idea → full script + scene breakdown + asset prompts
- [ ] WF-50 Asset Builder — B-roll search, image prompts, TTS placeholders
- [ ] WF-60 Packaging — SEO titles, descriptions, tags, upload prep
- [ ] WF-90 QA + Notifications — Daily report via Gmail, error flagging, Runs_Log

**Airtable Schema (8 tables)**
- [ ] Channels — channel_id, name, url, niche, language, active, notes, last_scraped_at
- [ ] Videos_Raw — external_id, channel_id, title, url, published_at, views, likes, comments, duration, description, is_short, transcript, scraped_at
- [ ] Video_Insights — external_id, summary, key_points, topics, angle, why_it_worked, hook_patterns, cta_patterns, virality_score, audience, content_type, created_at
- [ ] Ideas — idea_id, niche, idea_title, core_promise, hook_options, outline, source_videos, status, priority, created_at
- [ ] Scripts — script_id, idea_id, title_final, script_voiceover, scene_breakdown, broll_keywords, image_prompts, thumbnail_text_options, created_at, status
- [ ] Assets — asset_id, script_id, asset_type, source_url, prompt_or_query, file_url, status
- [ ] Publishing — publish_id, script_id, title, description, tags, thumbnail_url, scheduled_at, published_url, status
- [ ] Runs_Log — run_id, workflow_name, status, started_at, ended_at, notes, error

**Infrastructure**
- [ ] Apify integration for YouTube scraping (channel videos, stats, transcripts)
- [ ] LLM integration (OpenRouter + OpenAI options) for analysis + generation
- [ ] Gmail integration for daily QA reports
- [ ] Execute Workflow nodes for parent → child orchestration
- [ ] Placeholder nodes for video rendering (Creatomate/Shotstack future)
- [ ] Placeholder nodes for YouTube API upload (future)

**Operational Requirements**
- [ ] All workflows log to Runs_Log (start/end/status/errors)
- [ ] Upserts for all Airtable operations (no duplicates)
- [ ] Rate limiting + retries on external API calls
- [ ] Strict JSON output from all LLM calls with safe parsing
- [ ] Fuzzy title matching for idea deduplication (30-day window)

### Out of Scope

- Actual video rendering/assembly — placeholder nodes only, integrate Creatomate/Shotstack later
- YouTube API upload automation — placeholder nodes only, integrate later
- Multi-channel publishing (TikTok, Shorts) — YouTube long-form only for v1
- Paid promotion/ads integration — organic content only
- Real-time monitoring dashboard — Airtable views serve this purpose

## Context

**Niche**: AI/Tech tutorials (AI tools, automation, coding)

**Target Channels**: Research and seed 5-10 top faceless AI/tech channels as initial scrape targets

**Existing Setup**:
- Airtable base exists — will need field mapping to schema
- n8n instance available
- Credentials needed: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, APIFY_API_TOKEN, OPENROUTER_API_KEY, OPENAI_API_KEY, Gmail OAuth

**Content Output Specs**:
- Script length: 900-1500 words (adjustable)
- Title options: 10 generated, 1 final selected
- Hook options: Multiple per idea
- Scene breakdown: time/scene/visual/voice format
- B-roll keywords: 20-50 per script
- Image prompts: 10-20 per script
- Thumbnail text options: 5-10 per script

## Constraints

- **Modularity**: Each workflow must be independently callable with JSON inputs via Execute Workflow
- **Airtable as truth**: All state lives in Airtable, workflows are stateless
- **LLM flexibility**: Support both OpenRouter and OpenAI as provider options
- **Credential placeholders**: No hardcoded keys, use n8n credential references

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Multi-workflow architecture | Modularity, reusability, independent testing | — Pending |
| Airtable over Supabase/Postgres | User has existing base, visual pipeline management | — Pending |
| Apify for scraping | Reliable YouTube scraping, handles anti-bot | — Pending |
| Placeholder nodes for video/upload | Build structure first, integrate heavy services later | — Pending |
| Gmail for notifications | User preference, simple OAuth setup | — Pending |
| Both OpenRouter + OpenAI | Flexibility for cost/quality tradeoffs | — Pending |

---
*Last updated: 2026-01-22 after initialization*
