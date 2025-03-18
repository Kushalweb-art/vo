from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DatabaseConnection(BaseModel):
    name: str
    host: str
    port: int = 5432
    database: str
    username: str
    password: str

class ValidationConfig(BaseModel):
    dataset: str
    config: str
    dataset_type: str = "csv"  # "csv" or "database"

class ValidationCheck(BaseModel):
    name: str
    definition: str
    result: str
    status: str

class InvalidRecord(BaseModel):
    row: int
    column: str
    value: str
    issue: str

class ValidationSummary(BaseModel):
    total: int
    passed: int
    warnings: int
    failed: int

class ValidationResult(BaseModel):
    id: str
    dataset: str
    timestamp: datetime
    summary: ValidationSummary
    checks: List[ValidationCheck]
    invalid_records: List[InvalidRecord]