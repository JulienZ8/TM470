from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from . import models

#test function
def get_calendar(db: Session, season_name: str = None, period_default: int = None):
    query = db.query(models.DimCalendar)
    if season_name:
        query = query.filter(models.DimCalendar.season_name == season_name)
    if period_default:
        query = query.filter(models.DimCalendar.period_default == period_default)
    return query.all()

#test function
def get_factentry_by_id(db: Session, factentry_id: int):
    return db.query(models.FactEntry).filter(models.FactEntry.id == factentry_id).first()

#function to get total entries per season_name
def get_season_entries(db: Session):
    return db.query(
        models.DimCalendar.season_name, 
        func.count(models.FactEntry.entry_date).label("total_entries")
    ).join(models.DimCalendar.fact_entries).group_by(models.DimCalendar.season_name).all()
    #.join(models.FactEntry) also works but does not use the ORM relationship

def get_season_entries_grouped(db: Session):
    #Subquery to calculate the total number of entries for each season.
    total_entries_subquery = (
        db.query(
            models.DimCalendar.season_name, 
            func.count(models.FactEntry.entry_date).label("total_entries")  #Counts the number of entries (entry_date)
        )
        .join(models.DimCalendar.fact_entries)  #Joins DimCalendar with FactEntry using the relationship "DimCalendar.fact_entries"
        .group_by(models.DimCalendar.season_name)  #Groups the count by season_name to get the total number of entries for each season
        .subquery()  #Converts the result into a subquery for later use
    )

    #Main query to calculate the number of entries per period within each season.
    result = (
        db.query(
            models.DimCalendar.season_name,
            models.DimCalendar.period_default,
            models.DimCalendar.season,
            func.count(models.FactEntry.entry_date).label("entry_count"),  #Counts the entries for each period within the season
            total_entries_subquery.c.total_entries  #Includes the total number of entries for the season from the subquery
        )
        .join(models.DimCalendar.fact_entries)  #Joins DimCalendar with FactEntry to get the entries per period
        .join(total_entries_subquery, models.DimCalendar.season_name == total_entries_subquery.c.season_name)  
        #Joins the main query with the subquery on season_name to include the total entries for each season

        .group_by(models.DimCalendar.season_name, 
                  models.DimCalendar.period_default, 
                  models.DimCalendar.season, 
                  total_entries_subquery.c.total_entries)
        #Groups the results by season_name, period_default, and total_entries to aggregate the data correctly

        .order_by(models.DimCalendar.season_name)  #Orders the results by season_name to ensure a chronological sequence in the output
        .all() 
    )

    return result if result else []

def get_entries(db: Session, season_name: str = None, period_default: str = None):
    query = db.query(models.FactEntry).join(models.DimCalendar)
    
    if season_name:
        query = query.filter(models.DimCalendar.season_name == season_name)
    if period_default:
        query = query.filter(models.DimCalendar.period_default == period_default)
    
    return query.all()