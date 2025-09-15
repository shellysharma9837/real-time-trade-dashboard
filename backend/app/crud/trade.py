# backend/app/crud/trade.py
from sqlalchemy.orm import Session
from app.models.trade import Trade as TradeModel
from app.schemas.trade import TradeCreate

def create_trade(db: Session, trade_in: TradeCreate):
    db_trade = TradeModel(**trade_in.model_dump())
    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)
    return db_trade

def get_trades(db: Session, limit: int = 100):
    return db.query(TradeModel).order_by(TradeModel.timestamp.desc()).limit(limit).all()
