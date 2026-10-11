# NEXORA AI

NEXORA AI is a premium AI research and knowledge discovery platform that combines the intelligence of advanced language models with live web searching and YouTube video analysis.

## Core Features
1. **Live Web Research Engine**: Fast and Deep research modes using Tavily's search API and Google Gemini 3.6 Flash.
2. **YouTube Video Summarization**: Extracts metadata, transcripts, and synthesizes key takeaways, chapter-wise summaries, and actionable insights.
3. **Interactive Follow-ups**: Seamlessly ask follow-up questions contextually bound to the video transcript or the web research results.
4. **Admin Dashboard**: Tracks aggregate system usage, API token expenditure, and provider configuration status.
5. **Polished Workspace UI**: Built with React, Vite, and Lucide icons, featuring dark mode by default, glassmorphic UI elements, interactive citations, and Markdown exporting.

---

## Architecture Overview
- **Frontend**: React 18, React Router, Vite. Custom CSS using CSS variables (no external UI libraries to keep bundle size light and bespoke).
- **Backend**: Express (Node.js), TypeScript.
- **Database**: Prisma ORM (configured for SQLite by default for portability, easily switchable to PostgreSQL).
- **Authentication**: JWT-based stateless authentication.
- **Security**: Helmet, Express Rate Limiting, CORS.
- **AI Integration**: `@google/generative-ai` (Gemini SDK) abstracted via a `LLMProvider` factory pattern.

### Limitations & Known Issues
- **YouTube Transcripts**: The system currently uses `youtube-transcript`. Videos without captions, age-restricted videos, or videos with disabled transcripts will return an explicit error.
- **Search Context Size**: Extreme `Deep Research` queries may exceed context windows if source documents are unusually large. The backend aggressively truncates individual sources to ~50k characters to prevent this.
- **Prisma in Demo Mode**: If the local database is not initialized (`npx prisma db push`), the app gracefully falls back to mock logic, bypassing actual data writes.

---

## 🚀 Quick Start & Local Setup

Anyone downloading or cloning this repository can run it locally in under 2 minutes:

### 1. Clone & Install
```bash
git clone https://github.com/viryber-hue/Nexora.git
cd Nexora
npm install
```

### 2. Configure Environment Variables
Copy the provided template to create your local `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in your keys (both services have generous free tiers):
- **`GEMINI_API_KEY`**: Grab your free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
- **`TAVILY_API_KEY`**: Grab your free search key at [Tavily](https://tavily.com/) (1,000 free searches/mo).

### 3. Initialize Prisma (Optional)
```bash
npx prisma generate
```
> **Note**: The application includes seamless fallback mock handling, so you can test immediately even without a database file configured!

### 4. Run the Full Stack
```bash
npm run dev
```
- **Web Interface**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:3001](http://localhost:3001)

### 5. Running Tests & Quality Checks
```bash
npm test         # Run Vitest test suite
npm run lint     # Fast linter with oxlint
npm run build    # Production build verification
```

---

## Deployment Instructions

### 1. Database (PostgreSQL recommended)
Before deploying, change the Prisma provider in `prisma/schema.prisma` from `sqlite` to `postgresql`. Run `npx prisma generate`.

### 2. Frontend Deployment (e.g., Vercel / Netlify)
Set the root directory to the repo root and the build command to `npm run build`. 
**Important**: You must inject `VITE_API_URL` during build if the backend is hosted separately.

### 3. Backend Deployment (e.g., Render / Railway / Heroku)
The backend runs from `server/index.ts`. Since it's TypeScript, use `tsx` or compile to JavaScript before running.
Build command: `tsc -b`
Start command: `node dist/server/index.js`
Ensure the following environment variables are set securely in the provider's dashboard:
- `PORT` (usually auto-injected by the host)
- `JWT_SECRET` (generate a strong cryptographically secure string)
- `DATABASE_URL` (connection string for PostgreSQL)
- `GEMINI_API_KEY` (Google AI Studio)
- `TAVILY_API_KEY` (Tavily)

*Note: Cost considerations apply. Monitor Google AI Studio and Tavily billing dashboards for usage spikes. The Admin dashboard tracks token consumption loosely for internal audits.*
