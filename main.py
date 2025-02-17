import os
from fastapi import FastAPI
from databases import Database
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize FastAPI
app = FastAPI()

# Connect to the database
database = Database(DATABASE_URL)

@app.on_event("startup")
async def startup():
    try:
        await database.connect()
        print("✅ Database connected successfully")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
async def root():
    return {"message": "Connected to PostgreSQL successfully!"}
