"""Configuration management for Personal AGI."""
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


def validate_config() -> bool:
    """Validate required configuration is present."""
    # Check if Claude Code CLI is available (for Max subscribers)
    claude_available = shutil.which("claude") is not None

    if not ANTHROPIC_API_KEY and not claude_available:
        print("ERROR: No authentication found")
        print("Either:")
        print("  1. Set ANTHROPIC_API_KEY in .env file, OR")
        print("  2. Authenticate with Claude Code (claude auth)")
        return False

    if not ANTHROPIC_API_KEY:
        print("Note: Using Claude Code authentication (Max subscription)")

    return True
