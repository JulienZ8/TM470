from sqlalchemy import Column, Date, Text, ForeignKey, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from .database import Base



class DimCalendar(Base):
    __tablename__ = 'dim_calendar'
    
    date_cal = Column(Date, primary_key=True)
    period_default = Column(Text)
    season_name = Column(Text)
    season = Column(Text)

    fact_entries = relationship("FactEntry", back_populates="dim_calendar")

class FactEntry(Base):
    __tablename__ = 'fact_entry'

    id = Column(Integer, primary_key=True)
    entry_date = Column(Date, ForeignKey("dim_calendar.date_cal"))

    dim_calendar = relationship("DimCalendar", back_populates="fact_entries")
