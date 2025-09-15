# backend/app/schemas/alert.py
from pydantic import BaseModel
from datetime import datetime

class AlertCreate(BaseModel): #Schema for request body (what client sends)
    trade_id: int | None = None
    level: str
    message: str
    value: float | None = None

class Alert(BaseModel):   #Schema for response ( what client gets back)
    id: int
    trade_id: int | None
    level: str
    message: str
    value: float | None
    timestamp: datetime
    class Config:
        orm_mode = True