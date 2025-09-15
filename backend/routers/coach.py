from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import requests
from backend.models import RecommendRequest, RecommendResponse

router = APIRouter()


class CoachRequest(BaseModel):
    locale: str = "IN"
    question: str
    context: dict | None = None


class CoachResponse(BaseModel):
    answer: str



# Simple keyword filter (to block non-environment queries)

ALLOWED_KEYWORDS = [
    "climate", "emission", "carbon", "sustainab", "renewable",
    "solar", "wind", "transport", "recycle", "compost", "waste",
    "pollution", "energy", "biodiversity", "ecosystem", "healthy",
    "lifestyle", "water", "air", "forest", "tree", "green"
]

DENY_KEYWORDS = ["football", "cricket", "movie", "celebrity"]


def is_allowed_query(text: str) -> bool:
    t = text.lower()
    if any(bad in t for bad in DENY_KEYWORDS):
        return False
    return any(good in t for good in ALLOWED_KEYWORDS)



# Choose your AI provider

def call_huggingface(prompt: str) -> str:
    """Example using Hugging Face Inference API (free tier)."""
    hf_token = os.getenv("HF_TOKEN")
    hf_model = os.getenv("HF_MODEL", "tiiuae/falcon-7b-instruct")  # change if needed

    if not hf_token:
        return "⚠️ HuggingFace API token not set. Please add HF_TOKEN to .env."

    try:
        resp = requests.post(
            f"https://api-inference.huggingface.co/models/{hf_model}",
            headers={"Authorization": f"Bearer {hf_token}"},
            json={"inputs": prompt, "parameters": {"max_new_tokens": 200, "temperature": 0.2}},
            timeout=60,
        )
        data = resp.json()
        if isinstance(data, list) and "generated_text" in data[0]:
            return data[0]["generated_text"]
        return str(data)[:500]
    except Exception as e:
        return f"❌ HuggingFace error: {e}"



# API Route

@router.post("/", response_model=CoachResponse)
def coach(req: CoachRequest):
    """
    Carbon Coach API.
    Answers only environment/sustainability/healthy lifestyle questions.
    """

    if not is_allowed_query(req.question):
        return CoachResponse(
            answer="❌ I only answer questions about environment, sustainability, and healthy lifestyle."
        )

    # Prompt template
    prompt = (
        "You are CarbonWise AI Coach. Answer clearly, with practical, numbered steps.\n"
        f"Locale: {req.locale}\n"
        f"Context: {req.context or {}}\n"
        f"Question: {req.question}\n"
        "Answer:\n"
    )

    # Call Hugging Face (or replace with local model call)
    answer = call_huggingface(prompt)

    # Fallback if empty
    if not answer.strip():
        answer = (
            "Here are some general eco-friendly tips:\n"
            "1) Use public transport or cycle more often.\n"
            "2) Reduce food waste and compost leftovers.\n"
            "3) Save energy by switching to LED bulbs.\n"
        )

    return CoachResponse(answer=answer.strip())
