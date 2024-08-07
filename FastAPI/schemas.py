from pydantic import BaseModel

class Calendar(BaseModel):
    date_cal_id: int
    year_number: int
    season: str

    class Config:
        from_attributes = True