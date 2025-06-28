from telethon import TelegramClient
from telethon.sessions import StringSession
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, database


import os

API_ID = int(os.getenv("TELEGRAM_API_ID"))
API_HASH = os.getenv("TELEGRAM_API_HASH")

def get_client_for_user(user_id: int, db: Session = Depends(get_db)) -> TelegramClient:
    session_record = db.query(models.TelegramSession).filter(models.TelegramSession.user_id == user_id).first()
    if not session_record:
        raise Exception("User does not have Telegram session")
    
    session = StringSession(session_record.session_string)
    return TelegramClient(session, API_ID, API_HASH)
