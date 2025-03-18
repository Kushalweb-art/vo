from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
import os
import shutil
from pathlib import Path
import pandas as pd
from app.models import DatabaseConnection
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

# Path to uploads directory
UPLOAD_DIR = Path("uploads")

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    try:
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Read CSV file to get basic info
        try:
            df = pd.read_csv(file_path)
            rows, columns = df.shape
        except Exception:
            rows, columns = 0, 0
        
        return {
            "filename": file.filename,
            "size": os.path.getsize(file_path),
            "rows": rows,
            "columns": columns,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_datasets():
    try:
        # List all files in the uploads directory
        files = []
        for file_path in UPLOAD_DIR.glob("*.csv"):
            try:
                df = pd.read_csv(file_path)
                rows, columns = df.shape
            except Exception:
                rows, columns = 0, 0
                
            files.append({
                "name": file_path.name,
                "size": f"{os.path.getsize(file_path) / (1024 * 1024):.1f} MB",
                "rows": rows,
                "columns": columns,
                "date": file_path.stat().st_mtime,
            })
        return files
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{filename}")
async def delete_dataset(filename: str):
    try:
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            os.remove(file_path)
            return {"message": f"File {filename} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"File {filename} not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))