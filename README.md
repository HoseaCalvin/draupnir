# Draupnir

Inspired by Odin's multiplying ring, Draupnir aims to facilitate users in managing their finance and goals, regardless of financial literacy. Charts and ledger serve to provide clear heuristics of your transactions during monthly period. As a finishing touch, Mimir, your AI companion, captures key findings in financial reports and gives advice for better planning on spending.

## ✨ Features

* **Deposit** — Track deposited money and their estimated total balance after return.
* **Charts and Ledger** — Summarizes all transactions within a monthly period.
* **Monthly Income & Expense System** - Add a list of fixed income (e.g. salary) and expenses (e.g. groceries).
* **Mimir** — An AI advisor who analyzes financial summaries and provides appropriate advice.

## 🏗️ Tech Stack

* **Frontend**: React, Next.js, TailwindCSS
* **Backend**: Express, TypeScript, BullMQ
* **Database**: PostgreSQL (using cloud service, NEON)
* **DevOps**: Docker
* **Caching**: Redis

## ⚠️ Important

* Ensure Docker is already installed in your system!
* This application uses NEON PostgreSQL as its database. Ensure you already have a NEON account.

## 🔧 Configuration

* Update `.env` with your own API keys.

## 🚀 Getting Started
### 1. Clone the repository

```bash
git clone https://github.com/HoseaCalvin/draupnir.git
```

### 2. Change directory

```bash
cd draupnir
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run both frontend and backend

```bash
npm run dev
```
(Use the command above to run both backend and frontend.)

### 5. Run Redis

```bash
docker compose up redis
```

### 6. Run Cron Jobs
```bash
npm run scheduler 
npm run worker
```

## 🚀 Getting Started (Docker)
### 1. Clone the repository

```bash
git clone https://github.com/HoseaCalvin/draupnir.git
```

### 2. Build Docker containers

```bash
docker build --no-cache
```

### 3. Spin up the Docker container

```bash
docker compose up
```

## 🤝 Future plans

- Develop chatbot for seamless interaction with Mimir (AI).
- Improve Mimir (AI) by adding feature engineering, feature store, and guardrails.
- Implement skeleton cards to enhance UI/UX.
