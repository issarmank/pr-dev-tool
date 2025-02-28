from sqlalchemy.orm import Session
from models import CodeReview

def get_reviews(db: Session):
    return db.query(CodeReview).all()

def create_review(db: Session, title: str, feedback: str, reviewer: str):
    new_review = CodeReview(title=title, feedback=feedback, reviewer=reviewer)
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review
