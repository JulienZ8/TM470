from fastapi import FastAPI, Depends, HTTPException
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


@app.get("/pass-name-main", response_model=List[schemas.PassDetails])
def get_pass_name_main(db: Session = Depends(get_db)):
    """
    This endpoint returns a list of pass_name / main pairs.
    """
    return crud.get_pass_name_main(db)

@app.put("/update-pass-category/{pass_id}", response_model=schemas.PassDetails)
def update_pass_category(pass_id: int, pass_data: schemas.PassUpdate, db: Session = Depends(get_db)):
    #Update the pass category in the database
    updated_pass = crud.update_pass_category(db, pass_id, pass_data.main)

    #If no pass is found with the given ID, raise a 404 error
    if not updated_pass:
        raise HTTPException(status_code=404, detail="Pass category not found")

    #Return the updated pass as a Pydantic model (converted from the SQLAlchemy model)
    return schemas.PassDetails(
        id=updated_pass.id,
        pass_name=updated_pass.pass_name,
        main=updated_pass.main
    )