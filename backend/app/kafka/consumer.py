# backend/app/kafka/consumer.py
import json
import asyncio
from aiokafka import AIOKafkaConsumer
from app.config import KAFKA_BOOTSTRAP, KAFKA_TOPIC
from app.database import SessionLocal
from app.crud.alert import create_alert
from app.schemas.alert import AlertCreate
from app.analytics.risk_engine import analyze_trade

consumer = None

async def start_consumer(broadcaster):
    global consumer
    consumer = AIOKafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP,
        group_id="trade-consumers"
    )
    await consumer.start()
    try:
        async for msg in consumer:
            payload = json.loads(msg.value.decode("utf-8"))
            # run risk engine synchronously in threadpool or small async wrapper
            alerts = analyze_trade(payload)
            # persist alerts to DB
            db = SessionLocal()
            try:
                for a in alerts:
                    alert_in = AlertCreate(**a)
                    db_alert = create_alert(db, alert_in)
                    # broadcast alerts to websockets
                    for ws in list(broadcaster):
                        try:
                            await ws.send_json({"type": "alert", "data": {
                                "id": db_alert.id,
                                "level": db_alert.level,
                                "message": db_alert.message,
                                "value": db_alert.value,
                                "timestamp": db_alert.timestamp.isoformat()
                            }})
                        except Exception:
                            pass
            finally:
                db.close()
            # also broadcast trade to websockets
            for ws in list(broadcaster):
                try:
                    await ws.send_json({"type": "trade", "data": payload})
                except Exception:
                    pass
    finally:
        await consumer.stop()
