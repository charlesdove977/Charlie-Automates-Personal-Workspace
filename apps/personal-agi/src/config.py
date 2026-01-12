"""Configuration management for Personal AGI."""
import os
import shutil
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_OWNER_ID = os.getenv("TELEGRAM_OWNER_ID")

# Google OAuth configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


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


def validate_telegram_config() -> bool:
    """Validate Telegram configuration is present."""
    if not TELEGRAM_BOT_TOKEN:
        print("ERROR: TELEGRAM_BOT_TOKEN not set")
        print("Create a bot via @BotFather and add token to .env")
        return False

    if not TELEGRAM_OWNER_ID:
        print("ERROR: TELEGRAM_OWNER_ID not set")
        print("Get your Telegram user ID and add to .env")
        return False

    try:
        int(TELEGRAM_OWNER_ID)
    except ValueError:
        print("ERROR: TELEGRAM_OWNER_ID must be a number")
        return False

    return True


def validate_google_config() -> bool:
    """Validate Google OAuth configuration is present."""
    if not GOOGLE_CLIENT_ID:
        print("WARNING: GOOGLE_CLIENT_ID not set")
        print("Google Workspace features will be disabled")
        return False

    if not GOOGLE_CLIENT_SECRET:
        print("WARNING: GOOGLE_CLIENT_SECRET not set")
        print("Google Workspace features will be disabled")
        return False

    return True
