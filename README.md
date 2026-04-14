# BattleArena

BattleArena is an AI-powered full-stack application that provides an interactive arena for pitting different Large Language Models (LLMs) against each other. It includes real-time streaming of AI responses, side-by-side code diffs, and a modern chat interface.

## 🚀 Features

- **Multi-Model LLM Arena**: Compare responses from top-tier AI models including OpenAI, Google Gemini, Mistral, and Cohere.
- **Real-Time Streaming**: Native Server-Sent Events (SSE) support for streaming AI responses as they are generated.
- **Rich User Interface**:
  - Interactive markdown rendering with syntax highlighting.
  - Side-by-side or tabbed visual diffing for code.
  - Modern chat experience with context-aware prompts.
- **Authentication**: Secure JWT-based authentication and Google OAuth 2.0 via Passport.js.
- **Robust Architecture**: LangChain integration (`@langchain/langgraph`) on the backend for orchestrating complex AI workflows.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM (v7)
- **State Management**: React Context API (Auth, Theme, Arena)
- **Networking**: Axios & Native EventSource
- **Markdown Processing**: React Markdown + remark-gfm + highlight.js

### Backend
- **Core**: Node.js + Express + TypeScript
- **AI / Agentic Logic**: LangChain, LangGraph (@langchain/openai, google, mistralai, cohere)
- **Database**: MongoDB (Mongoose) + Redis (ioredis)
- **Authentication**: Passport.js (Google OAuth20) + JSON Web Tokens (JWT) + bcryptjs
- **Validation**: express-validator + Zod
- **Development**: `tsx` for hot-reloading

## 📁 Project Structure

```
BattelArena/
├── backend/
│   ├── src/
│   │   ├── app.ts          # Express setup & middleware
│   │   ├── config/         # Environment & connection logic
│   │   ├── controllers/    # API Request handlers (AI streaming, etc.)
│   │   ├── middlewares/    # Custom guards & auth middleware
│   │   ├── models/         # Mongoose schemas (e.g., User)
│   │   ├── routes/         # API Routing (ai.routes.ts, user.routes.ts)
│   │   ├── services/       # Core business logic (langGraph workflow)
│   │   └── validator/      # Request bodily validations using Zod
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── app/            # System & App roots (App.jsx, main.jsx)
    │   ├── assets/         # Static global assets
    │   ├── components/     # Standalone accessible components
    │   ├── features/       # Feature-driven modules (AI, Auth)
    │   │   ├── ai/         # Arena dashboard, Chat interfaces, SSE Context
    │   │   └── auth/       # Login, Register, Theme Context, Protected Routes
    │   └── utils/          # Common application helpers
    ├── vite.config.ts
    ├── tailwind.config.js
    └── package.json
```

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB
- Redis server
- API Keys for the respective AI providers you wish to run

### 2. Configure Environment Variables

#### Backend (`backend/.env`)
Create an `.env` file in the `backend/` directory with the following variables:
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database & Cache
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string

# Authentication
JWT_SECRET=your_super_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URI=http://localhost:5000/api/v1/auth/google/callback

# AI Providers
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key
COHERE_API_KEY=your_cohere_api_key
```

#### Frontend (`frontend/.env`)
Create an `.env` file in the `frontend/` directory (if you have custom env variables handling base URL):
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### 3. Running the Project

#### Start the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

#### Start the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📜 License
This project is open-source and available under the ISC License.
