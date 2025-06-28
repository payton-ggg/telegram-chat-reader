from fastapi import APIRouter, Depends, HTTPException
from telethon.sync import TelegramClient
from telethon.sessions import StringSession
from .client import API_ID, API_HASH
from .. import models, database
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..auth import get_current_user

router = APIRouter()

class PhoneInput(BaseModel):
    phone: str

class CodeInput(BaseModel):
    phone: str
    code: str

@router.post("/telegram/send-code")
async def send_code(data: PhoneInput, user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    client = TelegramClient(StringSession(), API_ID, API_HASH)
    await client.connect()
    await client.send_code_request(data.phone)
    db.add(models.TelegramSession(user_id=user.id, session_string=client.session.save()))
    db.commit()
    return {"msg": "Code sent"}

@router.post("/telegram/sign-in")
async def sign_in(data: CodeInput, user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    session_record = db.query(models.TelegramSession).filter_by(user_id=user.id).first()
    if not session_record:
        raise HTTPException(status_code=400, detail="No Telegram session started")

    client = TelegramClient(StringSession(session_record.session_string), API_ID, API_HASH)
    await client.connect()

    try:
        await client.sign_in(data.phone, code=data.code)
        session_record.session_string = client.session.save()
        db.commit()
        return {"msg": "Telegram session authorized"}
    except Exception:
        raise HTTPException(status_code=401, detail="Failed to authorize Telegram session")

@router.post("/telegram/logout")
async def telegram_logout(user: models.User = Depends(get_current_user), db: Session = Depends(database.get_db)):
    session_record = db.query(models.TelegramSession).filter_by(user_id=user.id).first()
    if not session_record:
        raise HTTPException(status_code=400, detail="No session to logout")

    client = TelegramClient(StringSession(session_record.session_string), API_ID, API_HASH)
    await client.connect()
    await client.log_out()

    db.delete(session_record)
    db.commit()
    return {"msg": "Logged out and session removed"}
