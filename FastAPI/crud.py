from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from . import models

#test function
def get_calendar(db: Session, season_name: str = None, period_default: int = None):
    query = db.query(models.DimCalendar)
    if season_name:
        query = query.filter(models.DimCalendar.season_name == season_name)
    if period_default:
        query = query.filter(models.DimCalendar.period_default == period_default)
    return query.all()

#test function
def get_factentry_by_id(db: Session, factentry_id: int):
    return db.query(models.FactEntry).filter(models.FactEntry.id == factentry_id).first()

#function to get total entries per season_name
def get_season_entries(db: Session):
    return db.query(
        models.DimCalendar.season_name, 
        func.count(models.FactEntry.entry_date).label("total_entries")
    ).join(models.DimCalendar.fact_entries).group_by(models.DimCalendar.season_name).all()
    #.join(models.FactEntry) also works but does not use the ORM relationship

def get_season_entries_grouped(db: Session):
    total_entries_subquery = (
        db.query(
            models.DimCalendar.season_name,
            func.count(models.FactEntry.entry_date).label("total_entries")
        )
        .join(models.DimCalendar.fact_entries)
        .group_by(models.DimCalendar.season_name)
        .subquery()
    )

    result = (
        db.query(
            models.DimCalendar.season_name,
            models.DimCalendar.period_default,
            func.count(models.FactEntry.entry_date).label("entry_count"),
            total_entries_subquery.c.total_entries
        )
        .join(models.DimCalendar.fact_entries)
        .join(total_entries_subquery, models.DimCalendar.season_name == total_entries_subquery.c.season_name)
        .group_by(models.DimCalendar.season_name, models.DimCalendar.period_default, total_entries_subquery.c.total_entries)
        .order_by(models.DimCalendar.season_name)
        .all()
    )

    return result if result else []


def get_factentry_calendar(db: Session):
    # Perform a join between FactEntry and DimCalendar
    results = db.query(
        models.FactEntry.id, 
        models.FactEntry.entry_date, 
        models.DimCalendar.date_cal,
        models.DimCalendar.period_default,
        models.DimCalendar.season_name,
        models.DimCalendar.season
    ).join(models.DimCalendar, models.FactEntry.entry_date == models.DimCalendar.date_cal).all()

    return results