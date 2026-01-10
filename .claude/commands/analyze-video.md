---
description: Analyze videos for hooks, psychology triggers, and winning elements using Gemini
allowed-tools: Bash
---

# Video Analysis Tool

Analyze videos using the content strategy framework to identify hooks, psychology triggers, what made it win, and actionable takeaways.

## Webhook

- **Endpoint**: `https://ccstrategic.app.n8n.cloud/webhook/abacf7ad-c5f2-472b-adff-1094fabfb9cd`
- **Method**: GET
- **Params**: `videoUrl` (required), `prompt` (optional)

## Execution

**User Input**: $ARGUMENTS

Parse the input to extract:
1. **videoUrl** (required): The video URL to analyze (YouTube, TikTok, etc.)
2. **prompt** (optional): Any text after the URL becomes the focus/prompt

### Parsing Rules

- First URL found = `videoUrl`
- Everything after the URL = `prompt` (trim leading dashes, colons, spaces)
- If no prompt provided, leave it empty for full default analysis

### Example Inputs

| Input | videoUrl | prompt |
|-------|----------|--------|
| `https://youtube.com/watch?v=abc` | `https://youtube.com/watch?v=abc` | (empty) |
| `https://youtube.com/watch?v=abc focus on the hook` | `https://youtube.com/watch?v=abc` | `focus on the hook` |
| `https://youtube.com/watch?v=abc - what made this viral?` | `https://youtube.com/watch?v=abc` | `what made this viral?` |

### Call the Webhook

```bash
curl -s -G "https://ccstrategic.app.n8n.cloud/webhook/abacf7ad-c5f2-472b-adff-1094fabfb9cd" \
  --data-urlencode "videoUrl=<PARSED_VIDEO_URL>" \
  --data-urlencode "prompt=<PARSED_PROMPT>"
```

If no prompt was provided, omit the prompt parameter or send empty string.

## Response Handling

The webhook returns a Gemini analysis. Present it to the user in a clean, readable format.

**Highlight these key sections:**
- Hook Grade (A/B/C/D/F)
- Psychology Triggers identified
- What Made It Win (the good)
- What Held It Back (the bad)
- Replication Blueprint (actionable takeaways)
- Final Verdict with "Steal This" recommendation

## Error Handling

- If no URL provided: Ask user to provide a video URL
- If webhook fails (500/timeout): Inform user and suggest checking if workflow is active
- If video URL is invalid/unsupported: Report what Gemini returned

## Analysis Framework Reference

The Gemini prompt analyzes videos using these content strategy frameworks:

**Hook Quality Standards:**
- No Delay (context in first 1-2 seconds)
- No Confusion (6th-grade reading level)
- No Irrelevance (direct pain point connection)
- No Disinterest (strong contrast/curiosity gap)

**Psychology Triggers (Pain Points):**
- MONEY (save it, make it, keep it)
- TIME (save hours, automate, shortcut)
- HEALTH (physical, mental, status)
- ACCESS (exclusive info, insider secrets, simplicity)

**Contrast Formula:**
- Common Belief (A) vs Contrarian Truth (B)
- Bigger gap = stronger hook

**Storyline Structure:**
- Escalating value (2nd best first, BEST second)
- "But/therefore" transitions (not "and then")
- Rehooks between major points
- Strong closer ("The Last Dab")
