# backend/app/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from app.api import trades, users, alerts
from .database import engine, Base
from app.kafka.consumer import start_consumer
import asyncio
from contextlib import asynccontextmanager
from typing import Set


# in-memory websocket connections
connected: Set[WebSocket] = set()

consumer_task = None


@asynccontextmanager
async def lifespan(app: "FastAPI"):
    """Handle startup and shutdown events in one place."""
    global consumer_task
    # Import models here to avoid circular imports
    from app.models.trade import Trade
    from app.models.user import User
    from app.models.alert import Alert
    # create tables
    Base.metadata.create_all(bind=engine)
    # start Kafka consumer
    consumer_task = asyncio.create_task(start_consumer(connected))
    yield
    # shutdown phase
    if consumer_task:
        consumer_task.cancel()
        try:
            await consumer_task
        except asyncio.CancelledError:
            pass


app = FastAPI(title="Real-Time Trade Dashboard", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(trades.router, prefix="/trades", tags=["trades"])
app.include_router(alerts.router, prefix="/alerts", tags=["alerts"])


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connected.add(ws)
    try:
        while True:
            await ws.receive_text()  # frontend may send pings
    except Exception:
        pass
    finally:
        connected.remove(ws)
