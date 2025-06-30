# Telegram Chat Viewer

Веб-застосунок для авторизованого перегляду чатів і повідомлень з Telegram через ваш акаунт.

---

## Стек технологій

### Frontend (Next.js)
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- React Hook Form + Zod

### Backend (FastAPI)
- FastAPI
- Telethon (Telegram API)
- PostgreSQL (Neon)
- SQLAlchemy
- JWT (OAuth2)
- Pydantic

---

## Функціонал

- Логін / реєстрація з JWT
- Підключення до Telegram (2FA підтримується)
- Перегляд списку чатів
- Перегляд повідомлень у чаті
- Вихід з Telegram та з системи
- Захист приватних маршрутів

---

## 🏁 Запуск

### Сервер

```bash
cd server
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Також потібно налаштувати .env файл

```.env
DATABASE_URL=
SECRET_KEY=
TELEGRAM_API_ID=
TELEGRAM_API_HASH=
```

### Клієнт
```bash
cd client
npm install
npm run dev
```

