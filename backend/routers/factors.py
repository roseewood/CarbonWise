from fastapi import APIRouter

router = APIRouter()

@router.get("/factors")
def get_factors():
    return {"message": "Factors endpoint works"}
