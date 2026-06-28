<div align="center">
  <img src="./frontend/public/favicon.svg" alt="ApplyIQ Pro Logo" width="120" height="120" />
  <h1>ApplyIQ Pro 🚀</h1>
  <p><strong>Advanced AI-Powered Resume Builder & Career Copilot</strong></p>
  
  [![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Zustand-blue)](./frontend)
  [![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20MongoDB-green)](./backend)
  [![AI Service](https://img.shields.io/badge/AI_Service-FastAPI%20%7C%20LangChain%20%7C%20Pinecone-orange)](./ai-service)
</div>

---

## 🌟 Overview

**ApplyIQ Pro** is a cutting-edge, microservices-based SaaS platform designed to revolutionize how professionals build their resumes and manage their careers. Utilizing advanced LLMs, vector databases, and real-time sockets, ApplyIQ generates highly optimized, ATS-friendly LaTeX resumes, cover letters, and provides an interactive AI Copilot for career coaching.

## 🏗 System Architecture

The platform is designed using a modern microservices architecture, splitting responsibilities across three highly specialized, decoupled services:

```mermaid
graph TD
    Client[Web Client - React/Vite]
    
    subgap Gateway
        Backend[Node.js / Express Backend]
        AI[Python / FastAPI AI Service]
    end
    
    Client -- REST / Socket.io --> Backend
    Client -- REST (JWT Auth) --> AI
    Backend -- Internal REST --> AI
    
    Backend --> Mongo[(MongoDB)]
    Backend --> Redis1[(Upstash Redis - Rate Limiting)]
    Backend --> Stripe[Stripe API]
    Backend --> Resend[Resend Email API]
    Backend --> Cloudinary[Cloudinary CDN]
    
    AI --> Redis2[(Upstash Redis - Caching)]
    AI --> Pinecone[(Pinecone Vector DB)]
    AI --> LLM[OpenAI / Groq LLMs]
```

## 🛠 Technology Stack

### 1. Frontend Web Client (`/frontend`)
The presentation layer is built for extreme performance, fluid animations, and rich interactive experiences.
* **Core**: React 19, Vite, TypeScript
* **State Management**: Zustand (Global state, auth state)
* **Routing**: React Router DOM v7
* **Styling & UI**: Tailwind CSS, shadcn/ui, GSAP (Advanced animations), Lucide React (Icons)
* **Real-time**: Socket.io-client (Live admin notifications)
* **Forms & Validation**: React Hook Form, Zod

### 2. Core Backend Service (`/backend`)
The central hub for data persistence, user management, and third-party integrations.
* **Core**: Node.js, Express, TypeScript
* **Database & ORM**: MongoDB, Mongoose
* **Authentication**: JWT, bcryptjs
* **Real-time WebSockets**: Socket.io (Bi-directional admin alerts for support/reports)
* **Payments**: Stripe Checkout Integration
* **File Storage**: Cloudinary (Avatar/Asset uploads via Multer)
* **Emailing**: Resend
* **Rate Limiting & Caching**: Upstash Redis

### 3. AI Generation Engine (`/ai-service`)
A dedicated Python microservice handling computationally heavy AI tasks, agentic workflows, and RAG.
* **Core**: Python 3, FastAPI, Uvicorn
* **AI Orchestration**: LangChain, LangSmith
* **LLM Providers**: OpenAI, Groq
* **Vector Database (RAG)**: Pinecone (Semantic search for templates and resume structures)
* **Caching**: Upstash Redis
* **Data Validation**: Pydantic

## 🎯 Core Features & System Design

### 🤖 AI Resume Generation Pipeline
When a user requests a resume, the frontend contacts the AI Service directly (using JWT authorization). The AI service utilizes **LangChain** and **Pinecone** to retrieve successful template contexts (RAG) and streams the generated LaTeX code back to the client.

### 💬 Career Copilot (Interactive Chat)
An interactive chat interface backed by `gpt-4o` or Groq models. It maintains conversation history and context, allowing users to ask for interview prep, salary negotiation tactics, and real-time resume critiques.

### 🛡 Admin Console & Real-time Sockets
A comprehensive admin dashboard built for platform operators.
* **Live Notifications**: Utilizing `Socket.io`, admins receive instant toast notifications whenever a user submits a bug report or contact message.
* **Content Management**: Full CRUD operations for Blogs, Testimonials, and Open Roles (Careers).
* **Analytics & Oversight**: View user metrics, subscription tiers, and publish generated resumes into the global "Template Gallery."

### 💳 Subscription & Tier Management
Integrated with Stripe, users can upgrade to the **PRO** tier. The backend safely handles Stripe Webhooks, verifies signatures, and updates the MongoDB user document, instantly unlocking premium AI models and unlimited generation limits.

## 🚀 Getting Started

### Prerequisites
* Node.js (v20+)
* Python (3.11+)
* MongoDB URI
* Redis URL (Upstash)
* API Keys: OpenAI, Groq, Pinecone, Stripe, Resend, Cloudinary

### Installation & Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/Hydra-Ramesh/ApplyIQ.git
cd ApplyIQ
```

**2. Start the Backend**
```bash
cd backend
npm install
npm run dev
```

**3. Start the AI Service**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**4. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🔒 Security Best Practices Implemented
* **Stateless Auth**: JWT-based authentication passed via Bearer tokens.
* **Rate Limiting**: Redis-backed rate limiting to prevent LLM API abuse and DDoS attacks.
* **Microservice Isolation**: The AI service operates independently; if it goes down under heavy load, the core platform remains stable.
* **Data Sanitization**: Zod (Frontend/Backend) and Pydantic (AI Service) ensure strictly typed and validated data structures.

---
<div align="center">
  <i>Built with ❤️ for the future of career advancement.</i>
</div>
