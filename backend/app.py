from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
import backend.routers.estimate as estimate
import backend.routers.recommend as recommend
import backend.routers.coach as coach
import backend.routers.factors as factors
import backend.routers.auth as auth   # ✅ Added auth

# Create FastAPI app
app = FastAPI(
    title="CarbonWise API",
    description="Backend API for CarbonWise project (Calculator, AI Coach, Auth, Recommendations, etc.)",
    version="1.0.0"
)

# Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your React/Vue URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(estimate.router, prefix="/estimate", tags=["Estimate"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommend"])
app.include_router(coach.router, prefix="/coach", tags=["Coach"])
app.include_router(factors.router, prefix="/factors", tags=["Factors"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])   # ✅ Added auth routes

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Backend is running with Auth now! 🚀"}
