# 💰 Financial Agent — AI-Powered Financial Management App

> **Smart, Secure & AI-Driven Personal Finance Assistant**

A mobile-first, production-ready application that helps you track, analyze, and improve your financial health — powered by **AI**, **Plaid banking**, and **WebAuthn security**.

---

## 🌐 Live Demo
👉 **[personal-finance-ai-client.vercel.app](https://personal-finance-ai-client.vercel.app)**

---

## 📸 Preview

```
📱 Financial Agent
├── AI Assistant: "How much can I save next month?"
├── Dashboard: Cash flow, spending, and trends
└── Bank Sync: Securely link accounts via Plaid
```

---

## 🚀 Overview

**Financial Agent** combines the power of **AI**, **secure bank integrations**, and **insightful analytics** in one intuitive dashboard.

💡 Built for users who value **clarity**, **control**, and **security** in managing their money.

---

## ✨ Features

| Category | Highlights |
|-----------|-------------|
| 🔐 **Security** | WebAuthn (biometric unlock), AES-256 encryption, short-lived JWT tokens, GDPR compliance |
| 🏦 **Banking Integration** | Plaid sandbox, real-time balances, transaction sync & categorization, multi-account support |
| 📊 **Analytics & Insights** | Cash flow, expense breakdown, net worth tracking, what-if simulator, anomaly detection |
| 🤖 **AI Assistant** | Gemini AI integration, voice I/O, contextual answers, loan & wealth projections, source attribution |
| 📱 **UI / UX** | Mobile-first PWA, PhonePe-like navigation, dark mode, smooth animations, responsive design |

---

## ⚙️ Tech Stack

| Layer | Technologies |
|--------|--------------|
| **Frontend** | React 18 • TypeScript • Tailwind CSS • Zustand • Chart.js • Vite |
| **Backend** | Node.js • Express • TypeScript • MongoDB • Plaid API • Gemini AI • WebAuthn |
| **DevOps** | Docker • Docker Compose • Nginx • MongoDB Atlas |

---

## 🧭 Architecture

```
Frontend (React + Tailwind)
        │
        ▼
Backend (Node.js + Express + TypeScript)
        │
        ▼
Plaid API  •  Gemini AI  •  MongoDB (Encrypted)
```

---

## 🧰 Prerequisites

- Node.js **v20+**
- MongoDB (local or Docker)
- Plaid Sandbox credentials
- Gemini API key

---

## 🔧 Installation

```bash
# 1️⃣ Clone repo
git clone <repository-url>
cd financial-agent

# 2️⃣ Install dependencies
npm run install:all

# 3️⃣ Setup environment
cd server
cp .env.example .env
# Edit with your values
```

---

## 💻 Run Locally

```bash
# Start MongoDB (if not using Docker)
mongod --dbpath /path/to/data

# Run both servers
npm run dev
```

> **Frontend:** http://localhost:3000  
> **Backend:** http://localhost:5000  

---

## 🐳 Docker Setup

```bash
docker-compose up -d
```

**Services:**
- Frontend → port 3000  
- Backend → port 5000  
- MongoDB → port 27017  

To stop:
```bash
docker-compose down
```

---

## ⚙️ Environment Variables

### 🧩 Server `.env`

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/financial-agent

# JWT & Encryption
JWT_SECRET=<64-char-secret>
JWT_EXPIRES_IN=15m
AES_256_KEY=<32-char-key>

# Plaid Sandbox
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-secret
PLAID_ENV=sandbox

# Gemini AI
GEMINI_API_KEY=your-gemini-key

# WebAuthn
RP_NAME=Financial Agent
RP_ID=localhost
ORIGIN=http://localhost:3000

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### 🧩 Client `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧠 AI Assistant Examples

Ask naturally:
- “How much will I save by 2026?”
- “Can I afford a ₹50L home loan?”
- “Show my expenses for the last 6 months.”
- “Detect any unusual spending this month.”

---

## 🏦 Plaid Sandbox Test Login

```
Username: user_good
Password: pass_good
MFA: 1234
```

---

## 📡 API Endpoints

### 🔑 Authentication
```
POST /api/auth/register        → Register user
POST /api/auth/login           → Login user
```

### 🪪 WebAuthn
```
POST /api/webauthn/register/options
POST /api/webauthn/register/verify
POST /api/webauthn/authenticate/options
POST /api/webauthn/authenticate/verify
```

### 🏦 Plaid
```
POST /api/plaid/create-link-token
POST /api/plaid/exchange-token
POST /api/plaid/sync-transactions
POST /api/plaid/unlink
```

### 💳 Accounts & Transactions
```
GET /api/accounts
GET /api/accounts/balances
GET /api/transactions
GET /api/transactions/:id
PATCH /api/transactions/:id
POST /api/transactions/detect-anomalies
```

### 📊 Charts & Analytics
```
GET /api/charts/cashflow?range=6m
GET /api/charts/expense-breakdown?range=6m
GET /api/charts/networth?range=12m
POST /api/charts/simulate
GET /api/charts/export/:chartType
```

### 🤖 AI Assistant
```
POST /api/assistant/query
POST /api/assistant/calculate/loan-affordability
POST /api/assistant/calculate/future-wealth
```

---

## 🛡️ Security Best Practices

✅ Don’t commit `.env` files  
✅ Rotate keys regularly  
✅ Use HTTPS in production  
✅ Rate-limit API requests  
✅ Backup encrypted data  
✅ Monitor for anomalies  

---

## ☁️ Deployment

### Vercel (Frontend)
```bash
cd client
vercel --prod
```

### Render / Heroku (Backend)
```bash
cd server
# Follow platform-specific instructions
```

### MongoDB Atlas
- Create cluster at [mongodb.com](https://www.mongodb.com)
- Enable **encryption at rest**
- Update `MONGODB_URI` in `.env`

---

## 🧪 Testing

```bash
cd server && npm test
cd client && npm test
```

---

## 🧰 Troubleshooting

| Problem | Possible Fix |
|----------|---------------|
| ❌ WebAuthn not working | Use HTTPS or correct RP_ID |
| 🔐 Plaid error | Verify sandbox credentials |
| 📦 MongoDB connection failed | Check URI & service status |
| ⚠️ CORS issue | Update `ALLOWED_ORIGINS` in `.env` |

---

## 🤝 Contributing

Contributions are welcome! 🎉

```bash
git checkout -b feature/awesome-feature
git commit -m "Add awesome feature"
git push origin feature/awesome-feature
```

Then open a pull request 🚀

---

## 📜 License

Licensed under the **MIT License** — free for personal and commercial use.

---

## 🙏 Acknowledgments

- 🏦 [Plaid](https://plaid.com) — Bank Integration  
- 🧠 [Google Gemini](https://deepmind.google) — AI Engine  
- 🔐 [SimpleWebAuthn](https://simplewebauthn.dev) — Authentication  
- 📊 [Chart.js](https://www.chartjs.org) — Data Visualization  

---

### 💎 Crafted with ❤️ for a Smarter Financial Future

**👉 [Try Live Demo](https://personal-finance-ai-client.vercel.app)**
