from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models

def get_calendar(db: Session, season_name: str = None, period_default: int = None):
    query = db.query(models.DimCalendar)
    if season_name:
        query = query.filter(models.DimCalendar.season_name == season_name)
    if period_default:
        query = query.filter(models.DimCalendar.period_default == period_default)
    return query.all()

def get_factentry_by_id(db: Session, factentry_id: int):
    return db.query(models.FactEntry).filter(models.FactEntry.id == factentry_id).first()

def get_season_entries(db: Session):
    return db.query(
        models.DimCalendar.season_name, 
        func.count(models.FactEntry.id).label("total_entries")
    ).join(models.FactEntry).group_by(models.DimCalendar.season_name).all()