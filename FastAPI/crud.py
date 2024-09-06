from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from . import models

def get_season_entries_grouped(db: Session):

    #Main query to calculate the number of entries per period within each season.
    result = (
        db.query(
            models.DimCalendar.season_name,
            models.DimCalendar.period_default,
            models.DimCalendar.season,
            models.DimPassCategory.main.label("pass_category"),
            func.count(models.FactEntry.entry_date).label("entry_count"),  #Counts the entries in this group
        )
        .join(models.DimCalendar.fact_entries)  #Joins DimCalendar with FactEntry to get the entries per period
        .outerjoin(models.DimPassCategory, models.FactEntry.dim_pass_category_id == models.DimPassCategory.id)

        #Groups the results by season_name, period_default, total_entries 
        #and main(pass category) to aggregate the data correctly
        .group_by(models.DimCalendar.season_name, 
                  models.DimCalendar.period_default, 
                  models.DimCalendar.season,
                  models.DimPassCategory.main)

        #Orders the results by season_name to ensure a chronological sequence in the output
        .order_by(models.DimCalendar.season_name)  
        .all() 
    )

    return result if result else []

# Retrieve distinct periods from the DimCalendar table
def get_periods(db: Session):
    # Query distinct periods
    periods = db.query(models.DimCalendar.period_default).distinct().all()
    # Convert query result to a list
    return [period.period_default for period in periods]

# Retrieve distinct season names from the DimCalendar table
def get_season_names(db: Session):
    season_names = db.query(models.DimCalendar.season_name).distinct().all()
    return [season_name.season_name for season_name in season_names]

# Retrieve distinct seasons (e.g., 'ete', 'hiver') from the DimCalendar table
def get_seasons(db: Session):
    seasons = db.query(models.DimCalendar.season).distinct().all()
    return [season.season for season in seasons]

# Retrieve distinct pass categories from the DimPassCategory table
def get_pass_list(db: Session):
    pass_categories = db.query(models.DimPassCategory.main).distinct().all()
    return [category.main for category in pass_categories]