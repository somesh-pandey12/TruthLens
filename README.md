# VerifyAI — AI-Powered Fake News Detector

![VerifyAI](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![Python](https://img.shields.io/badge/Python-Flask-3776AB?style=for-the-badge&logo=python)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

> A full-stack AI application that detects fake news using LLM (Llama 3.3 70B via Groq) and NLP analysis.

## 🔗 Live Demo
- **Frontend:** [truth-lens-eight-ochre.vercel.app](https://truth-lens-eight-ochre.vercel.app)
- **Backend API:** [truthlens-iu5p.onrender.com](https://truthlens-iu5p.onrender.com)

---

## ✨ Features

- 🧠 **LLM Analysis** — Llama 3.3 70B via Groq API for credibility detection
- 📊 **Reliability Score** — 0-100 credibility rating with AI explanation
- 🔍 **NLP Insights** — Sentiment analysis & subjectivity detection via TextBlob
- 📁 **History Dashboard** — Track & filter all past analyses
- 📋 **Share Results** — Copy analysis results to clipboard
- 🌙 **Dark/Light Mode** — Toggle between themes
- 🔐 **Auth System** — JWT + Google OAuth login
- 📱 **Responsive** — Works on all devices

---

## 🏗️ Architecture

┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐

│   React Frontend │────▶│  Node.js Backend  │────▶│  Python ML API  │

│   (Vercel)       │     │  (Render)         │     │  (Render)       │

│   Port: 3000     │     │  Port: 5000       │     │  Port: 8000     │

└─────────────────┘     └──────────────────┘     └─────────────────┘

│                        │

▼                        ▼

┌──────────────┐      ┌─────────────────┐

│  MongoDB      │      │   Groq LLM API  │

│  Atlas        │      │  Llama 3.3 70B  │

└──────────────┘      └─────────────────┘

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios |
| Backend | Node.js, Express.js, JWT Auth |
| ML Service | Python, Flask, TextBlob |
| AI Model | Llama 3.3 70B (Groq API) |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth 2.0 |
| Deployment | Vercel + Render |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/truthlens.git
cd truthlens
```

### 2. Backend setup
```bash
cd server
npm install
```
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_URL=http://localhost:3000
ML_SERVICE_URL=http://localhost:8000
```

### 3. ML Service setup
```bash
cd ml-service
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
Create `ml-service/.env`:
```env
GROQ_API_KEY=your_groq_key
PORT=8000
```

### 4. Frontend setup
```bash
cd client
npm install
```
Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Run all services
```bash
# Terminal 1 - ML Service
cd ml-service && venv\Scripts\activate && python main.py

# Terminal 2 - Backend
cd server && node index.js

# Terminal 3 - Frontend
cd client && npm start
```
---
## 👨‍💻 Author

**Somesh Pandey**
- LinkedIn: https://https://www.linkedin.com/in/somesh-pandey-536222296/
- GitHub: https://github.com/somesh-pandey12yourusername
- Email: someshpandeycil@gmail.com

---