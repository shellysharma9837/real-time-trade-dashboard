from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# 1. Schema for creating a new trade (client request)
class TradeCreate(BaseModel):
    asset: str
    price: float
    quantity: float
    user_id: int = 1


# 2. Schema for returning a trade (server response)
class Trade(BaseModel):
    id: int
    user_id: int
    asset: str
    quantity: float
    price: float
    timestamp: Optional[datetime] = None

    class Config:
        orm_mode = True   # allows returning SQLAlchemy objects directly
