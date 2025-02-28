from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import Base
from .database import Base

class CodeReview(Base):
    __tablename__ = "code_reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
