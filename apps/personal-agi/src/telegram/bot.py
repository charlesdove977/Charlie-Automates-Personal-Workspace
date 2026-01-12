"""Telegram bot wrapper for Personal AGI agent."""
import structlog
from telegram import Update
from telegram.constants import MessageLimit
from telegram.ext import Application, CommandHandler, MessageHandler, filters

from src.agent import PersonalAGI
from src.config import TELEGRAM_BOT_TOKEN, TELEGRAM_OWNER_ID

log = structlog.get_logger()


class TelegramBot:
    """Telegram bot that interfaces with PersonalAGI agent."""

    def __init__(self, agent: PersonalAGI):
        self.agent = agent
        self.owner_id = int(TELEGRAM_OWNER_ID) if TELEGRAM_OWNER_ID else None
        self.app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
        self._setup_handlers()

    def _setup_handlers(self):
        """Register message handlers."""
        self.app.add_handler(CommandHandler("start", self._handle_start))
        self.app.add_handler(CommandHandler("status", self._handle_status))
        self.app.add_handler(
            MessageHandler(filters.TEXT & ~filters.COMMAND, self._handle_message)
        )

    def _is_authorized(self, user_id: int) -> bool:
        """Check if user is authorized to use the bot."""
        return user_id == self.owner_id

    async def _handle_start(self, update: Update, context) -> None:
        """Handle /start command."""
        user_id = update.effective_user.id
        if not self._is_authorized(user_id):
            log.warning("unauthorized_start", user_id=user_id)
            await update.message.reply_text("Unauthorized.")
            return

        log.info("bot_started", user_id=user_id)
        await update.message.reply_text(
            "Personal AGI ready. Send me a message or task!"
        )

    async def _handle_status(self, update: Update, context) -> None:
        """Handle /status command."""
        if not self._is_authorized(update.effective_user.id):
            await update.message.reply_text("Unauthorized.")
            return

        status = "running" if self.agent.running else "stopped"
        await update.message.reply_text(f"Agent status: {status}")

    async def _handle_message(self, update: Update, context) -> None:
        """Handle incoming text messages."""
        user_id = update.effective_user.id
        if not self._is_authorized(user_id):
            log.warning("unauthorized_message", user_id=user_id)
            return  # Silent ignore for non-owners

        message_text = update.message.text
        log.info("received_message", user_id=user_id, preview=message_text[:50])

        # Send typing indicator while processing
        await update.message.chat.send_action("typing")

        try:
            response = await self.agent.process_message(message_text)
            await self._send_response(update, response)
        except Exception as e:
            log.error("message_error", error=str(e))
            await update.message.reply_text(f"Error: {e}")

    async def _send_response(self, update: Update, text: str) -> None:
        """Send response, chunking if necessary."""
        max_len = MessageLimit.MAX_TEXT_LENGTH

        if len(text) <= max_len:
            await update.message.reply_text(text)
            return

        # Chunk long responses
        for i in range(0, len(text), max_len):
            chunk = text[i:i + max_len]
            await update.message.reply_text(chunk)

    async def send_notification(self, message: str) -> None:
        """Send proactive notification to owner."""
        if self.owner_id:
            await self.app.bot.send_message(
                chat_id=self.owner_id,
                text=message
            )

    async def start(self) -> None:
        """Initialize and start the bot."""
        await self.app.initialize()
        await self.app.start()
        await self.app.updater.start_polling()
        log.info("telegram_bot_started")

    async def stop(self) -> None:
        """Stop the bot gracefully."""
        await self.app.updater.stop()
        await self.app.stop()
        await self.app.shutdown()
        log.info("telegram_bot_stopped")
