from fastapi import FastAPI, Depends, Query, HTTPException
from sqlalchemy.orm import Session, joinedload
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func

from . import crud, models, schemas
from .database import SessionLocal, engine
from typing import List, Optional

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

#Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URLs of the frontends you want to allow to connect
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/calendar/", response_model=List[schemas.DimCalendar])
def read_calendar(season_name: str = Query(None), period_default: str = Query(None), db: Session = Depends(get_db)):
    return crud.get_calendar(db, season_name=season_name, period_default=period_default)

@app.get("/factentry/{id}", response_model=schemas.FactEntry)
def read_factentry(id: int, db: Session = Depends(get_db)):
    fact_entry = crud.get_factentry_by_id(db, factentry_id=id)
    if fact_entry is None:
        raise HTTPException(status_code=404, detail="Fact entry not found")
    return fact_entry

@app.get("/season-entries/", response_model=List[schemas.SeasonEntry])
def read_season_entries(db: Session = Depends(get_db)):
    return crud.get_season_entries(db)

@app.get("/season-entries-grouped/", response_model=List[schemas.SeasonEntryGrouped])
def read_season_entries_grouped(db: Session = Depends(get_db)):
    return crud.get_season_entries_grouped(db)


@app.get("/factentry-aggregated/", response_model=List[schemas.FactEntryAggregated])
def get_fact_entry_aggregated(
    season_name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # Correct aggregation: counting the number of records
    query = db.query(
        models.DimCalendar.season_name,
        models.DimCalendar.period_default,
        func.count(models.FactEntry.id).label('total_entries')  # Count the number of FactEntry records
    ).join(models.FactEntry).group_by(
        models.DimCalendar.season_name,
        models.DimCalendar.period_default
    )

    if season_name:
        query = query.filter(models.DimCalendar.season_name == season_name)

    results = query.all()

    if not results:
        raise HTTPException(status_code=404, detail="No data found")

    return [{"season_name": row[0], "period_default": row[1], "total_entries": row[2]} for row in results]


@app.get("/entries/", response_model=List[schemas.FactEntry])
def read_entries(season_name: str = None, period_default: str = None, db: Session = Depends(get_db)):
    return crud.get_entries(db, season_name=season_name, period_default=period_default)

@app.get("/periodlist/", response_model=List[str])
def get_periods(db: Session = Depends(get_db)):
    periods = db.query(models.DimCalendar.period_default).distinct().all()
    return [period.period_default for period in periods]

@app.get("/seasonnamelist/", response_model=List[str])
def get_season_names(db: Session = Depends(get_db)):
    season_names = db.query(models.DimCalendar.season_name).distinct().all()
    return [season_name.season_name for season_name in season_names]

@app.get("/seasonlist/", response_model=List[str])
def get_season_names(db: Session = Depends(get_db)):
    seasons = db.query(models.DimCalendar.season).distinct().all()
    return [season.season for season in seasons]

@app.get("/passlist/", response_model=List[str])
def get_pass_list(db: Session = Depends(get_db)):
    pass_categories = db.query(models.DimPassCategory.main).distinct().all()
    return [category.main for category in pass_categories]