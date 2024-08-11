from pydantic import BaseModel
from datetime import date

class DimCalendar(BaseModel):
    date_cal: date
    period_default: str
    season_name: str
    season: str

    class Config:
        from_attributes = True

class FactEntry(BaseModel):
    id: int
    entry_date: date

    class Config:
        from_attributes = True

class SeasonEntry(BaseModel):
    season_name: str
    total_entries: int

    class Config:
        from_attributes = True

class SeasonEntryGrouped(BaseModel):
    season_name: str
    period_default: str
    entry_count : int
    total_entries: int

    class Config:
        from_attributes = True