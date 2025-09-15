# backend/app/api/alerts.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.alert import create_alert, get_alerts
from app.schemas.alert import AlertCreate, Alert

router = APIRouter()

@router.get("/", response_model=List[Alert])
def list_alerts(db: Session = Depends(get_db)):
    return get_alerts(db)

@router.post("/", response_model=Alert)
def post_alert(payload: AlertCreate, db: Session = Depends(get_db)):
    return create_alert(db, payload)