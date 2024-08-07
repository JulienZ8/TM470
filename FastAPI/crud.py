from sqlalchemy.orm import Session
from .models import DimCalendar

def get_calendar(db: Session, season: str = None, year_number: int = None):
    query = db.query(DimCalendar)
    if season:
        query = query.filter(DimCalendar.season == season)
    if year_number:
        query = query.filter(DimCalendar.year_number == year_number)
    return query.all()