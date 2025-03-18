from fastapi import APIRouter, HTTPException
from app.models import ValidationConfig
from app.services.validation_service import run_soda_validation
from pathlib import Path
import yaml
import uuid
from datetime import datetime

router = APIRouter()

# In-memory storage for validation results
validation_results = []

@router.post("/run")
async def run_validation(config: ValidationConfig):
    try:
        # Parse the YAML config
        try:
            yaml_config = yaml.safe_load(config.config)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid YAML: {str(e)}")
        
        # Run validation using Soda Core
        result = run_soda_validation(config.dataset, config.config, config.dataset_type)
        
        # Generate a unique ID for the validation result
        result_id = f"{config.dataset.replace('.', '-')}-{uuid.uuid4().hex[:8]}"
        
        # Create a structured validation result
        validation_result = {
            "id": result_id,
            "dataset": config.dataset,
            "timestamp": datetime.now().isoformat(),
            "summary": result["summary"],
            "checks": result["checks"],
            "invalid_records": result["invalid_records"]
        }
        
        # Store the result
        validation_results.append(validation_result)
        
        return validation_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/results")
async def list_validation_results():
    return validation_results

@router.get("/results/{result_id}")
async def get_validation_result(result_id: str):
    result = next((r for r in validation_results if r["id"] == result_id), None)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Result not found")