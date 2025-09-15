# backend/app/models/alert.py
from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    trade_id = Column(Integer, index=True, nullable=True)
    level = Column(String)
    message = Column(String)
    value = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.now)
