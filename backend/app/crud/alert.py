# backend/app/crud/alert.py
from sqlalchemy.orm import Session
from app.models.alert import Alert as AlertModel
from app.schemas.alert import AlertCreate

def create_alert(db: Session, alert_in: AlertCreate):
    db_alert = AlertModel(**alert_in.model_dump())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_alerts(db: Session, limit: int = 100):
    return db.query(AlertModel).order_by(AlertModel.timestamp.desc()).limit(limit).all()
