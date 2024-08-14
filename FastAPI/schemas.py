from pydantic import BaseModel
from datetime import date
from typing import Optional

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
    dim_calendar: Optional[DimCalendar]

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
    season: str
    entry_count : int
    total_entries: int

    class Config:
        from_attributes = True

class FactEntryWithCalendar(BaseModel):
    id: int
    entry_date: str
    calendar_info: DimCalendar

    class Config:
        from_attributes = True

class FactEntryAggregated(BaseModel):
    season_name: str
    period_default: str
    total_entries: int

    class Config:
        from_attributes = True