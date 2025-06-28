from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from telethon.tl.types import User, Chat, Channel
from .. import database, models
from .client import get_client_for_user
from ..auth import get_current_user

router = APIRouter()

@router.get("/telegram/chats")
async def get_chats(user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    try:
        client = get_client_for_user(user.id, db)
        await client.connect()

        if not await client.is_user_authorized():
            raise HTTPException(status_code=401, detail="Telegram not authorized")

        chats = await client.get_dialogs()
        result = []

        for dialog in chats:
            entity = dialog.entity
            if isinstance(entity, (User, Chat, Channel)):
                result.append({
                    "id": entity.id,
                    "title": getattr(entity, 'title', f"{getattr(entity, 'first_name', '')} {getattr(entity, 'last_name', '')}".strip()),
                    "type": entity.__class__.__name__.lower()
                })

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/telegram/chats/{chat_id}/messages")
async def get_messages(
    chat_id: int,
    limit: int = 50,
    user: models.User = Depends(get_current_user),
    db: Session = Depends(database.get_db)
):
    try:
        client = get_client_for_user(user.id, db)
        await client.connect()

        if not await client.is_user_authorized():
            raise HTTPException(status_code=401, detail="Telegram not authorized")

        messages = await client.get_messages(chat_id, limit=limit)

        return [
            {
                "id": m.id,
                "message": m.message,
                "date": m.date.isoformat() if m.date else None,
                "from_id": getattr(m.from_id, 'user_id', None) if m.from_id else None
            }
            for m in messages if isinstance(m, Message)
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 