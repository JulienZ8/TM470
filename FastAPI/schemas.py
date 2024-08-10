from pydantic import BaseModel
from datetime import date

class FactEntry(BaseModel):
    entry_date: date

    class Config:
        from_attributes = True

class DimCalendar(BaseModel):
    date_cal: date
    period_default: str
    season_name: str
    season: str

    class Config:
        from_attributes = True