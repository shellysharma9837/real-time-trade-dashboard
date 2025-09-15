# backend/app/api/trades.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.trade import TradeCreate, Trade
from app.crud.trade import create_trade, get_trades
from app.kafka.producer import produce_trade

router = APIRouter()

@router.post("/", response_model=Trade)
async def post_trade(trade: TradeCreate, db: Session = Depends(get_db)):
    db_trade = create_trade(db, trade)
    # send to kafka for streaming/analytics
    await produce_trade(db_trade)
    return db_trade

@router.get("/", response_model=List[Trade])
def list_trades(db: Session = Depends(get_db)):
    return get_trades(db)
