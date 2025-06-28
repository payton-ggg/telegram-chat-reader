from telethon import TelegramClient
import os

API_ID = int(os.getenv("TELEGRAM_API_ID"))
API_HASH = os.getenv("TELEGRAM_API_HASH")

def create_client(session_name: str) -> TelegramClient:
    return TelegramClient(
        session=f"app/telegram/session_store/{session_name}",
        api_id=API_ID,
        api_hash=API_HASH
    )
