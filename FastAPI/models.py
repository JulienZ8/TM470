from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class DimCalendar(Base):
    __tablename__ = 'dim_calendar'
    
    date_cal_id = Column(Integer, primary_key=True)
    year_number = Column(Integer)
    season = Column(String)
