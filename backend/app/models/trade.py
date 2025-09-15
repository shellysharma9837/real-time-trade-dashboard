# backend/app/models/trade.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Trade(Base):
    __tablename__ = "trades"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    asset = Column(String, index=True)
    quantity = Column(Float)
    price = Column(Float)
    timestamp = Column(DateTime, default=datetime.now)
