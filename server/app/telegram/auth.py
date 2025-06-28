from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from .client import create_client

router = APIRouter()

class PhoneInput(BaseModel):
    phone: str

class CodeInput(BaseModel):
    phone: str
    code: str

@router.post("/telegram/send-code")
async def send_code(data: PhoneInput):
    client = create_client(session_name=data.phone)
    await client.connect()
    if await client.is_user_authorized():
        return {"msg": "Already authorized"}

    await client.send_code_request(data.phone)
    return {"msg": "Code sent"}

@router.post("/telegram/sign-in")
async def sign_in(data: CodeInput):
    client = create_client(session_name=data.phone)
    await client.connect()
    try:
        await client.sign_in(phone=data.phone, code=data.code)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authorization failed")
    return {"msg": "Authorized"}

@router.post("/telegram/logout")
async def logout(data: PhoneInput):
    client = create_client(session_name=data.phone)
    await client.connect()
    await client.log_out()
    return {"msg": "Logged out"}
