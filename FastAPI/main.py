from fastapi import FastAPI, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from . import crud, models, schemas
from .database import SessionLocal, engine
from typing import List

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