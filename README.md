# 📈 AI Investment Research Agent

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack, AI-powered financial application that performs deep fundamental analysis and news sentiment evaluation to generate deterministic investment recommendations (INVEST, HOLD, or PASS). Built specifically for evaluating production-grade agentic workflows.

## 🌟 Overview

The AI Investment Research Agent acts as a specialized financial analyst. Given a company name, the application automatically:
1. Fetches fundamental financial metrics (Market Cap, Revenue, EPS, PE Ratio).
2. Scrapes the latest global news regarding the company.
3. Performs an initial AFINN-lexicon sentiment analysis on the news.
4. Orchestrates this data via **LangChain** into a structured prompt.
5. Ingests the data into **Llama 3.3 70B** (via Groq) to generate a strict, deterministic JSON verdict.

## 🏗️ Architecture

The project utilizes a decoupled Service-Oriented Architecture (SOA) across a Polyrepo structure:
- **Frontend**: A React Single Page Application (SPA) built with Vite. It handles complex async state, dynamic UI rendering with Tailwind CSS, and data visualization using Chart.js.
- **Backend**: An Express.js REST API utilizing the Controller-Service pattern. Business logic and third-party integrations are abstracted into dedicated services.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS v3
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Visualization**: Chart.js / react-chartjs-2
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Orchestration**: LangChain.js
- **LLM Provider**: Groq API (Llama 3.3 70B Versatile)
- **External Data**: Alpha Vantage (Financials), NewsAPI (Context)
- **Sentiment**: AFINN Node `sentiment` module

---

## 📂 Folder Structure

\`\`\`text
AI-Investment-Research-Agent/
│
├── backend/
│   ├── config/              # Environment/configuration loaders
│   ├── controllers/         # Request handlers (analysisController.js)
│   ├── middleware/          # Express middlewares
│   ├── prompts/             # LangChain prompt templates (promptTemplate.js)
│   ├── routes/              # Express API route definitions
│   ├── services/            # Core business logic (finance, news, groq orchestrator)
│   ├── utils/               # Helper scripts
│   ├── server.js            # Node.js Entry point
│   └── .env                 # Backend Secrets
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI Blocks (Cards, Search, Loaders)
    │   ├── context/         # React Context providers (if applicable)
    │   ├── hooks/           # Custom React Hooks
    │   ├── pages/           # High-level views (Dashboard.jsx)
    │   ├── services/        # Axios API fetchers (api.js)
    │   ├── styles/          # Global styles (index.css)
    │   ├── utils/           # Frontend helpers
    │   └── App.jsx          # React Router layout
    ├── tailwind.config.js   # Tailwind Design System
    └── package.json         # Vite dependencies
\`\`\`

---

## 🚀 Installation & Running the Project

### Prerequisites
- Node.js (v18+ recommended)
- API Keys for Alpha Vantage, NewsAPI, and Groq.

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Open the \`.env\` file in the \`backend\` directory and insert your actual API keys:
   \`\`\`env
   PORT=5000
   ALPHA_VANTAGE_API_KEY=your_real_key_here
   NEWS_API_KEY=your_real_key_here
   GROQ_API_KEY=your_real_key_here
   \`\`\`
4. Start the backend development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *(The server will run on http://localhost:5000)*

### 2. Frontend Setup
1. Open a **new** terminal window and navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Click the local link provided by Vite (usually \`http://localhost:5173\`) to open the app in your browser!

---

## ✨ Features

- **Deterministic AI Output**: Uses low-temperature LLM generation and strict JSON parsing to ensure the AI acts analytically, not creatively.
- **Graceful Degradation**: If NewsAPI fails or limits are reached, the application falls back to fundamental data smoothly rather than crashing.
- **Micro-animations & Polish**: Includes a cycling loading state to improve UX during long-polling AI requests.
- **Dark Mode**: Fully responsive Tailwind dark mode integration using lazy-initialized React state.

## 🔮 Future Improvements

- Add WebSocket support to stream the AI's "thought process" token-by-token to the UI.
- Implement Redis caching on the backend to cache Alpha Vantage API responses to save daily request limits.
- Add OAuth Authentication (NextAuth/Auth0) to allow users to save their portfolio history.

## 🌍 Deployment

- **Frontend**: Ready to be deployed on **Vercel** as a static site. Ensure you map the \`VITE_API_URL\` environment variable to your production backend URL.
- **Backend**: Ready to be deployed on **Render** or **Railway** as a Node Web Service. Ensure you inject the three required API keys into the hosting provider's secret manager.
