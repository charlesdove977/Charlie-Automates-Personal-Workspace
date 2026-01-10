# Agent Framework Documentation

This directory contains templates and guides for creating agents. Executable agents live in `.claude/commands/`.

## Directory Structure

```
Charlieautomates/
├── CLAUDE.md                       # Operating principles (loaded automatically)
├── .claude/
│   └── commands/                   # Executable slash commands
│       ├── rtc.md                  → /rtc
│       ├── thumbnail-packager.md   → /thumbnail-packager
│       ├── app-builder-pro.md      → /app-builder-pro
│       ├── content-strategy.md     → /content-strategy
│       └── create-agent.md         → /create-agent
│
└── agents/                         # Documentation only (no duplicates)
    ├── README.md                   # This file
    ├── agent-framework-template.md # Blank template
    └── agent-framework-guide.md    # How to use the framework
```

## Creating New Agents

1. Use `/create-agent {name}` - it will guide you through the process
2. Or manually: copy `agent-framework-template.md`, fill it in, save to `.claude/commands/`

## Framework Structure

```
┌─────────────────────────────────────┐
│           FRONTMATTER               │  ← description + allowed-tools
├─────────────────────────────────────┤
│          CONSTITUTION               │  ← principles + anti-principles
├─────────────────────────────────────┤
│          CONSTRAINTS                │  ← role + optimize for + must/must not
├─────────────────────────────────────┤
│    PROCESSING INSTRUCTIONS          │  ← step-by-step workflow
├─────────────────────────────────────┤
│        OUTPUT FORMAT                │  ← deliverable template
├─────────────────────────────────────┤
│          EXECUTION                  │  ← input handling + $ARGUMENTS
└─────────────────────────────────────┘
```

See `agent-framework-guide.md` for detailed instructions.
