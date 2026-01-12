# Phase 2: Communication - Research

**Researched:** 2025-01-12
**Domain:** Telegram bot integration for bidirectional AI agent communication
**Confidence:** HIGH

<research_summary>
## Summary

Researched Telegram integration options for the Personal AGI agent. Found multiple approaches: MCP servers (Telethon-based for personal accounts, Bot API-based for bots), standalone bridges, and direct library integration.

**Key finding:** For a Personal AGI that needs simple bidirectional messaging, using `python-telegram-bot` library with direct integration is simpler and more reliable than MCP middleware. MCP adds unnecessary complexity when we just need to send/receive messages.

**Primary recommendation:** Create a Telegram bot via BotFather, use python-telegram-bot v22+ for async message handling, integrate directly with PersonalAGI.process_message().
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| python-telegram-bot | 22.5+ | Telegram Bot API wrapper | Async, well-maintained, 10+ years mature |
| httpx | 0.27+ | HTTP client (PTB dependency) | Modern async HTTP |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| redis | 5.0+ | Session/state persistence | Production deployments |
| sqlite3 | (stdlib) | Simple persistence | Development/single user |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| python-telegram-bot | Telethon (MTProto) | Telethon = personal account access, more complex auth |
| Direct integration | MCP server | MCP adds middleware layer, overkill for simple messaging |
| python-telegram-bot | aiogram | Similar features, PTB more documented |

**Installation:**
```bash
pip install python-telegram-bot>=22.5
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure
```
src/
├── agent.py           # Existing PersonalAGI class
├── main.py            # Existing entry point
├── config.py          # Existing config
└── telegram/
    ├── __init__.py
    ├── bot.py         # TelegramBot class
    └── handlers.py    # Message handlers
```

### Pattern 1: Async Bot with Agent Integration
**What:** TelegramBot class that wraps python-telegram-bot and calls PersonalAGI
**When to use:** Always - this is the recommended pattern
**Example:**
```python
# Source: python-telegram-bot docs + our architecture
from telegram import Update
from telegram.ext import Application, MessageHandler, filters

class TelegramBot:
    def __init__(self, token: str, agent: PersonalAGI, allowed_users: list[int]):
        self.agent = agent
        self.allowed_users = allowed_users
        self.app = Application.builder().token(token).build()
        self.app.add_handler(MessageHandler(filters.TEXT, self.handle_message))

    async def handle_message(self, update: Update, context):
        if update.effective_user.id not in self.allowed_users:
            return  # Ignore unauthorized users

        user_message = update.message.text
        response = await self.agent.process_message(user_message)
        await update.message.reply_text(response)

    async def send_notification(self, chat_id: int, message: str):
        """Proactive notifications from agent to user."""
        await self.app.bot.send_message(chat_id=chat_id, text=message)
```

### Pattern 2: Long Polling for Development
**What:** Use polling mode during development, webhooks for production
**When to use:** Development and simple deployments
**Example:**
```python
# Development mode - long polling
async def main():
    bot = TelegramBot(token=BOT_TOKEN, agent=agent, allowed_users=[YOUR_USER_ID])
    await bot.app.run_polling()
```

### Pattern 3: Concurrent Agent + Bot
**What:** Run Telegram bot alongside existing daemon mode
**When to use:** 24/7 operation with Telegram interface
**Example:**
```python
import asyncio

async def main():
    agent = PersonalAGI()
    bot = TelegramBot(token=BOT_TOKEN, agent=agent, allowed_users=[OWNER_ID])

    await agent.start()
    await bot.app.initialize()
    await bot.app.start()
    await bot.app.updater.start_polling()

    # Wait for shutdown
    await shutdown_event.wait()

    await bot.app.updater.stop()
    await bot.app.stop()
    await agent.stop()
```

### Anti-Patterns to Avoid
- **Using personal account (Telethon):** Requires phone auth, session management, account risk
- **MCP for simple messaging:** Adds unnecessary middleware when direct integration works
- **Blocking message handlers:** Always use async - PTB v20+ is async-first
- **No user whitelist:** Personal AGI must restrict to authorized users only
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Telegram API | Raw HTTP requests | python-telegram-bot | Rate limits, retries, error handling complex |
| Message parsing | Custom parsers | PTB's filters module | Edge cases, escaping, special chars |
| Polling/webhooks | Custom loop | PTB's Updater | Connection management, backoff, timeouts |
| User authentication | Custom auth | Telegram user IDs | Built-in, cryptographically secure |
| Message formatting | Raw strings | telegram.helpers.escape_markdown | Markdown v2 escaping is tricky |

**Key insight:** Telegram's Bot API has many edge cases (rate limits, message length limits, markdown escaping, file handling). python-telegram-bot handles all of these. Don't try to work around them manually.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Blocking the Event Loop
**What goes wrong:** Bot becomes unresponsive while agent processes message
**Why it happens:** Agent.process_message() can take 10-60 seconds for complex tasks
**How to avoid:** Use async properly, consider showing "thinking..." status
**Warning signs:** Messages queue up, bot appears offline during processing

### Pitfall 2: No User Whitelist
**What goes wrong:** Random people can send commands to your Personal AGI
**Why it happens:** Bots are public by default once you have the token
**How to avoid:** Always check `update.effective_user.id` against allowed list
**Warning signs:** Unknown users appearing in logs

### Pitfall 3: Message Length Limits
**What goes wrong:** Long agent responses fail to send
**Why it happens:** Telegram has 4096 char limit per message
**How to avoid:** Chunk long responses, use `telegram.constants.MessageLimit.MAX_TEXT_LENGTH`
**Warning signs:** `BadRequest: Message is too long` errors

### Pitfall 4: Rate Limiting
**What goes wrong:** Bot gets temporarily banned from sending messages
**Why it happens:** Telegram limits ~30 messages/second to same chat
**How to avoid:** Use PTB's built-in rate limiting, batch notifications
**Warning signs:** `RetryAfter` exceptions, 429 errors

### Pitfall 5: Lost Messages on Restart
**What goes wrong:** Messages sent while bot was down are lost
**Why it happens:** Telegram only holds updates for 24 hours
**How to avoid:** Use persistence, handle startup gracefully
**Warning signs:** Users report bot "ignored" their messages
</common_pitfalls>

<code_examples>
## Code Examples

### Creating the Bot (BotFather)
```
1. Open Telegram, search @BotFather
2. Send /newbot
3. Choose name: "Personal AGI" (display name)
4. Choose username: your_agi_bot (must end in 'bot')
5. Save the token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
6. Send /setprivacy → Disable (to receive all messages in groups, optional)
```

### Basic Bot Integration
```python
# Source: python-telegram-bot v22 docs
import asyncio
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters

async def start(update: Update, context):
    await update.message.reply_text("Personal AGI ready. Send me a task!")

async def handle_message(update: Update, context):
    # Get agent from context (stored during setup)
    agent = context.bot_data['agent']
    response = await agent.process_message(update.message.text)
    await update.message.reply_text(response)

def main():
    app = Application.builder().token(BOT_TOKEN).build()
    app.bot_data['agent'] = PersonalAGI()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    app.run_polling()
```

### Chunking Long Responses
```python
# Source: Community pattern
from telegram.constants import MessageLimit

async def send_long_message(update: Update, text: str):
    max_len = MessageLimit.MAX_TEXT_LENGTH
    for i in range(0, len(text), max_len):
        chunk = text[i:i + max_len]
        await update.message.reply_text(chunk)
```

### User Whitelist Pattern
```python
# Source: Best practice
ALLOWED_USERS = [123456789]  # Your Telegram user ID

async def handle_message(update: Update, context):
    if update.effective_user.id not in ALLOWED_USERS:
        await update.message.reply_text("Unauthorized.")
        return
    # ... process message
```
</code_examples>

<mcp_alternatives>
## MCP Server Options (Not Recommended for This Use Case)

For reference, these MCP servers exist but add unnecessary complexity for simple messaging:

### Option 1: chigwell/telegram-mcp (Python/Telethon)
- **What:** Full Telegram access via personal account
- **Pros:** Complete feature set (groups, channels, reactions)
- **Cons:** Requires personal account auth, complex session management
- **Use when:** Need full Telegram features beyond bot API

### Option 2: claude-telegram-bridge (Node.js)
- **What:** Two-way bridge with message queuing
- **Pros:** Built for Claude, has Q&A flow
- **Cons:** Node.js (separate runtime), adds middleware layer
- **Use when:** Need multi-project support with queuing

### Option 3: Direct integration (Recommended)
- **What:** python-telegram-bot in our Python codebase
- **Pros:** Simple, no middleware, full control
- **Cons:** Must implement ourselves (but it's straightforward)
- **Use when:** Personal AGI with single owner (our case)

**Decision:** Direct integration is best for our use case. MCP servers add latency and complexity for no benefit when we control both the agent and the bot.
</mcp_alternatives>

<sota_updates>
## State of the Art (2025)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PTB sync (v13) | PTB async (v20+) | 2022 | Must use async/await everywhere |
| Polling only | Webhooks preferred | Always | Webhooks more efficient at scale |
| Manual rate limiting | Built-in JobQueue | v20+ | Easier scheduled tasks |

**New tools/patterns to consider:**
- **PTB v22.5:** Latest stable, Python 3.10-3.14 support
- **Inline keyboards:** For interactive task management
- **Webhook mode:** For production with proper domain/SSL

**Deprecated/outdated:**
- **PTB v13 sync API:** Must migrate to async v20+
- **Telepot library:** Abandoned, don't use
- **Manual polling loops:** Use PTB's Updater
</sota_updates>

<open_questions>
## Open Questions

1. **Webhook vs Polling for 24/7 daemon?**
   - What we know: Webhooks more efficient but need public URL
   - What's unclear: Do we need webhook for local machine?
   - Recommendation: Start with polling, switch to webhook if deploying to server

2. **Persistence for message history?**
   - What we know: PTB supports persistence backends
   - What's unclear: Do we need conversation history across restarts?
   - Recommendation: Start without, add if needed later
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- [python-telegram-bot docs](https://docs.python-telegram-bot.org/) - v22.5 API reference
- [Telegram Bot API](https://core.telegram.org/bots/api) - Official API documentation

### Secondary (MEDIUM confidence)
- [chigwell/telegram-mcp](https://github.com/chigwell/telegram-mcp) - MCP server reference
- [claude-telegram-bridge](https://github.com/RichardDillman/claude-telegram-bridge) - Architecture patterns

### Tertiary (LOW confidence - needs validation)
- Various Medium articles on bot best practices
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Telegram Bot API via python-telegram-bot
- Ecosystem: MCP servers, bridges, direct integration
- Patterns: Async bot, user whitelist, message chunking
- Pitfalls: Rate limits, message length, blocking handlers

**Confidence breakdown:**
- Standard stack: HIGH - python-telegram-bot is industry standard
- Architecture: HIGH - patterns from official docs
- Pitfalls: HIGH - documented in PTB wiki
- Code examples: HIGH - from official documentation

**Research date:** 2025-01-12
**Valid until:** 2025-02-12 (30 days - PTB ecosystem stable)
</metadata>

---

*Phase: 02-communication*
*Research completed: 2025-01-12*
*Ready for planning: yes*
