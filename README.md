<div align="center">

# ReForge AI

Give every discarded item its smartest second life.

<p>
  ReForge AI turns a photo of a discarded item into realistic upcycling ideas by combining object detection, a verified project database, YouTube results, and AI reasoning.
</p>

<p>
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge" alt="Frontend React + Vite" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge" alt="Backend FastAPI" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47a248?style=for-the-badge" alt="Database MongoDB" />
  <img src="https://img.shields.io/badge/AI-Gemini%20%2F%20Groq%20%2F%20OpenRouter-ffb000?style=for-the-badge" alt="AI Gemini Groq OpenRouter" />
  <img src="https://img.shields.io/badge/Auth-JWT-4c7bf0?style=for-the-badge" alt="Auth JWT" />
</p>

</div>

---

## Table of contents

- [Problem statement](#problem-statement)
- [What it does](#what-it-does)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Setup instructions](#setup-instructions)
- [Live deployment link](#live-deployment-link)
- [Demo video link](#demo-video-link)
- [How it works](#how-it-works)

## Problem statement

Many people discard reusable household items because finding a realistic upcycling project that matches their materials, skill level, and available tools takes too much manual effort. ReForge AI reduces that friction by turning a photo into a practical recommendation flow.

## What it does

Users upload a photo of an item, the system detects the visible objects, and an AI agent reasons across a curated verified project database and real YouTube videos to recommend the top 3 realistic projects. Each recommendation includes missing materials, step-by-step guidance, difficulty, safety notes, and estimated environmental impact such as waste diverted and CO2 saved.

## Key features

- Photo-based object detection from uploaded images
- Hybrid matching that combines a verified knowledge base with YouTube-based project suggestions
- LangChain-based AI agent for reasoning over detected items, recommendations, and user context
- Personalization from like/dislike feedback so recommendations can improve over time
- Multi-provider AI fallback flow: Gemini → Groq → OpenRouter for reliability
- JWT-based authentication for sign up, login, and protected analysis requests
- Environmental impact estimation for waste diversion and CO2 savings

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, React Hot Toast, Lucide icons |
| Backend | FastAPI, Uvicorn, Pydantic, Python, Requests |
| Database | MongoDB, PyMongo |
| AI/ML | LangChain, Google Generative AI, Gemini, Groq, OpenRouter |
| Auth | JWT, bcrypt, python-jose |

## Project structure

```text
client/                # React frontend
  src/                 # pages, components, API helpers, auth logic
server/                # FastAPI backend
  agents/              # matching agent and tool integrations
  controllers/         # request handlers
  db/                  # MongoDB connection and repositories
  models/              # request/response schemas
  routers/             # API endpoints
  services/            # AI, matching, impact, YouTube, auth services
```

## Setup instructions

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- A MongoDB Atlas account or another MongoDB instance
- API keys for:
  - Gemini
  - Groq
  - OpenRouter
  - YouTube Data API v3

### Environment variables

Create a `.env` file inside the `server` directory with the variables below.

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string used by the backend to connect to the `reforge_ai` database |
| `YOUTUBE_API_KEY` | Yes for YouTube matching | YouTube Data API v3 key used to search for relevant DIY videos |
| `GEMINI_API_KEY` | Yes for Gemini fallback path | Primary Gemini API key used by the AI services |
| `GEMINI_API_KEY_2` | Optional | Secondary Gemini API key used as a backup |
| `GROQ_API_KEY` | Optional | Groq API key used as a fallback provider |
| `OPENROUTER_API_KEY` | Optional | OpenRouter API key used as a fallback provider |
| `JWT_SECRET_KEY` | Optional | Secret used to sign JWT tokens; defaults to a development-only value if not set |

Example:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>
YOUTUBE_API_KEY=your_youtube_data_api_key
GEMINI_API_KEY=your_gemini_key
GEMINI_API_KEY_2=your_backup_gemini_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
JWT_SECRET_KEY=change-this-in-production
```

### Backend setup

```bash
cd server
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

If your local setup includes a migration helper, run it once before using the knowledge-base-backed matching flow:

```bash
python scripts/migrate_kb_to_mongo.py
```

If that script is not available in your checkout, make sure your MongoDB `projects` collection is populated before running the matching flow, because the backend reads project data from MongoDB.

Then start the API:

```bash
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`.

### Frontend setup

```bash
cd client
npm install
npm run dev
```

Create a `client/.env` file if you want to override the API base URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The frontend will run on `http://localhost:5173`.

> For local development, run both the backend and frontend at the same time.

## Live deployment link

https://reforge-ai-one.vercel.app/

## Demo video link

[ADD YOUR DEMO VIDEO LINK HERE]

## How it works

1. The user uploads a photo of an item.
2. The backend sends that image to the vision-capable LLM for object detection.
3. The matching agent decides which tools to use: search the knowledge base, search YouTube, estimate environmental impact, and check user preferences.
4. The system returns ranked recommendations with steps, missing materials, difficulty, safety notes, and impact estimates.
