# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Founder Context

**Owner**: Charles Dove
**Company**: C&C Strategic Consulting LLC
**Partner**: Chris Kahler
**Experience**: 12 years entrepreneurship

### Who Charles Is
- Entrepreneur focused on AI automation, ops, and revenue systems
- Background in real estate, sales, and systems thinking
- Strong bias toward practical execution over theory
- Builds in public via YouTube, Skool, and client work
- Prefers simple, durable systems over clever but fragile setups
- Values autonomy, ownership, and scalability

### Current Business Focus
- **AI Automation Agency**: Client work for immediate cashflow
- **Skool Community**: Building audience and recurring revenue
- **SaaS Products**: Long-term MRR plays
- **Content**: YouTube tutorials on n8n, AI image/video generation, systems consulting

### ICP (Ideal Customer Profile)
- Agency owners
- Business owners ($2-10M+ ARR)
- AI beginners

### 2026 Goals
- **Revenue Target**: $250k minimum for C&C Strategic Consulting
- **Profit Target**: $200k minimum
- **Implication**: Every system, workflow, and tool built should contribute to this goal

---

## Project Context

This project is part of a broader ecosystem:
- AI agents (text, voice, internal ops)
- Automation workflows (primarily n8n)
- Custom internal tools and lightweight apps
- Content and lead-generation systems
- CRM and business infrastructure

### Core Philosophy
- **Autonomy > Intelligence**: Systems should start, run, and finish without constant intervention
- **Reliability > Cleverness**: Boring solutions that work beat flashy ones that break
- **If a human has to babysit it, it's not leverage**

### North Star
Everything built here should:
- Reduce human involvement
- Increase leverage
- Be explainable in plain English
- Survive growth, scale, and future changes

---

## Workspace Structure

**Charlieautomates is a monorepo/workspace** — not a single project.

### Key Rules
- **New apps/projects go in `/apps/[project-name]/`** — always
- **Each app has its own `.planning/` folder** for GSD artifacts (PROJECT.md, ROADMAP.md, etc.)
- **`/gsd:new-project` auto-detects workspace roots** — it will prompt for app name and create the folder automatically
- **Shared resources** (agents, content) live at workspace root

### When Starting a New Project

Just run `/gsd:new-project` from anywhere in the workspace. If you're at the workspace root (has `apps/` folder), it will:
1. Detect the workspace pattern automatically
2. Ask you for the new app name
3. Create `apps/[name]/` and cd into it
4. Initialize `.planning/` inside the app folder

This keeps each project's planning artifacts isolated without manual folder creation.

### Directory Layout

```
/Charlieautomates                # WORKSPACE ROOT
│
├── .claude/                     # Claude Code configuration (workspace-wide)
│   ├── claude.md                # Project instructions (this file)
│   ├── settings.local.json      # Local Claude settings
│   └── commands/                # Custom slash commands (skills)
│       ├── analyze-video.md
│       ├── app-builder-pro.md
│       ├── content-strategy.md
│       ├── create-agent.md
│       ├── debug-agent.md
│       ├── integration-agent.md
│       ├── mcp-research.md
│       ├── rtc.md
│       ├── test-agent.md
│       └── thumbnail-packager.md
│
├── agents/                      # Agent frameworks & templates (shared)
│   ├── agent-framework-template.md
│   ├── agent-framework-guide.md
│   └── README.md
│
├── apps/                        # ALL NEW PROJECTS GO HERE
│   ├── clearlist/               # ClearList app
│   ├── legal-intake/            # Legal intake system (active)
│   │   └── .planning/           # GSD artifacts for this project
│   │       ├── PROJECT.md
│   │       ├── ROADMAP.md
│   │       ├── STATE.md
│   │       └── phases/          # Phase-specific plans
│   └── [future apps]/
│
├── content/                     # Content strategy & scripts (shared)
│   ├── claude-code-short-ideas.md
│   └── scripts/
│       ├── done/                # Completed scripts
│       │   ├── bodybuilding-business-lessons-short.md
│       │   ├── claude-code-command-center-ferrari.md
│       │   ├── gsd-plugin-short.md
│       │   ├── linkedin-post-command-center.md
│       │   ├── personal-agi-short.md
│       │   ├── ralph-context-management-short.md
│       │   └── ralph-whim-agent-reel.md
│       └── not-done/            # Scripts in progress
│           └── claude-code-browser-alias-short.md
│
├── shared/                      # Shared resources (synced repo)
│   ├── README.md
│   ├── charlie/                 # Charlie-specific resources
│   ├── courses/                 # Course content
│   │   ├── claude-code/
│   │   │   └── COURSE-OUTLINE.md
│   │   └── n8n/
│   ├── leads/                   # Lead tracking files
│   └── proposals/               # Client proposals
│
├── linkedin/                    # LinkedIn automation & outreach
│   └── messageconnection.md     # Connection messaging strategy & log
│
├── .gitignore                   # Git ignore rules
├── docker-compose.yml           # Local services
├── run-n8n-mcp.sh               # Runs n8n MCP via Docker image
└── .env                         # Secrets (gitignored)
```

---

## Lead Management & Documentation

### Working with Lead Files

Lead files live in `shared/leads/` and follow a structured markdown format.

#### Critical Rules

**ALWAYS APPEND to Notes sections** - Never overwrite existing notes or content in lead files. Add new information chronologically with timestamps.

**Proposal Files** - Store in `shared/leads/proposals/[client-name]-[project]-proposal.md`

**Update Lead Files** - When creating proposals or having new interactions, append updates to the lead file's notes/action items section with:
- Date stamp
- Summary of interaction
- Link to proposal (if applicable)
- Next steps

#### Example Update Pattern

```markdown
## Notes

### January 13, 2026 - Proposal Sent
- Created comprehensive proposal for full platform build
- Two pricing options presented:
  - Option 1: $5k upfront + 5% net revenue (partnership model)
  - Option 2: $5k upfront + $500/mo support (build + support model)
- Proposal location: `shared/leads/proposals/thomas-corr-occupancylift-proposal.md`
- Next: Awaiting Thomas's response, schedule technical walkthrough

### [Previous notes remain unchanged below]
```

**Never delete or overwrite existing lead context** - it's historical record that informs future decisions.

---

## LinkedIn Outreach Automation

### Overview
Automated warm outreach via Claude-in-Chrome browser automation. Strategy: DM warm connection → Add value through conversation → Convert through content (no direct pitching).

### Key Files
- `linkedin/messageconnection.md` — Strategy doc, prospect filtering criteria, opener templates, and outreach log

### Workflow
1. Open LinkedIn connections page in Chrome
2. Use `/message-connection` shortcut (or manual browser automation)
3. Filter prospects using criteria in messageconnection.md
4. Send personalized opener (2-3 sentences, reference their business, ask open question)
5. Update log every 5 messages (batch system)

### Chrome Automation Learnings
- **Tab management**: Always get fresh tab context via `tabs_context_mcp` before starting
- **Tab detachment**: If a tab detaches during navigation, get fresh context and switch tabs
- **Compose windows**: Click the specific Message button for each contact; if wrong contact loads, close and retry
- **Navigation**: Use `navigate` tool with direct URLs rather than back/forward when possible
- **Rate limiting**: Pace messages naturally to avoid LinkedIn spam detection

### Prospect Filtering (Quick Reference)
- **Reach out**: Agency/company owners, consultants, founders, AI/automation peers
- **Skip**: Under 25, employees without influence, teachers, job seekers, vague "visionary" types

---

## Build Standards

- Clean, readable code
- Explicit naming
- Minimal dependencies
- Clear separation of concerns
- Assume this will be used by real users and real clients
- Avoid overengineering
- Prefer production-ready over prototype-quality

---

## Get Shit Done (GSD) - Spec-Driven Development

For non-trivial builds, use the GSD plugin for reliable, spec-driven development.

### Installation
GSD is installed globally via:
```bash
npx get-shit-done-cc --global
```
Location: `~/.claude/commands/gsd/` and `~/.claude/get-shit-done/`

### Workspace-Aware GSD
`/gsd:new-project` automatically detects when you're at a workspace root and prompts for the app name. No need to manually create folders or cd first — just run the command and it handles the rest.

### Core Workflow
1. `/gsd:new-project` — Extract requirements through guided questioning → PROJECT.md
2. `/gsd:create-roadmap` — Break into phases → ROADMAP.md + STATE.md
3. `/gsd:plan-phase N` — Generate atomic task plans with verification
4. `/gsd:execute-plan` — Fresh subagent context for each phase (no degradation)

### For Existing Codebases
- `/gsd:map-codebase` — Analyze and document stack, architecture, conventions

### Key Commands
| Command | Purpose |
|---------|---------|
| `/gsd:help` | Show all commands and usage |
| `/gsd:progress` | Where am I? What's next? |
| `/gsd:add-phase` | Append new work |
| `/gsd:insert-phase N` | Slip urgent work between phases |
| `/gsd:discuss-phase N` | Gather context before planning |
| `/gsd:research-phase N` | Deep research for niche domains |
| `/gsd:pause-work` / `/gsd:resume-work` | Session handoff |
| `/gsd:complete-milestone` | Ship and prep next version |
| `/gsd:consider-issues` | Review deferred issues |

### Why It Works
- **Context engineering**: Curated docs (PROJECT, ROADMAP, STATE, PLAN) keep Claude focused
- **Fresh subagents**: Each phase gets 200k clean tokens — no quality degradation
- **XML task format**: Precise instructions with built-in verification
- **Atomic commits**: Each task = one commit = clean git history

### When to Use GSD
- Building new features or apps from scratch
- Multi-phase projects requiring persistent state
- Brownfield enhancements to existing codebases
- Anything complex enough to benefit from structured planning

---

## Operating Principles

### Context Management
- Context is finite with diminishing returns - curate smallest high-signal token set
- Long content goes at TOP, query/instructions at bottom (up to 30% quality gain)
- Use XML tags for structure; clear context between unrelated tasks
- For long-horizon: compaction, structured notes, sub-agents

### Prompt Design
- Be explicit - treat Claude like brilliant employee with amnesia
- Sequential steps > vague instructions; examples > exhaustive rules
- Use extended thinking triggers: "think" → "think hard" → "ultrathink"
- Golden rule: if a colleague would be confused, Claude will be too

### Architecture Patterns
- Start with simplest solution; add complexity only when it demonstrably improves outcomes
- Workflow patterns: chaining (sequential), routing (classify→specialize), parallelization, orchestrator-workers, evaluator-optimizer
- Agents = LLMs using tools in a loop; use for open-ended, unpredictable tasks
- Multi-agent for scale: parallel workers, separation of concerns

### Tool Design (ACI)
- Tools should be self-contained, minimal overlap, clear purpose
- Give model room to think before committing; avoid formatting overhead
- Poka-yoke (error-proof) your tools; invest as much in ACI as HCI
- If human can't decide which tool, neither can model

### Human-AI Collaboration (4Ds)
- Delegation: what should human vs AI vs both do?
- Description: communicate as conversation, not commands
- Discernment: critically evaluate outputs and reasoning
- Diligence: own the outputs; transparency in AI use

### Evaluation & Iteration
- Define success criteria BEFORE prompt engineering
- Explore → Plan → Code → Commit (or Test-Driven flow)
- Evaluation methods: human-graded → code-graded → model-graded
- Course correct early; iterate based on failure modes
