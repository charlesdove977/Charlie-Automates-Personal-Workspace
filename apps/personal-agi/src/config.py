"""Configuration management for Personal AGI."""
import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


def validate_config() -> bool:
    """Validate required configuration is present."""
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set")
        print("Copy .env.example to .env and add your API key")
        return False
    return True
