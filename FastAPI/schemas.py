from pydantic import BaseModel
from datetime import date
from typing import Optional

class SeasonEntryGrouped(BaseModel):
    season_name: str
    period_default: str
    season: str
    pass_category: Optional[str]
    entry_count : int

    class Config:
        from_attributes = True