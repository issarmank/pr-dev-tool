import os
from fastapi import FastAPI, Depends
from databases import Database
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.models import CodeReview

# Load environment variables from .env file
load_dotenv()

# Retrieve database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize FastAPI
app = FastAPI()

# Connect to the database
database = Database(DATABASE_URL)

def get_reviews(db: Session):
    return db.query(CodeReview).all()

def create_review(db: Session, title: str, feedback: str, reviewer: str):
    new_review = CodeReview(title=title, feedback=feedback, reviewer=reviewer)
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review