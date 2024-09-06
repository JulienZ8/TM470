from fastapi import FastAPI, Depends
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
    allow_origins=["http://localhost:3000"],  # URL of React
    allow_credentials=True,
    allow_methods=["*"],  #Allow all methods
    allow_headers=["*"],  #Allow all headers
)

@app.get("/season-entries-grouped/", response_model=List[schemas.SeasonEntryGrouped])
def read_season_entries_grouped(db: Session = Depends(get_db)):
    return crud.get_season_entries_grouped(db)

@app.get("/periodlist/", response_model=List[str])
def get_periods(db: Session = Depends(get_db)):
    return crud.get_periods(db)  #Call the function from crud.py

@app.get("/seasonnamelist/", response_model=List[str])
def get_season_names(db: Session = Depends(get_db)):
    return crud.get_season_names(db)  

@app.get("/seasonlist/", response_model=List[str])
def get_seasons(db: Session = Depends(get_db)):
    return crud.get_seasons(db)  

@app.get("/passlist/", response_model=List[str])
def get_pass_list(db: Session = Depends(get_db)):
    return crud.get_pass_list(db)  