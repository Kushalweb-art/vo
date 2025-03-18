from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import datasets, connections, validation, results
import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="Data Validation API")

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
app.include_router(connections.router, prefix="/connections", tags=["connections"])
app.include_router(validation.router, prefix="/validation", tags=["validation"])
app.include_router(results.router, prefix="/results", tags=["results"])

@app.get("/")
async def root():
    return {"message": "Data Validation API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)