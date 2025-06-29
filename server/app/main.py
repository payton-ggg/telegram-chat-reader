from fastapi import FastAPI
from . import models, database, auth
from fastapi.middleware.cors import CORSMiddleware
from app.telegram import auth as telegram_auth
from app.telegram import chats as telegram_chats

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://telegram-chat-reader-plato.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(telegram_auth.router)
app.include_router(telegram_chats.router)

