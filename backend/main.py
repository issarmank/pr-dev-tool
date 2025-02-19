import os
from fastapi import FastAPI, Depends
from databases import Database
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Load environment variables from .env file
load_dotenv()

# Retrieve database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize FastAPI
app = FastAPI()

# Connect to the database
database = Database(DATABASE_URL)

# Dependency for getting the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def read_root(db: Session = Depends(get_db)):
    return {"message": "Connected to database"}
