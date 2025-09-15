# Real-Time Trade Dashboard

A **real-time trade dashboard** built with **FastAPI**, **WebSockets**, **Kafka**, **PostgreSQL**, and **React**. Monitor trades, users, and alerts in real time.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Run with Docker](#run-with-docker)
- [WebSocket Usage](#websocket-usage)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

- Real-time trade updates via WebSockets  
- Kafka consumer for streaming trades/alerts  
- REST APIs for Users, Trades, Alerts  
- CORS support for frontend  
- Modular FastAPI + React structure  

---

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, asyncio  
- **Frontend:** React.js  
- **Database:** PostgreSQL  
- **Messaging:** Kafka  
- **WebSockets:** Real-time updates  

---

## Project Structure

project-root/
├── backend/
│ ├── app/
│ ├── requirements.txt
│ └── Dockerfile
├── frontend/
│ ├── src/
│ ├── package.json
│ └── Dockerfile
├── docker-compose.yml
└── README.md


---

## Run with Docker

1. Create a `.env` file with Postgres credentials:

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=trades_db


2. Build and start all services:

```bash
docker-compose up --build 
```
3. Access the apps:

```bash
Backend (FastAPI): http://localhost:8000

Frontend (React): http://localhost:3000
```
Docker will start Postgres, Kafka, Backend, and Frontend automatically.

4. WebSocket Usage

Connect to the backend WebSocket for real-time updates:
```
const ws = new WebSocket("ws://localhost:8000/ws");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Received:", data);
};

ws.onopen = () => ws.send("ping");
```

API Endpoints
Route	Method	Description
/users	GET/POST/PUT/DELETE	Manage users
/trades	GET/POST	Manage trades
/alerts	GET/POST	Manage alerts
/ws	WebSocket	Real-time updates
