"""Entry point for Personal AGI agent."""
import asyncio
import signal
import sys
import anyio
import structlog
from dotenv import load_dotenv

from src.agent import PersonalAGI
from src.config import validate_config

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.dev.ConsoleRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

log = structlog.get_logger()


class AgentRunner:
    """Manages agent lifecycle with graceful shutdown."""

    def __init__(self):
        self.agent = PersonalAGI()
        self.shutdown_event = asyncio.Event()

    def _setup_signal_handlers(self):
        """Set up signal handlers for graceful shutdown."""
        loop = asyncio.get_event_loop()

        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(
                sig,
                lambda s=sig: asyncio.create_task(self._handle_shutdown(s))
            )

    async def _handle_shutdown(self, sig):
        """Handle shutdown signal gracefully."""
        log.info("shutdown_signal_received", signal=sig.name)
        self.shutdown_event.set()
        await self.agent.stop()

    async def run_interactive(self):
        """Run in interactive mode for testing."""
        await self.agent.start()
        log.info("interactive_mode_started", hint="Type messages, Ctrl+C to exit")

        while not self.shutdown_event.is_set():
            try:
                # Simple input loop for testing
                user_input = await anyio.to_thread.run_sync(
                    lambda: input("\nYou: ")
                )

                if user_input.lower() in ("exit", "quit", "q"):
                    break

                if not user_input.strip():
                    continue

                response = await self.agent.process_message(user_input)
                print(f"\nAgent: {response}")

            except EOFError:
                break
            except KeyboardInterrupt:
                break

        await self.agent.stop()

    async def run_daemon(self):
        """Run in daemon mode (for Supervisor)."""
        self._setup_signal_handlers()
        await self.agent.start()
        log.info("daemon_mode_started")

        # Wait for shutdown signal
        await self.shutdown_event.wait()

        log.info("daemon_shutting_down")


async def main():
    """Main entry point."""
    load_dotenv()

    # Validate configuration
    if not validate_config():
        log.error("config_validation_failed")
        sys.exit(1)

    runner = AgentRunner()

    # Check if running interactively or as daemon
    if sys.stdin.isatty():
        await runner.run_interactive()
    else:
        await runner.run_daemon()


if __name__ == "__main__":
    anyio.run(main)
