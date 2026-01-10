# Agent Framework Guide

A practical guide for creating effective agent definition files.

---

## Framework Structure Overview

```
┌─────────────────────────────────────┐
│           FRONTMATTER               │  ← Metadata & permissions
├─────────────────────────────────────┤
│           AGENT NAME                │  ← Identity
├─────────────────────────────────────┤
│          CONSTITUTION               │  ← Values & boundaries
│   • Principles (DO)                 │
│   • Anti-Principles (DON'T)         │
├─────────────────────────────────────┤
│          CONSTRAINTS                │  ← Role & requirements
├─────────────────────────────────────┤
│    PROCESSING INSTRUCTIONS          │  ← Workflow steps
├─────────────────────────────────────┤
│        OUTPUT FORMAT                │  ← Deliverable template
├─────────────────────────────────────┤
│          EXECUTION                  │  ← Input handling
└─────────────────────────────────────┘
```

---

## Section-by-Section Guide

### 1. Frontmatter (YAML)

```yaml
---
description: What the agent does in one line
allowed-tools: Write, Read, Bash, Edit, Glob, Grep
---
```

**Purpose:** Machine-readable metadata for tool orchestration.

**Best Practices:**
- Keep description under 100 characters
- Only allow tools the agent actually needs (principle of least privilege)
- Common tool combinations:
  - `Write` - Output-only agents
  - `Read, Write` - Transform/process agents
  - `Read, Write, Bash` - Agents that need system interaction
  - `Read, Write, Edit, Glob, Grep` - Full codebase agents

---

### 2. Constitution

The agent's "soul" - defines WHO it is, not WHAT it does.

#### Principles (Positive Values)

Write 3-6 principles that answer:
- What quality standards does this agent uphold?
- What characteristics define good output?
- What context must always be considered?

**Pattern:** `{Action verb} + {quality/standard} + {context/reason}`

**Examples by Domain:**

| Domain | Principle Example |
|--------|-------------------|
| Content | Maintain brand voice consistency across all outputs |
| Code | Prioritize readability over cleverness |
| Data | Preserve data integrity and source attribution |
| Support | Lead with empathy before solutions |
| Marketing | Balance engagement with authenticity |

#### Anti-Principles (Boundaries)

Write 3-5 anti-principles that answer:
- What bad patterns must be avoided?
- What shortcuts are forbidden?
- When should the agent NOT act?

**Pattern:** `Never/Avoid/Do not + {bad behavior} + {optional: consequence}`

**Examples:**
- Never sacrifice accuracy for brevity
- Avoid jargon unless the audience is technical
- Do not make assumptions about missing context - ask instead

---

### 3. Constraints

Hard rules that shape behavior.

```markdown
**Role:** {Professional identity}
**Optimize For:** {Key qualities}
**Must:** {Required behavior}
**Must Not:** {Forbidden behavior}
```

#### Role Definition

Creates a mental model for expertise and perspective.

**Formula:** `Senior {specialty} with {relevant background/training}`

**Examples:**
- Senior DevOps engineer with security background
- Senior UX writer with accessibility expertise
- Senior data analyst with business intelligence training

#### Optimize For

The 2-3 qualities the agent should maximize when making tradeoffs.

**Common Optimization Targets:**
- Clarity, accuracy, brevity
- Speed, reliability, cost-efficiency
- Engagement, authenticity, conversion
- Security, performance, maintainability

#### Must/Must Not

Non-negotiable behaviors.

**Must Examples:**
- Must validate all inputs before processing
- Must include source citations
- Must output to specified format

**Must Not Examples:**
- Must not expose sensitive information
- Must not make external API calls without confirmation
- Must not modify files outside designated directory

---

### 4. Processing Instructions

The step-by-step workflow. Think of this as the agent's "recipe."

#### Phase Structure

Most agents follow this pattern:

1. **Analysis/Discovery** - Understand the input
2. **Primary Transformation** - Core value creation
3. **Secondary Outputs** - Supporting deliverables
4. **Variations** - Options/alternatives
5. **Finalization** - Polish and package

#### Writing Effective Steps

Each step should be:
- **Specific:** Not "analyze content" but "identify the 3-5 key themes"
- **Actionable:** Start with verbs (identify, extract, generate, validate)
- **Measurable:** Include quantities where relevant (8-10 options, 2-3 paragraphs)

**Step Patterns:**

```markdown
### {Phase Name}
- {What to identify/extract}
- {Quality criteria to apply}
- {Audience/context consideration}
- {Completeness checkpoint}
```

---

### 5. Output Format

Define exactly what the deliverable looks like.

#### File Naming Convention

**Pattern:** `{type}-{identifier}-{timestamp}.{ext}`

**Examples:**
- `report-analysis-20240115-1430.md`
- `content-package-{topic}.txt`
- `audit-{system-name}-{YYYYMMDD}.json`

#### Output Structure

Use clear visual separators for sections:

```
================ (major sections)
---------------- (subsections)
```

Include:
- Header with metadata (generated date, source, version)
- Clearly labeled sections
- Consistent formatting within sections
- Footer/end marker

---

### 6. Execution

Handles input validation and action triggering.

#### Input Handling Pattern

```markdown
**User Argument:** $ARGUMENTS

If no {input} is provided:
  → {helpful prompt explaining what's needed}

If {input} is provided:
  → {process immediately}
  → {write output}
  → {confirm with path/summary}
```

**Good Prompts for Missing Input:**
- Explain what input is needed
- Show an example format
- Suggest where to find the input

---

## Agent Design Patterns

### Pattern 1: Transformer Agent
Input → Process → Structured Output

```
Example: Transcript → Summary + Metadata
Use when: Converting unstructured to structured
```

### Pattern 2: Generator Agent
Specification → Multiple Variations

```
Example: Brief → 10 headline options
Use when: Creative exploration needed
```

### Pattern 3: Analyzer Agent
Content → Insights + Recommendations

```
Example: Codebase → Security audit report
Use when: Evaluation and assessment
```

### Pattern 4: Orchestrator Agent
Task → Subtask delegation → Aggregated result

```
Example: Feature request → Design + Code + Tests
Use when: Complex multi-step workflows
```

---

## Quality Checklist

Before deploying an agent, verify:

- [ ] Frontmatter has accurate description and minimal permissions
- [ ] Principles define positive values (not just rules)
- [ ] Anti-principles prevent common failure modes
- [ ] Role creates appropriate expertise context
- [ ] Processing steps are specific and actionable
- [ ] Output format is clearly templated
- [ ] Execution handles missing input gracefully
- [ ] No ambiguous instructions that could cause loops

---

## Example: Quick Agent Template

Here's a minimal viable agent:

```markdown
---
description: Generate meeting notes from transcript
allowed-tools: Write
---

# Meeting Notes Agent

Transform meeting transcripts into structured notes.

## Constitution

**Principles:**
- Capture decisions and action items with owners
- Preserve context without verbatim transcription
- Organize by topic, not chronology

**Anti-Principles:**
- Never attribute opinions without clear speaker identification
- Avoid including tangential discussions

## Constraints

**Role:** Executive assistant with project management background
**Optimize For:** Clarity, actionability, brevity
**Must:** Include action items with owners and deadlines
**Must:** Output as markdown file

## Processing Instructions

### 1. Extract Key Elements
- Identify all decisions made
- List action items with assignees
- Note unresolved questions

### 2. Organize by Topic
- Group related discussions
- Summarize each topic in 2-3 sentences
- Highlight dependencies between topics

### 3. Format Output
- Create structured markdown
- Use checkboxes for action items
- Include attendee list

## Output Format

`meeting-notes-{YYYY-MM-DD}.md`

## Execution

**User Argument:** $ARGUMENTS

If no transcript provided: "Please provide a meeting transcript to process."

If transcript provided: Process and write to meeting-notes file.
```

---

## Common Mistakes to Avoid

1. **Vague principles** - "Be good" vs "Maintain factual accuracy with source citations"
2. **Missing anti-principles** - Without boundaries, agents hallucinate or overreach
3. **Ambiguous steps** - "Process the content" vs "Extract the top 5 key points"
4. **No output template** - Leads to inconsistent deliverables
5. **Overly broad permissions** - Only allow tools actually needed
6. **No input validation** - Agent should handle missing/malformed input gracefully
