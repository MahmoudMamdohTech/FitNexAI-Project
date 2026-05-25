# FitNex AI — Smart Fitness & Nutrition Platform

AI-powered fitness and nutrition planning, featuring real-time exercise form correction, personalized meal plans, and a premium dark-mode dashboard.

## Features

- **AI Exercise Coach** — Real-time pose analysis via MediaPipe with rep counting and form correction feedback.
- **Smart Meal Planning** — Auto-generated daily meal plans (breakfast, lunch, dinner, snacks) based on your macros and goals.
- **Personalized Dashboard** — Track calories, protein, carbs, and fats at a glance.
- **Multi-step Onboarding** — Tailored setup based on your body stats, activity level, and fitness goals.
- **JWT Authentication** — Signup, login, email OTP verification, and password reset.
- **Premium UI** — Dark-mode aesthetic with neon accents, smooth animations, and fully responsive layouts.

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 19, Vite, Vanilla CSS             |
| Backend    | FastAPI, SQLAlchemy, Pydantic            |
| Database   | Supabase (PostgreSQL)                    |
| AI/CV      | MediaPipe Pose Landmarker, OpenCV        |
| Auth       | JWT (python-jose), bcrypt               |
| Email      | Nodemailer via Vercel Serverless Proxy   |
| Deployment | Vercel (frontend), Render/Railway (API)  |

## Getting Started

### Prerequisites

- Python 3.10+

### 1. Frontend

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:8000
```

### 2. Backend

```bash
cd python_services

# Create virtual environment (recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download the MediaPipe model (~9 MB, one-time)
python setup_model.py

# Start the API server
python -m uvicorn main:app --reload --port 8000
```

Create a `.env` file in `python_services/`:
```
DATABASE_URL=postgresql+asyncpg://...your-supabase-url...
JWT_SECRET=your-secret-key
JWT_EXPIRE_HOURS=72
ALLOWED_ORIGINS=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

> **Note on Emails:** During local development (`FRONTEND_URL=http://localhost:5173`), emails (OTP codes) are simply printed to your Python terminal to save you the hassle of setting up local SMTP. In production, the backend sends a request to the frontend's Vercel Serverless Function (`/api/send-email`), which uses Nodemailer and requires `SMTP_USER` and `SMTP_PASS` to be configured in your Vercel Dashboard.

See `.env.example` (root) and `python_services/.env.example` for full reference.
