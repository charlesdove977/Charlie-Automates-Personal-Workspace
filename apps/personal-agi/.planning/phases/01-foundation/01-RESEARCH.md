# Phase 1: Foundation - Research

**Researched:** 2026-01-12
**Domain:** Claude Agent SDK, MCP integration, 24/7 runtime architecture
**Confidence:** HIGH

<research_summary>
## Summary

Researched the Claude Agent SDK ecosystem for building a 24/7 autonomous assistant. The SDK (v0.1.19) provides a production-ready agentic framework that bundles the Claude Code CLI, offering built-in tools (Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch), automatic context compaction, subagent orchestration, and native MCP integration.

The standard approach uses the Agent SDK with Python async patterns (anyio), MCP servers for external integrations (Telegram, Google services, GHL), and Supervisor/systemd for 24/7 process management. A critical finding: the SDK has ~12-second startup overhead per `query()` call, so the architecture should use long-running session patterns rather than spawning new queries frequently.

**Primary recommendation:** Use `ClaudeSDKClient` with persistent sessions, not repeated `query()` calls. Implement Supervisor for process management. Use existing Telegram MCP servers for bidirectional communication.
</research_summary>

<standard_stack>
## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| claude-agent-sdk | 0.1.19 | Agent framework | Official Anthropic SDK, bundles Claude Code CLI |
| anyio | latest | Async runtime | Cross-runtime async (asyncio/trio), used by SDK |
| python | 3.10+ | Runtime | SDK minimum requirement |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| supervisor | 4.3.0 | Process management | 24/7 daemon operation, auto-restart |
| python-dotenv | latest | Environment variables | API key and config management |
| structlog | latest | Structured logging | Production logging, debugging |

### MCP Servers (Phase 2+)
| Server | Purpose | When to Use |
|--------|---------|-------------|
| claude-telegram-bridge | Bidirectional Telegram | Primary communication channel |
| telegram-mcp (chigwell) | Full Telegram API access | Advanced Telegram operations |
| google-drive-mcp | Google Drive integration | File access |
| google-calendar-mcp | Calendar integration | Scheduling, briefings |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Agent SDK | Raw Anthropic API | Raw API requires implementing tool loop yourself |
| Supervisor | systemd | systemd is lower-level, Supervisor has better Python integration |
| anyio | asyncio directly | anyio provides SDK compatibility and cross-runtime support |

**Installation:**
```bash
pip install claude-agent-sdk python-dotenv structlog
# For 24/7 runtime
pip install supervisor
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
personal-agi/
├── src/
│   ├── __init__.py
│   ├── main.py              # Entry point, supervisor-compatible
│   ├── agent.py             # Core agent logic, ClaudeSDKClient wrapper
│   ├── config.py            # Configuration management
│   └── tools/               # Custom tool definitions (if needed)
│       └── __init__.py
├── mcp_servers/             # MCP server configurations
│   └── telegram.json
├── .env                     # API keys (gitignored)
├── supervisor.conf          # Supervisor configuration
├── requirements.txt
└── .planning/               # GSD artifacts
```

### Pattern 1: ClaudeSDKClient for Long-Running Agent
**What:** Use `ClaudeSDKClient` context manager for persistent sessions instead of repeated `query()` calls
**When to use:** Any agent running more than a few interactions
**Example:**
```python
# Source: Claude Agent SDK Python docs
import anyio
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions

async def run_agent():
    options = ClaudeAgentOptions(
        allowed_tools=["Read", "Write", "Bash", "Glob", "Grep"],
        permission_mode="acceptEdits",
        system_prompt="You are a personal assistant that completes tasks autonomously."
    )

    async with ClaudeSDKClient(options=options) as client:
        # Initial task
        await client.query("Check my to-do list and identify tasks you can complete")
        async for msg in client.receive_response():
            handle_message(msg)

        # Continue in same session - context preserved
        await client.query("Now complete the first task")
        async for msg in client.receive_response():
            handle_message(msg)

anyio.run(run_agent)
```

### Pattern 2: MCP Server Integration
**What:** Connect external services via MCP protocol
**When to use:** Any external API integration (Telegram, Google, etc.)
**Example:**
```python
# Source: Agent SDK MCP documentation
from claude_agent_sdk import ClaudeAgentOptions

options = ClaudeAgentOptions(
    mcp_servers={
        "telegram": {
            "command": "npx",
            "args": ["@s1lverain/claude-telegram-mcp"]
        },
        # Or for Python-based MCP servers:
        "custom": {
            "command": "python",
            "args": ["-m", "my_mcp_server"]
        }
    }
)
```

### Pattern 3: Subagent Orchestration
**What:** Delegate specialized tasks to focused subagents
**When to use:** Complex tasks that benefit from isolation (e.g., research, content creation)
**Example:**
```python
# Source: Agent SDK subagents documentation
from claude_agent_sdk import ClaudeAgentOptions, AgentDefinition

options = ClaudeAgentOptions(
    allowed_tools=["Read", "Glob", "Grep", "Task"],  # Task enables subagents
    agents={
        "researcher": AgentDefinition(
            description="Research specialist for gathering information",
            prompt="Research the given topic thoroughly using web search.",
            tools=["WebSearch", "WebFetch", "Read"]
        ),
        "scheduler": AgentDefinition(
            description="Calendar management specialist",
            prompt="Handle calendar operations and scheduling.",
            tools=["mcp__calendar__*"]
        )
    }
)
```

### Pattern 4: Hooks for Lifecycle Control
**What:** Python callbacks at agent lifecycle events for logging, validation, safety
**When to use:** Production agents needing audit trails, safety checks, cost monitoring
**Example:**
```python
# Source: Agent SDK hooks documentation
from claude_agent_sdk import ClaudeAgentOptions, HookMatcher
import structlog

log = structlog.get_logger()

async def log_tool_use(input_data, tool_use_id, context):
    tool_name = input_data.get("tool_name", "unknown")
    log.info("tool_used", tool=tool_name, id=tool_use_id)
    return {}

async def block_dangerous_commands(input_data, tool_use_id, context):
    if input_data.get("tool_name") != "Bash":
        return {}

    command = input_data.get("tool_input", {}).get("command", "")
    dangerous = ["rm -rf", "sudo", "chmod 777"]

    if any(d in command for d in dangerous):
        return {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": "Dangerous command blocked"
            }
        }
    return {}

options = ClaudeAgentOptions(
    hooks={
        "PostToolUse": [HookMatcher(matcher=".*", hooks=[log_tool_use])],
        "PreToolUse": [HookMatcher(matcher="Bash", hooks=[block_dangerous_commands])]
    }
)
```

### Anti-Patterns to Avoid
- **Repeated `query()` calls:** Each spawns new CLI process with ~12s overhead. Use `ClaudeSDKClient` for persistent sessions.
- **Unbounded context growth:** Enable automatic compaction or implement manual pruning for long-running sessions.
- **Missing error handling:** Always wrap async operations with proper exception handling for `CLINotFoundError`, `ProcessError`, etc.
- **Blocking the event loop:** Never use synchronous operations in async code paths.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tool execution loop | Custom API + tool dispatch | Agent SDK | SDK handles tool calls, retries, context automatically |
| Context compaction | Manual token counting/truncation | SDK automatic compaction | Built-in, handles edge cases, triggers at right threshold |
| Telegram bot | python-telegram-bot + custom logic | Telegram MCP server | MCP provides standard interface, works with any MCP client |
| Process management | Custom daemon script | Supervisor | Battle-tested, handles crashes, logging, restarts |
| Session persistence | File-based state saving | SDK session resume | Built-in session_id tracking and resume capability |
| Rate limit handling | Custom retry logic | SDK built-in | SDK handles 429s with exponential backoff |

**Key insight:** The Agent SDK exists precisely because building reliable agents from scratch is hard. Tool loops, context management, permission handling, and error recovery all have subtle edge cases. The SDK solves these; custom implementations will hit the same bugs over months.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: 12-Second Query Overhead
**What goes wrong:** Each `query()` call takes ~12 seconds before any response
**Why it happens:** SDK spawns fresh CLI process per query, no daemon mode yet
**How to avoid:** Use `ClaudeSDKClient` with persistent sessions; batch operations within sessions
**Warning signs:** Slow response times, high latency for simple tasks

### Pitfall 2: Context Saturation in Long-Running Agents
**What goes wrong:** Agent starts forgetting earlier instructions, behaving inconsistently
**Why it happens:** Context window fills, old messages truncated without proper summarization
**How to avoid:** Enable automatic compaction (default), use `PreCompact` hook to customize
**Warning signs:** Agent loses track of goals, repeats earlier mistakes, forgets user preferences

### Pitfall 3: Unbounded API Costs
**What goes wrong:** Unexpected billing spikes, rate limit errors
**Why it happens:** Agent loops, excessive tool usage, no cost monitoring
**How to avoid:** Set `max_turns` limit, implement cost tracking hooks, monitor usage via Console
**Warning signs:** 429 errors, high token counts in logs, bill surprises

### Pitfall 4: anyio/asyncio Task Cleanup Issues
**What goes wrong:** 100% CPU usage, hanging processes, zombie subprocesses
**Why it happens:** Known SDK bug where `Query.close()` can hang indefinitely
**How to avoid:** Wrap disconnect with timeout: `await asyncio.wait_for(client.disconnect(), timeout=5.0)`
**Warning signs:** Processes not exiting cleanly, high CPU after agent "stops"

### Pitfall 5: Missing Graceful Shutdown
**What goes wrong:** Agent killed mid-task, corrupted state, orphan processes
**Why it happens:** No signal handling, abrupt termination
**How to avoid:** Implement SIGTERM/SIGINT handlers, complete current task before exit
**Warning signs:** Incomplete operations after restarts, duplicate task attempts

### Pitfall 6: Windows-Specific Subprocess Issues
**What goes wrong:** ClaudeSDKClient hangs during initialization on Windows
**Why it happens:** Windows subprocess stdin/stdout buffering differences
**How to avoid:** Test on target platform; prefer Linux/macOS for 24/7 deployment
**Warning signs:** Indefinite hangs during client initialization on Windows
</common_pitfalls>

<code_examples>
## Code Examples

Verified patterns from official sources:

### Basic Agent Entry Point
```python
# Source: Agent SDK Python docs + production patterns
import anyio
import signal
import structlog
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
from claude_agent_sdk.types import AssistantMessage, TextBlock

log = structlog.get_logger()

class PersonalAGI:
    def __init__(self):
        self.running = True
        self.client = None

        # Handle graceful shutdown
        signal.signal(signal.SIGTERM, self._shutdown)
        signal.signal(signal.SIGINT, self._shutdown)

    def _shutdown(self, signum, frame):
        log.info("shutdown_requested", signal=signum)
        self.running = False

    async def run(self):
        options = ClaudeAgentOptions(
            allowed_tools=["Read", "Write", "Bash", "Glob", "Grep", "WebSearch"],
            permission_mode="acceptEdits",
            system_prompt="You are a personal AGI assistant. Complete tasks autonomously."
        )

        try:
            async with ClaudeSDKClient(options=options) as client:
                self.client = client
                log.info("agent_started")

                while self.running:
                    # Your main agent loop here
                    await self.process_tasks()
                    await anyio.sleep(60)  # Check for new tasks every minute

        except Exception as e:
            log.error("agent_error", error=str(e))
            raise
        finally:
            log.info("agent_stopped")

    async def process_tasks(self):
        # Implement your task processing logic
        pass

def main():
    agent = PersonalAGI()
    anyio.run(agent.run)

if __name__ == "__main__":
    main()
```

### Supervisor Configuration
```ini
# Source: Supervisor docs + Python daemon patterns
# supervisor.conf

[program:personal-agi]
command=/path/to/venv/bin/python -m src.main
directory=/path/to/personal-agi
user=your-user
autostart=true
autorestart=true
startsecs=10
startretries=3
stopwaitsecs=30
stderr_logfile=/var/log/personal-agi/stderr.log
stdout_logfile=/var/log/personal-agi/stdout.log
environment=ANTHROPIC_API_KEY="%(ENV_ANTHROPIC_API_KEY)s"
```

### Custom In-Process MCP Tool
```python
# Source: Agent SDK MCP documentation
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions

@tool("send_notification", "Send a notification to the user", {
    "message": str,
    "priority": str  # "low", "normal", "high"
})
async def send_notification(args):
    message = args["message"]
    priority = args.get("priority", "normal")

    # Your notification logic here (e.g., push to Telegram queue)
    log.info("notification_sent", message=message, priority=priority)

    return {
        "content": [
            {"type": "text", "text": f"Notification sent: {message}"}
        ]
    }

notification_server = create_sdk_mcp_server(
    name="notifications",
    version="1.0.0",
    tools=[send_notification]
)

options = ClaudeAgentOptions(
    mcp_servers={"notifications": notification_server},
    allowed_tools=["mcp__notifications__send_notification"]
)
```

### Message Handling Pattern
```python
# Source: Agent SDK types documentation
from claude_agent_sdk.types import (
    AssistantMessage,
    UserMessage,
    SystemMessage,
    ResultMessage,
    TextBlock,
    ToolUseBlock
)

async def handle_response(client):
    async for message in client.receive_response():
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    log.info("assistant_text", text=block.text)
                elif isinstance(block, ToolUseBlock):
                    log.info("tool_use", tool=block.name, input=block.input)

        elif isinstance(message, ResultMessage):
            log.info("task_complete", result=message.result)
            return message.result

        elif isinstance(message, SystemMessage):
            if message.subtype == "init":
                log.info("session_started", session_id=message.session_id)
```
</code_examples>

<sota_updates>
## State of the Art (2025-2026)

What's changed recently:

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Claude Code SDK | Claude Agent SDK | Late 2025 | Renamed, same functionality |
| Custom tool loops | SDK built-in tools | 2025 | No need to implement tool execution |
| Fragmented MCP ecosystem | Industry-standard MCP | 2025 | OpenAI, Google, Microsoft all adopted MCP |
| Manual context management | Automatic compaction | 2025 | SDK handles context limits automatically |

**New tools/patterns to consider:**
- **In-process MCP servers:** Define tools as Python functions, no subprocess overhead
- **Session forking:** Branch conversations to explore alternatives
- **Subagent orchestration:** Delegate specialized tasks with isolated context
- **Hooks system:** Insert custom logic at any point in agent lifecycle

**Deprecated/outdated:**
- **"Claude Code SDK" naming:** Now "Claude Agent SDK"
- **Manual tool implementation:** Use SDK built-in tools
- **Blocking `query()` patterns:** Use async `ClaudeSDKClient` for production
</sota_updates>

<open_questions>
## Open Questions

Things that couldn't be fully resolved:

1. **Daemon mode availability**
   - What we know: Feature request exists for hot process reuse to eliminate 12s overhead
   - What's unclear: Timeline for implementation, if any
   - Recommendation: Design around `ClaudeSDKClient` sessions; accept startup cost

2. **Telegram MCP maturity**
   - What we know: Several community MCP servers exist (claude-telegram-bridge, telegram-mcp)
   - What's unclear: Which is most stable/maintained for production use
   - Recommendation: Evaluate during Phase 2; may need to implement custom MCP server

3. **Cost optimization for 24/7 operation**
   - What we know: API costs can accumulate; caching and batching help
   - What's unclear: Exact cost patterns for personal assistant use case
   - Recommendation: Implement cost tracking hooks from day 1; set usage alerts
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [Agent SDK Overview - Official Docs](https://platform.claude.com/docs/en/agent-sdk/overview) - Core SDK documentation
- [anthropics/claude-agent-sdk-python](https://github.com/anthropics/claude-agent-sdk-python) - Python SDK source and README
- [claude-agent-sdk PyPI](https://pypi.org/project/claude-agent-sdk/) - Version 0.1.19, Python 3.10+

### Secondary (MEDIUM confidence)
- [claude-agent-sdk-demos](https://github.com/anthropics/claude-agent-sdk-demos) - Multi-agent patterns, verified architecture
- [Supervisor documentation](https://supervisord.org/) - Process management
- [MCP Official](https://modelcontextprotocol.io/) - Model Context Protocol standard

### Tertiary (LOW confidence - needs validation during implementation)
- [claude-telegram-bridge](https://github.com/RichardDillman/claude-telegram-bridge) - Community Telegram MCP
- [telegram-mcp](https://github.com/chigwell/telegram-mcp) - Alternative Telegram integration
- SDK GitHub issues for known bugs (anyio cleanup, Windows issues)
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Claude Agent SDK v0.1.19
- Ecosystem: MCP, anyio, Supervisor
- Patterns: ClaudeSDKClient, subagents, hooks, MCP integration
- Pitfalls: Startup overhead, context saturation, cost, async cleanup

**Confidence breakdown:**
- Standard stack: HIGH - verified with official docs, PyPI
- Architecture: HIGH - from official examples and SDK source
- Pitfalls: HIGH - documented in GitHub issues, community reports
- Code examples: HIGH - from official SDK documentation

**Research date:** 2026-01-12
**Valid until:** 2026-02-12 (30 days - SDK ecosystem actively developing)
</metadata>

---

*Phase: 01-foundation*
*Research completed: 2026-01-12*
*Ready for planning: yes*
