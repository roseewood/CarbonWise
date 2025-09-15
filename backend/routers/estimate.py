from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict
import math
import os
import time
from cloudant.client import CouchDB
from backend.models import RecommendRequest, RecommendResponse

router = APIRouter()

class EstimateInput(BaseModel):
    transport_mode: str = "car"
    transport_km_per_week: float = 0
    electricity_kwh_per_month: float = 0
    diet: str = "average"
    waste_kg_per_week: float = 0

class EstimateOut(BaseModel):
    total_kgco2e_year: float
    unit: str = "kg CO2e/year"
    breakdown: Dict[str, float]

def _cloudant():
    url = os.getenv("CLOUDANT_URL")
    if not url:
        return None, None
    # Cloudant client with URL credentials; create DB if missing
    client = CouchDB(None, None, url=url, connect=True, auto_renew=True)
    db_name = "estimates"
    if db_name not in client.all_dbs():
        client.create_database(db_name)
    return client, client[db_name]

# VERY SIMPLE factors (replace with your CSV loading logic)
EF = {
    "transport": {"car": 0.192, "bus": 0.082, "metro": 0.028, "bike": 0.0, "walk": 0.0},  # kg/km
    "electricity": {"grid": 0.70},  # kg/kWh
    "diet_mult": {"meat_heavy": 1.3, "average": 1.0, "vegetarian": 0.75, "vegan": 0.6},
    "diet_baseline": 1.9,  # kg/day
    "waste": 0.6  # kg CO2e per kg waste (placeholder)
}

@router.post("/", response_model=EstimateOut)
def estimate(data: EstimateInput):
    # Transport (weekly km → yearly kg)
    t_ef = EF["transport"].get(data.transport_mode, 0.192)
    transport = data.transport_km_per_week * 52 * t_ef

    # Electricity (monthly kWh → yearly kg)
    electricity = data.electricity_kwh_per_month * 12 * EF["electricity"]["grid"]

    # Diet (daily baseline × multiplier × 365)
    diet = EF["diet_baseline"] * EF["diet_mult"].get(data.diet, 1.0) * 365

    # Waste (weekly kg → yearly kg × factor)
    waste = data.waste_kg_per_week * 52 * EF["waste"]

    total = round(transport + electricity + diet + waste, 2)
    breakdown = {
        "Transport": round(transport, 2),
        "Electricity": round(electricity, 2),
        "Food": round(diet, 2),
        "Waste": round(waste, 2),
    }

    # Save to Cloudant (best-effort)
    client, db = _cloudant()
    if db:
        try:
            db.create_document({
                "ts": int(time.time()),
                "breakdown": breakdown,
                "total": total
            })
        except Exception:
            pass

    return EstimateOut(total_kgco2e_year=total, breakdown=breakdown)
