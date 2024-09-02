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
            func.count(models.FactEntry.entry_date).label("entry_count"),  #Counts the entries for each period within the season
        )
        .join(models.DimCalendar.fact_entries)  #Joins DimCalendar with FactEntry to get the entries per period
        .outerjoin(models.DimPassCategory, models.FactEntry.dim_pass_category_id == models.DimPassCategory.id)

        .group_by(models.DimCalendar.season_name, 
                  models.DimCalendar.period_default, 
                  models.DimCalendar.season,
                  models.DimPassCategory.main)
        #Groups the results by season_name, period_default, and total_entries to aggregate the data correctly

        .order_by(models.DimCalendar.season_name)  #Orders the results by season_name to ensure a chronological sequence in the output
        .all() 
    )

    return result if result else []