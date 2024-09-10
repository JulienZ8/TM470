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


# Schema for receiving the updated "main" value in the request
class PassUpdate(BaseModel):
    main: str

# Schema for returning the pass details in the response
class PassDetails(BaseModel):
    id: int
    pass_name: str
    main: str

    class Config:
        from_attributes = True  # This allows SQLAlchemy models to be used with Pydantic