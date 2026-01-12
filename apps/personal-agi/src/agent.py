"""Core agent wrapper using ClaudeSDKClient for persistent sessions."""
import asyncio
import json
import os
import re
from pathlib import Path

import anyio
import structlog
from claude_agent_sdk import ClaudeSDKClient, ClaudeAgentOptions
from claude_agent_sdk.types import AssistantMessage, ResultMessage, TextBlock

from .config import validate_google_config

log = structlog.get_logger()

# Project root for loading .mcp.json
PROJECT_ROOT = Path(__file__).parent.parent


class PersonalAGI:
    """Personal AGI agent with persistent session management."""

    def __init__(self, system_prompt: str | None = None):
        self._google_enabled = validate_google_config()
        self.system_prompt = system_prompt or self._default_system_prompt()
        self.client: ClaudeSDKClient | None = None
        self.running = False

    @property
    def google_enabled(self) -> bool:
        """Check if Google Workspace integration is enabled."""
        return self._google_enabled

    def _substitute_env_vars(self, value: str) -> str:
        """Substitute ${VAR} patterns with actual environment variable values."""
        pattern = r'\$\{([^}]+)\}'

        def replace(match):
            var_name = match.group(1)
            return os.environ.get(var_name, '')

        return re.sub(pattern, replace, value)

    def _load_mcp_config(self) -> dict | None:
        """Load MCP configuration from .mcp.json if it exists and Google is configured."""
        if not self._google_enabled:
            log.info("google_disabled", reason="credentials_not_configured")
            return None

        mcp_config_path = PROJECT_ROOT / ".mcp.json"
        if not mcp_config_path.exists():
            log.warning("mcp_config_missing", path=str(mcp_config_path))
            return None

        try:
            with open(mcp_config_path) as f:
                config = json.load(f)

            # Substitute environment variables in the config
            mcp_servers = config.get("mcpServers", {})
            for server_name, server_config in mcp_servers.items():
                if "env" in server_config:
                    for key, value in server_config["env"].items():
                        server_config["env"][key] = self._substitute_env_vars(value)

            log.info("mcp_config_loaded", servers=list(mcp_servers.keys()))
            return mcp_servers

        except json.JSONDecodeError as e:
            log.error("mcp_config_invalid", error=str(e))
            return None
        except Exception as e:
            log.error("mcp_config_error", error=str(e))
            return None

    def _default_system_prompt(self) -> str:
        base_prompt = """You are a personal AGI assistant. Your job is to:
1. Complete tasks autonomously when possible
2. Ask clarifying questions when needed
3. Report back on task completion
4. Be proactive about identifying what you can help with

You have access to tools for reading files, running commands, and searching.
Use them to accomplish tasks efficiently."""

        if self._google_enabled:
            google_capabilities = """

You also have access to Google Workspace tools:
- Gmail: Search and read emails, send emails on the user's behalf
- Calendar: View and create calendar events, check availability
- Drive: Search and read files, access shared documents

Use these tools to help manage the user's digital life efficiently."""
            return base_prompt + google_capabilities

        return base_prompt

    def _get_options(self) -> ClaudeAgentOptions:
        """Configure agent options with appropriate tools and permissions."""
        options = ClaudeAgentOptions(
            allowed_tools=["Read", "Write", "Bash", "Glob", "Grep"],
            permission_mode="acceptEdits",
            system_prompt=self.system_prompt,
        )

        # Add MCP servers if Google is configured
        mcp_servers = self._load_mcp_config()
        if mcp_servers:
            options.mcpServers = mcp_servers
            log.info("mcp_servers_configured", count=len(mcp_servers))

        return options

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
