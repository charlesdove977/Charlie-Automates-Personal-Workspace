# Claude Code + GSD + n8n MCP: The Self-Building Automation Stack

**Status:** Pre-production
**Target Length:** 15-20 minutes
**Follow-up to:** Get Shit Done to Build an App on Claude Code, UI Polish with GSD
**Stack Featured:** Claude Code + Get Shit Done (GSD) + n8n MCP Server

---

## Concept

Show how to build production-grade, multi-layer n8n workflows directly from Claude Code using the n8n MCP server and GSD plugin. Compare a messy manually-built workflow vs a clean, structured workflow built with this stack.

**Key Differentiator:** You're not clicking around the canvas hoping things connect. You're spec'ing it out, building layer by layer, and deploying directly from your terminal. The three tools work together: Claude Code as the environment, GSD for structure/phases, n8n MCP to deploy directly.

---

## Title Options (Split Testing)

1. **GSD + n8n MCP: Self-Building Automations** (39 chars)
2. **Claude Plugin: 10x Faster n8n Workflows** (39 chars)
3. **Claude Code + n8n MCP: Never Touch Canvas** (41 chars)

---

## Thumbnail (FINAL)

**Concept:** Arrow flow showing the stack as a connected system

**Layout:**
- Left: Photo of you pointing toward the logos
- Right: Glass container with three logo boxes stacked vertically with arrows connecting them:
  - CLAUDE CODE (orange/coral pixelated) → arrow →
  - GSD (blue pixelated blocks) → arrow →
  - n8n (pink workflow icon + text)

**Background:** Dark navy/blue gradient with subtle circuit pattern
**Style:** Clean, professional, readable at small sizes

---

## Hook Structure (0:00-1:00)

### The Speed Flex Hook

*Open on your face, direct to camera*

"If you're building your n8n workflows manually... watch this."

*Cut to: Terminal with Claude Code*

*Type or voice command: "Create an n8n workflow - webhook receives form data, validates it, sends to CRM, notifies Slack"*

*Show Claude working - searching nodes, creating workflow*

*Cut to: n8n canvas - refresh - workflow appears, fully built*

"Five nodes. Connected. Ready to test. I didn't touch the canvas once."

*Beat*

"This is Claude Code, GSD, and the n8n MCP server. Three tools. One stack. And it's about to change how you build automations."

*Cut to: The messy spaghetti workflow*

"Because if you're still doing it like this... we need to talk."

---

## Section 1: The Problem (1:00-3:00)

### The Setup

"Here's what happens when you build complex workflows manually."

*Show on screen: You building a workflow by clicking around*

"You start simple. Webhook, do a thing, send a notification. Easy."

*Add more nodes*

"Then you need validation. So you add an IF node. Now you've got two branches."

*Add more*

"Then you need error handling. Another branch. Then retry logic. Then logging. Then a sub-workflow."

*Show the mess*

"And before you know it, you've got this. I call it spaghetti automation."

### The Real Problems

"And here's what sucks about spaghetti workflows:"

1. **"You forget what connects where."** - *point to confusing connections*
2. **"Error handling becomes an afterthought."** - *show missing error paths*
3. **"Testing is 'click run and pray.'"** - *show failed execution*
4. **"Client asks for one change, you break three other things."** - *show frustrated face*

### The Alternative

"But there's another way. What if you could build workflows the same way you build apps? With specs. With phases. With structure."

*Cut to terminal*

"That's what I'm going to show you today."

---

## Section 2: The Stack (3:00-5:30)

### Overview

"Three tools. One stack. Let me break it down."

### Tool 1: Claude Code

*Show Claude Code in VS Code*

"Claude Code is your AI dev environment. If you've watched my other videos, you know I use this for everything. Building apps, running my business, all of it."

"But today, we're using it to build n8n workflows."

### Tool 2: Get Shit Done (GSD)

*Show GSD commands*

"GSD is a plugin I've covered before. It breaks complex projects into phases. Each phase gets planned, built, and tested before moving on."

"The magic is context management. Every phase, Claude gets fresh context. No degradation. No forgetting what it was doing."

*Show STATE.md*

"And it tracks everything in these markdown files so you always know where you're at."

### Tool 3: n8n MCP Server

*Show n8n MCP in action*

"This is the new piece. The n8n MCP server connects Claude directly to your n8n instance."

"Claude can:"
- "Search for nodes" - *show search_nodes*
- "Create workflows" - *show create_workflow*
- "Update workflows" - *show update_partial_workflow*
- "Validate everything" - *show validate_workflow*
- "Even trigger test runs" - *show test_workflow*

"No copying JSON. No switching tabs. Claude builds it, n8n runs it."

### Why Together

"Separately, these are useful. Together? You can build workflows that would take hours... in minutes. Without the spaghetti."

---

## Section 3: Installing the n8n MCP Server (5:30-8:00)

### Prerequisites

"Before we install, you need three things:"

1. **Claude Code installed** - "If you don't have this, go watch my first video. Link above."
2. **n8n running somewhere** - "Self-hosted or cloud, doesn't matter."
3. **An n8n API key** - "I'll show you where to get this."

### Getting Your n8n API Key

*Screen recording: Navigate to n8n*

"First, go to your n8n instance. Click on your profile. Settings. API."

*Show the API settings*

"Create a new API key. Give it a name like 'Claude MCP'. Copy that key."

*Copy the key*

"Keep this safe. You'll need it in a second."

### Installing the MCP Server

*Switch to terminal*

"Now, in your terminal, we're going to add the n8n MCP server to Claude."

"Open your Claude config. On Mac, it's in your home directory under .claude."

*Show the config file location*

"You're looking for the MCP servers section. Add this:"

```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "@n8n/mcp-server"],
      "env": {
        "N8N_API_URL": "https://your-n8n-instance.com/api/v1",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

"Replace the URL with your n8n instance. Paste your API key."

*Save the file*

"Save it. Restart Claude Code."

### Verifying It Works

*Open Claude Code*

"Now let's make sure it's connected."

*Type a command*

"I'll just ask Claude to list my workflows."

*Show the response*

"Boom. It pulled my workflows from n8n. We're connected."

---

## Section 4: The Layer-by-Layer Approach (8:00-9:30)

### The Mental Model

"Before we build, I want to explain how I think about complex workflows."

*Show diagram or whiteboard*

"Complex workflows have layers:"

```
Layer 1: Core happy path (data in, data out)
Layer 2: Input validation + error handling
Layer 3: Branching logic (if/else paths)
Layer 4: Retry logic + rate limiting
Layer 5: Logging + monitoring
```

"Most people try to build all five layers at once. That's why they get spaghetti."

### The GSD Approach

"With GSD, each layer is a phase."

"Build Layer 1. Test it. Verify it works."
"Then add Layer 2. Test again."
"Layer by layer. Never building blind."

*Show STATE.md tracking progress*

"You don't build a house by throwing up walls, roof, and plumbing all at once. You pour the foundation first. Same with workflows."

---

## Section 5: Live Build - Client Intake Automation (9:30-18:00)

### The Workflow We're Building

"Let me show you this in action. We're going to build a client intake automation."

*Show the goal*

"Form submission comes in. We validate it. AI analyzes the data. Updates the CRM. Sends notifications. Handles errors gracefully."

"Five layers. Let's go."

---

### Layer 1: Core Happy Path (9:30-11:30)

#### GSD Setup

*Open Claude Code*

"First, I'm going to use GSD to set up the project."

*Type: /gsd:new-project*

"I'll describe what we're building..."

*Type the description*

"Building an n8n workflow for client intake automation. Webhook receives form data, processes it, updates CRM, sends notifications."

*GSD asks questions*

"See how it's asking clarifying questions? What triggers it? What CRM? What notifications? This is the planning that prevents spaghetti."

*Answer the questions*

*PROJECT.md created*

"Now it created the PROJECT.md with all our specs."

#### Creating the Roadmap

*Type: /gsd:create-roadmap*

"Let's see how it breaks this down..."

*Show the phases*

"Perfect. Five phases. One for each layer. This is exactly what we want."

#### Building Phase 1

*Type: /gsd:plan-phase 1*

"Phase 1 is the core happy path. Webhook in, basic processing, notification out."

*Clear context, execute*

"Now watch what happens. Claude's going to use the n8n MCP server to build this directly."

*Show Claude searching for nodes*

"It's searching for the Webhook node... found it."

*Show Claude creating the workflow*

"Now it's creating the workflow in n8n..."

*Switch to n8n, refresh*

"There it is. The workflow appeared. Let me test it."

*Trigger a test*

"Data comes in... notification goes out. Layer 1 done."

*Show STATE.md updating*

---

### Layer 2: Input Validation + Error Handling (11:30-13:00)

#### Planning

*Clear context*
*Type: /gsd:plan-phase 2*

"Phase 2. We're adding validation. If someone submits garbage data, we handle it gracefully."

#### Building

*Execute the phase*

"Claude's adding an IF node to check required fields..."

*Show the update happening*

"And now an error branch. If validation fails, send an error notification."

*Switch to n8n*

"See how the workflow now has two paths? Happy path and error path."

*Test with bad data*

"Let me send some incomplete data... and there's the error notification. Layer 2 done."

---

### Layer 3: AI Analysis (13:00-14:30)

#### Planning

*Clear context*
*Type: /gsd:plan-phase 3*

"Phase 3. AI analysis. We're going to use OpenAI to analyze the intake data and structure it for the CRM."

#### Building

*Execute*

"Claude's searching for the OpenAI node..."

*Show it being added*

"It's configuring the prompt, setting up the parameters..."

*Show in n8n*

"Now our workflow has AI in the middle. Data comes in, gets validated, AI processes it."

*Test it*

"Look at that output. Structured, clean, ready for the CRM."

---

### Layer 4: CRM + Notifications (14:30-16:00)

#### Planning

*Clear context*
*Type: /gsd:plan-phase 4*

"Phase 4. CRM update and final notifications."

#### Building

*Execute*

"Adding the CRM node... I use [GoHighLevel/HubSpot/whatever you use]."

*Show it being added*

"And the notification nodes. Slack for the team, email for the client."

*Show in n8n*

"Almost there. Let me run a full test."

*Full test*

"Form submitted... validated... AI analyzed... CRM updated... notifications sent. Beautiful."

---

### Layer 5: Error Handling + Logging (16:00-17:30)

#### Planning

*Clear context*
*Type: /gsd:plan-phase 5*

"Final layer. Retry logic on API calls. Logging for debugging. Error aggregation."

#### Building

*Execute*

"Claude's adding retry logic to the CRM node in case the API times out..."

*Show it*

"Adding a logging node so we can debug issues..."

*Show it*

"And error aggregation so we get a summary if something fails."

*Show final workflow in n8n*

"Look at this workflow. Five layers. Multiple branches. Error handling everywhere. Logging. Retries."

"And it's clean. Every section is intentional. Nothing is spaghetti."

---

### The Comparison (17:30-18:00)

*Split screen: Spaghetti workflow from intro vs the clean workflow we just built*

"Same complexity. Same features. One looks like this... the other looks like this."

"The difference? Structure. Planning. Building layer by layer."

---

## Section 6: Why This Beats Clicking Around (18:00-19:00)

*Quick comparison*

| Manual Canvas Building | GSD + Claude + n8n MCP |
|------------------------|------------------------|
| Add nodes, hope it works | Spec first, build second |
| Forget error handling | Error handling is a phase |
| Debug by clicking around | Debug with clear layers |
| Changes break things | Changes are scoped |
| Hard to explain | PROJECT.md is the documentation |

"When a client asks 'how does this work?'... I send them the PROJECT.md. It's documentation that wrote itself."

---

## Section 7: When to Use This (19:00-19:30)

### Simple Workflows

"If you're building something with 3-5 nodes, no branches... just use the canvas. Don't overthink it."

### Complex Workflows

"But the moment you've got 10+ nodes, multiple branches, error handling, retries... this stack. Every time."

### Client Work

"And if you're doing client work? Always. The structure makes handoff clean. They can see exactly what the workflow does."

---

## Close (19:30-20:00)

"n8n is powerful. But powerful tools can create powerful messes."

"GSD gives you the structure. The n8n MCP server gives Claude the hands. Together, you build production-grade automations without the spaghetti."

*Show the final clean workflow one more time*

"If you're building automations for clients or for yourself... this stack will save you hours and keep your workflows clean."

"Link to my previous GSD videos if you want to learn the fundamentals. Join my School community if you want to go deeper. I'll see you in the next one."

---

## B-Roll / Assets Needed

1. Screen recording: Messy n8n workflow (spaghetti example)
2. Screen recording: Clean organized workflow (the one we build)
3. Screen recording: n8n API key generation
4. Screen recording: Claude config file edit
5. Screen recording: Full build process (each layer)
6. Diagram: The 5 layers of complex workflows
7. Split screen comparison at the end

---

## Call-to-Actions

- **In video:** "Join my School community for the full templates"
- **End screen:** Previous GSD videos, Subscribe button
- **Description:** Links to GSD plugin, n8n MCP server, School community

---

## Notes

- This builds on the GSD series - viewers should have context from previous videos
- Focus on the PROCESS and STRUCTURE, not just the tools
- The spaghetti vs clean comparison is the hero moment - nail this visually
- Keep the installation section tight - don't let it drag
- The live build should feel fast and powerful, not tedious
