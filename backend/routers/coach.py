from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
# from ibm_watsonx_ai.foundation_models import Model
# from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
# from ibm_watsonx_ai import Credentials

router = APIRouter()


class CoachRequest(BaseModel):
    locale: str = "IN"
    question: str
    context: dict | None = None

class CoachResponse(BaseModel):
    answer: str

def _get_wx_model():
    api_key = os.getenv("WX_API_KEY")
    region = os.getenv("WX_REGION", "us-south")
    model_id = os.getenv("WX_MODEL_ID", "ibm/granite-13b-instruct-v2")
    if not api_key:
        return None
    creds = Credentials(api_key=api_key, url=f"https://{region}.ml.cloud.ibm.com")
    params = {
        GenParams.DECODING_METHOD: "greedy",
        GenParams.MAX_NEW_TOKENS: 280,
        GenParams.TEMPERATURE: 0.2,
    }
    return Model(model_id=model_id, credentials=creds, params=params)

@router.post("/", response_model=CoachResponse)
def coach(req: CoachRequest):
    """
    Carbon Coach using watsonx.ai Granite.
    Falls back to a local template if WX_API_KEY not set.
    """
    prompt = (
        "You are a friendly carbon coach. Answer with numbered, practical steps.\n"
        f"Locale: {req.locale}\n"
        f"Context: {req.context or {}}\n"
        f"Question: {req.question}\n"
        "Answer:\n"
    )
    model = _get_wx_model()
    if not model:
        # Fallback for local dev
        return CoachResponse(
            answer=("I can’t reach watsonx.ai right now. Try these generic tips:\n"
                    "1) Reduce car trips; prefer metro/bus.\n"
                    "2) Set AC 1°C warmer; switch to LEDs.\n"
                    "3) Eat vegetarian meals twice a week.\n")
        )
    try:
        out = model.generate_text(prompt=prompt)
        text = (out if isinstance(out, str) else out.get("results", [{}])[0].get("generated_text", "")).strip()
        if not text:
            raise RuntimeError("Empty completion")
        return CoachResponse(answer=text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"watsonx.ai error: {e}")
