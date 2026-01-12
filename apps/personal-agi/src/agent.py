"""Core agent wrapper using ClaudeSDKClient for persistent sessions."""
import asyncio
import anyio
import structlog
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
from claude_agent_sdk.types import AssistantMessage, ResultMessage, TextBlock

log = structlog.get_logger()


class PersonalAGI:
    """Personal AGI agent with persistent session management."""

    def __init__(self, system_prompt: str | None = None):
        self.system_prompt = system_prompt or self._default_system_prompt()
        self.client: ClaudeSDKClient | None = None
        self.running = False

    def _default_system_prompt(self) -> str:
        return """You are a personal AGI assistant. Your job is to:
1. Complete tasks autonomously when possible
2. Ask clarifying questions when needed
3. Report back on task completion
4. Be proactive about identifying what you can help with

You have access to tools for reading files, running commands, and searching.
Use them to accomplish tasks efficiently."""

    def _get_options(self) -> ClaudeAgentOptions:
        """Configure agent options with appropriate tools and permissions."""
        return ClaudeAgentOptions(
            allowed_tools=["Read", "Write", "Bash", "Glob", "Grep"],
            permission_mode="acceptEdits",
            system_prompt=self.system_prompt,
        )

    async def start(self) -> None:
        """Start the agent session."""
        self.running = True
        log.info("agent_starting")

    async def stop(self) -> None:
        """Stop the agent gracefully."""
        self.running = False
        log.info("agent_stopping")

    async def process_message(self, message: str) -> str:
        """Process a single message and return the response.

        Uses ClaudeSDKClient context manager for each interaction.
        This is intentional - each message gets fresh context while
        avoiding the overhead of spawning CLI for every query().
        """
        log.info("processing_message", message_preview=message[:50])

        options = self._get_options()
        response_text = ""

        try:
            async with ClaudeSDKClient(options=options) as client:
                await client.query(message)
                async for msg in client.receive_response():
                    if isinstance(msg, AssistantMessage):
                        for block in msg.content:
                            if isinstance(block, TextBlock):
                                response_text += block.text
                    elif isinstance(msg, ResultMessage):
                        if msg.result:
                            response_text = msg.result
                        log.info("task_complete")
        except Exception as e:
            log.error("message_processing_error", error=str(e))
            response_text = f"Error processing message: {e}"

        return response_text
