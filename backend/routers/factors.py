from fastapi import APIRouter
from backend.models import RecommendRequest, RecommendResponse

router = APIRouter()

@router.get("/factors")
def get_factors():
    return {"message": "Factors endpoint works"}
