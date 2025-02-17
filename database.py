from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database connection URL
DATABASE_URL = "postgresql://myuser:Issar2005#@postgres_container:5432/code_review"

# Create the database engine
engine = create_engine(DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the Base class for models
Base = declarative_base()

# Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
