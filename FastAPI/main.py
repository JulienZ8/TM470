from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import engine
from .dependencies import get_db
from typing import List
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URLs of the frontends you want to allow to connect
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/calendar/", response_model=List[schemas.Calendar])
def read_calendar(season: str = Query(None), year_number: int = Query(None), db: Session = Depends(get_db)):
    return crud.get_calendar(db, season=season, year_number=year_number)

