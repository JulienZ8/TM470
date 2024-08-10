from sqlalchemy import Column, Date, Text
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class FactEntry(Base):
    __tablename__ = 'fact_entry'

    entry_date = Column(Date, primary_key=True)

class DimCalendar(Base):
    __tablename__ = 'dim_calendar'
    
    date_cal = Column(Date, primary_key=True)
    period_default = Column(Text)
    season_name = Column(Text)
    season = Column(Text)