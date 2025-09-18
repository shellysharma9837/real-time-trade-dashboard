# backend/app/kafka/producer.py
import json
from app.config import KAFKA_BOOTSTRAP, KAFKA_TOPIC
from aiokafka import AIOKafkaProducer
import asyncio

_producer = None

async def get_producer():
    global _producer
    if _producer is None:
        _producer = AIOKafkaProducer(bootstrap_servers=KAFKA_BOOTSTRAP)
        await _producer.start()
    return _producer

async def produce_trade(trade):
    """
    trade: SQLAlchemy object - convert to dict
    """
    try:
        prod = await get_producer()
        payload = {
            "id": trade.id,
            "user_id": trade.user_id,
            "asset": trade.asset,
            "quantity": trade.quantity,
            "price": trade.price,
            "timestamp": trade.timestamp.isoformat()
        }
        await prod.send_and_wait(KAFKA_TOPIC, json.dumps(payload).encode("utf-8"))
    except Exception as e:
        print("Kafka produce error:", e)
