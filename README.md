# LubriExpert AI 🛢️

> **AI-Powered Bilingual Lubrication Expert** — Automotive • Industrial • Machinery • Grease

LubriExpert AI is a production-quality, bilingual (Arabic/English) AI chatbot specialized in automotive oils, industrial lubricants, and machinery lubrication. Built on Angular 22 + Node.js/Express + TypeScript with full RTL support, dark/light mode, and a clean architecture ready for Phase 2 RAG integration.

---

## Architecture

```
lubriexpert-ai/
├── frontend/          # Angular 22 SPA (standalone components, SCSS, RTL)
│   └── src/app/
│       ├── models/          # TypeScript interfaces
│       ├── services/        # ChatService, ConversationService, LanguageService, ThemeService
│       ├── shared/
│       │   └── components/  # Header, Message, TypingIndicator, QuickActions, Switchers
│       └── pages/
│           ├── chat/        # ChatPage, ChatWindow, ChatInput, Sidebar
│           └── settings/    # SettingsPage
│
├── backend/           # Node.js + Express + TypeScript REST API
│   └── src/
│       ├── config/          # environment.ts, ai-system-prompt.ts
│       ├── models/          # types.ts
│       ├── services/        # AIService, ConversationService, KnowledgeBaseService
│       │   └── providers/   # OpenAIProvider (pluggable)
│       ├── controllers/     # chat.controller.ts
│       ├── routes/          # chat.routes.ts, health.routes.ts
│       └── middleware/      # validation, error-handler, rate-limiter
│
├── .env.example       # Environment variable template
├── .gitignore
└── README.md
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 22, TypeScript, SCSS, Standalone Components |
| Backend | Node.js, Express.js, TypeScript |
| AI | OpenAI-compatible API (configurable) |
| Markdown | marked |
| Security | Helmet, CORS, express-rate-limit, express-validator |
| State | Angular Signals + localStorage |

---

## Quick Start

### 1. Clone and configure environment

```bash
# Copy the environment template
cp .env.example .env
```

Edit `.env` and add your AI API key:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
AI_PROVIDER=openai
AI_API_KEY=sk-your-api-key-here
AI_MODEL=gpt-4o
AI_BASE_URL=https://api.openai.com/v1
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend starts at: `http://localhost:3000`

Health check: `http://localhost:3000/api/health`

### 3. Start the Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend available at: `http://localhost:4200`

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Backend server port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `FRONTEND_URL` | No | `http://localhost:4200` | Frontend URL for CORS |
| `AI_PROVIDER` | No | `openai` | AI provider (`openai` or any OpenAI-compatible) |
| `AI_API_KEY` | **Yes** | — | Your AI API key |
| `AI_MODEL` | No | `gpt-4o` | Model name |
| `AI_BASE_URL` | No | `https://api.openai.com/v1` | API base URL |

> ⚠️ **Never commit your `.env` file.** It is in `.gitignore`.

---

## API Endpoints

### `POST /api/chat`

Send a message and receive an AI response.

**Request:**
```json
{
  "message": "What engine oil should I use?",
  "conversationId": "optional-uuid",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "message": {
    "role": "assistant",
    "content": "To recommend the right engine oil, I need a few details..."
  },
  "conversationId": "uuid-v4"
}
```

### `DELETE /api/conversations/:conversationId`

Remove a conversation from server memory.

### `GET /api/health`

Returns server status and AI configuration state.

---

## AI Configuration

The backend supports any **OpenAI-compatible API**:

| Provider | `AI_BASE_URL` | `AI_MODEL` |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o`, `gpt-4`, `gpt-3.5-turbo` |
| Azure OpenAI | `https://your-resource.openai.azure.com/openai/deployments/your-deployment` | `gpt-4o` |
| Groq | `https://api.groq.com/openai/v1` | `llama3-70b-8192` |
| Ollama (local) | `http://localhost:11434/v1` | `llama3.2` |
| LM Studio (local) | `http://localhost:1234/v1` | depends on model |

---

## Features (Phase 1)

- ✅ Real AI responses — bilingual Arabic/English
- ✅ Egyptian Arabic support
- ✅ Full RTL layout for Arabic
- ✅ Dark / Light mode
- ✅ Conversation context (multi-turn)
- ✅ Conversation sidebar with history
- ✅ 6 quick action chips
- ✅ Markdown rendering in AI responses
- ✅ Copy / Regenerate / Feedback on messages
- ✅ Animated typing indicator
- ✅ Responsive — mobile/tablet/desktop
- ✅ API key security (never exposed to frontend)
- ✅ Input validation & rate limiting
- ✅ Friendly bilingual error messages
- ✅ Settings page (language, theme, about)

---

## Future Roadmap

| Phase | Feature |
|---|---|
| Phase 2 | RAG — Vector database integration |
| Phase 3 | Mobil / ExxonMobil knowledge base |
| Phase 4 | Product database |
| Phase 5 | Vehicle compatibility database |
| Phase 6 | Industrial equipment database |
| Phase 7 | Voice AI |
| Phase 8 | Image analysis |
| Phase 9 | PDF / data sheet analysis |
| Phase 10 | Admin dashboard |

The codebase is architected for these extensions:
- `KnowledgeBaseService` (backend) → plug in vector DB
- `AIProvider` interface → swap AI providers without changing business logic
- Angular lazy-loaded routes → add new pages without refactoring

---

## Security Notes

- API keys are **only** in backend `.env` — never sent to frontend
- All user input is validated before reaching the AI
- Helmet security headers on all responses
- CORS restricted to configured `FRONTEND_URL`
- Rate limiting: 30 req/min per IP on `/api/chat`
- Request body size limited to 10KB
- Stack traces never exposed to clients in production

---

## Project Structure Details

```
backend/src/
├── config/
│   ├── environment.ts          # Typed env vars loader
│   └── ai-system-prompt.ts     # Full lubrication expert system prompt
├── models/
│   └── types.ts                # AIMessage, ConversationContext, ChatRequest/Response
├── services/
│   ├── ai-provider.interface.ts # Pluggable provider interface
│   ├── ai.service.ts           # Orchestrates AI calls with system prompt
│   ├── conversation.service.ts  # In-memory conversation context
│   ├── knowledge-base.service.ts # RAG placeholder (Phase 2)
│   └── providers/
│       └── openai.provider.ts  # OpenAI-compatible implementation
├── controllers/
│   └── chat.controller.ts
├── routes/
│   ├── chat.routes.ts
│   └── health.routes.ts
├── middleware/
│   ├── validation.ts           # express-validator rules
│   ├── error-handler.ts        # Global error handler (no leaks)
│   └── rate-limiter.ts         # Per-IP rate limits
├── app.ts                      # Express app factory
└── server.ts                   # Entry point
```
