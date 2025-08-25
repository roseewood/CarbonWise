from pydantic import BaseModel, Field
from typing import Dict, Literal, Optional

# ---- Request schema ----
class EstimateRequest(BaseModel):
    # Transport
    transport_mode: Literal["car", "bus", "metro", "bike", "walk"] = Field(
        default="car",
        description="Primary mode of transportation"
    )
    transport_km_per_week: float = Field(
        default=0.0,
        ge=0,
        description="Distance traveled by transport per week in kilometers"
    )

    # Home energy
    electricity_kwh_per_month: float = Field(
        default=0.0,
        ge=0,
        description="Monthly electricity consumption in kWh"
    )

    # Diet
    diet: Literal["meat_heavy", "average", "vegetarian", "vegan"] = Field(
        default="average",
        description="Diet type"
    )

    # Waste
    waste_kg_per_week: float = Field(
        default=0.0,
        ge=0,
        description="Waste generated per week in kilograms"
    )


# ---- Response schema ----
class EstimateResponse(BaseModel):
    total_kgco2e_year: float = Field(..., description="Total annual footprint")
    breakdown: Dict[str, float] = Field(..., description="Breakdown by category")
    percentages: Dict[str, float] = Field(..., description="Percentage share per category")
    unit: str = Field(default="kg CO2e/year", description="Unit of measurement")


# ---- Recommendation request/response ----
class RecommendRequest(BaseModel):
    breakdown: Dict[str, float] = Field(..., description="Breakdown from /estimate")
    inputs: Optional[EstimateRequest] = Field(
        default=None,
        description="Original inputs from the estimate request"
    )


class RecommendResponse(BaseModel):
    recommendations: Dict[str, str] = Field(
        ...,
        description="Mapping of recommendation title to explanation text"
    )
