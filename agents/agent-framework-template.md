---
description: {One-line description of what this agent does and its primary output}
allowed-tools: {Tool permissions: Write, Read, Bash, Edit, Glob, Grep, etc.}
---

# {Agent Name}

{One sentence describing the agent's purpose and what triggers it to act.}

## Constitution

**Principles:**
- {Core value 1 - What the agent prioritizes}
- {Core value 2 - Quality standard to maintain}
- {Core value 3 - Behavioral guideline}
- {Core value 4 - Output characteristic}
- {Core value 5 - Context awareness}

**Anti-Principles:**
- {What to never do 1 - Quality violation to avoid}
- {What to never do 2 - Bad pattern to reject}
- {What to never do 3 - Behavior to suppress}
- {What to never do 4 - When NOT to act}

## Constraints

**Role:** {Professional identity with relevant expertise, e.g., "Senior [domain] specialist with [relevant background]"}
**Optimize For:** {2-3 key qualities to maximize, comma-separated}
**Must:** {Critical requirement 1 - mandatory behavior}
**Must:** {Critical requirement 2 - mandatory output}
**Must Not:** {Hard boundary - what is forbidden}

---

## Processing Instructions

Upon receiving {input type}, execute the following steps automatically:

### 1. {Phase 1 Name} (Analysis/Discovery)
- {Step 1.1 - Initial assessment task}
- {Step 1.2 - Key element identification}
- {Step 1.3 - Context gathering}
- {Step 1.4 - Pattern recognition}

### 2. {Phase 2 Name} (Primary Transformation)
- {Step 2.1 - Main processing action}
- {Step 2.2 - Quality criteria}
- {Step 2.3 - Audience consideration}
- {Step 2.4 - Completeness check}

### 3. {Phase 3 Name} (Secondary Output)
- {Step 3.1 - Additional deliverable}
- {Step 3.2 - Format requirements}
- {Step 3.3 - Differentiation from primary}
- {Step 3.4 - Standalone usability}

### 4. {Phase 4 Name} (Variations/Options)
- {Step 4.1 - Generate alternatives}
- {Step 4.2 - Diversity criteria}
- {Step 4.3 - Consistency requirements}
- {Step 4.4 - Quantity specification}

### 5. {Phase 5 Name} (Supporting Materials)
- {Step 5.1 - Supplementary content}
- {Step 5.2 - Format specification}
- {Step 5.3 - Purpose alignment}

---

## Output Format

Generate a {file type} named `{naming-convention-{timestamp}}.{ext}` with this structure:

```
================================================================================
{OUTPUT PACKAGE TITLE}
Generated: {date and time}
================================================================================

--------------------------------------------------------------------------------
{SECTION 1 HEADER}
--------------------------------------------------------------------------------
{Field 1}: {description}
{Field 2}: {description}
{Field 3}: {description}

{Subsection}:
1. {item 1}
2. {item 2}
3. {item 3}

--------------------------------------------------------------------------------
{SECTION 2 HEADER}
--------------------------------------------------------------------------------
{Content description and format}

--------------------------------------------------------------------------------
{SECTION 3 HEADER}
--------------------------------------------------------------------------------
{Content description and format}

{Subsection placeholder}:
{placeholder content}

--------------------------------------------------------------------------------
{SECTION 4 HEADER}
--------------------------------------------------------------------------------
1. {option 1}
2. {option 2}
...
{n}. {option n}

--------------------------------------------------------------------------------
{SECTION 5 HEADER}
--------------------------------------------------------------------------------
1. {item 1}
2. {item 2}
...
{n}. {item n}

================================================================================
END OF {OUTPUT PACKAGE TITLE}
================================================================================
```

---

## Execution

**User Argument:** $ARGUMENTS

If no {required input} is provided in the arguments, respond with:
"{Helpful message explaining what input is needed and how to provide it.}"

If {required input} is provided, process it immediately following all instructions above, then {final action: write file, confirm completion, provide path, etc.}.
