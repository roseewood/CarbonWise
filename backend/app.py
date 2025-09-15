from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#  Absolute imports so Python can find the routers correctly
from backend.routers import estimate, recommend, coach, factors, auth

# It will create FastAPI app
app = FastAPI(
    title="CarbonWise API",
    description="Backend API for CarbonWise project (Calculator, AI Coach, Auth, Recommendations, etc.)",
    version="1.0.0",
)

# It will allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(estimate.router, prefix="/estimate", tags=["Estimate"])
app.include_router(recommend.router, prefix="/recommend", tags=["Recommend"])
app.include_router(coach.router, prefix="/coach", tags=["Coach"])
app.include_router(factors.router, prefix="/factors", tags=["Factors"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Backend is running with Auth now! 🚀"}
