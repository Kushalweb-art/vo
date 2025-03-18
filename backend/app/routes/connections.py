from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models import DatabaseConnection
from app.database import get_db
from sqlalchemy.orm import Session
import psycopg2

router = APIRouter()

# In-memory storage for connections if no database is available
connections = []

@router.post("/")
async def create_connection(connection: DatabaseConnection, db: Session = Depends(get_db)):
    try:
        # Test the connection
        conn = psycopg2.connect(
            host=connection.host,
            port=connection.port,
            database=connection.database,
            user=connection.username,
            password=connection.password
        )
        
        # Get table count
        cursor = conn.cursor()
        cursor.execute("""
            SELECT count(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchone()[0]
        conn.close()
        
        # Store connection (in memory for now)
        connection_dict = connection.dict()
        connection_dict["id"] = len(connections) + 1
        connection_dict["tables"] = tables
        connections.append(connection_dict)
        
        return connection_dict
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Connection failed: {str(e)}")

@router.get("/")
async def list_connections():
    return connections

@router.delete("/{connection_id}")
async def delete_connection(connection_id: int):
    global connections
    connection = next((c for c in connections if c["id"] == connection_id), None)
    if connection:
        connections = [c for c in connections if c["id"] != connection_id]
        return {"message": f"Connection {connection_id} deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail=f"Connection {connection_id} not found")