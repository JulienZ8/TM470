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

@app.get("/season-entries-grouped/", response_model=List[schemas.SeasonEntryGrouped])
def read_season_entries_grouped(db: Session = Depends(get_db)):
    return crud.get_season_entries_grouped(db)

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