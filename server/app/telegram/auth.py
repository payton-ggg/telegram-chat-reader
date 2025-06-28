from fastapi import APIRouter, Depends, HTTPException
from telethon.sync import TelegramClient
from telethon.sessions import StringSession
from .client import API_ID, API_HASH
from .. import models, database
from pydantic import BaseModel
from sqlalchemy.orm import Session
from telethon.errors import SessionPasswordNeededError
from ..auth import get_current_user, get_db

router = APIRouter()

class PhoneInput(BaseModel):
    phone: str

class CodeInput(BaseModel):
    phone: str
    code: str
    password: str | None = None

@router.post("/telegram/send-code")
async def send_code(data: PhoneInput, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    session_record = db.query(models.TelegramSession).filter_by(user_id=user.id).first()
    if session_record:
        db.delete(session_record)
        db.commit()

    client = TelegramClient(StringSession(), API_ID, API_HASH)
    await client.connect()

    # Отримуємо код і хеш
    sent = await client.send_code_request(data.phone)

    session_record = models.TelegramSession(
        user_id=user.id,
        session_string=client.session.save(),
        phone_code_hash=sent.phone_code_hash
    )
    db.add(session_record)
    db.commit()

    return {"msg": "Code sent"}



@router.post("/telegram/sign-in")
async def sign_in(data: CodeInput, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    session_record = db.query(models.TelegramSession).filter_by(user_id=user.id).first()
    if not session_record:
        raise HTTPException(status_code=400, detail="No Telegram session found")

    client = TelegramClient(StringSession(session_record.session_string), API_ID, API_HASH)
    await client.connect()

    try:
        await client.sign_in(
            phone=data.phone,
            code=data.code,
            phone_code_hash=session_record.phone_code_hash
        )
    except SessionPasswordNeededError:
        if not data.password:
            raise HTTPException(status_code=401, detail="2FA password required")
        try:
            await client.sign_in(password=data.password)
        except Exception as e:
            raise HTTPException(status_code=401, detail="2FA password incorrect")
    except Exception as e:
        print("Telegram sign-in error:", e)
        raise HTTPException(status_code=401, detail="Failed to authorize Telegram session")

    # Успішно залогінились
    session_record.session_string = client.session.save()
    session_record.phone_code_hash = None
    db.commit()

    return {"msg": "Telegram session authorized"}



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
