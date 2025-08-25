from fastapi import APIRouter
from backend.models import RecommendRequest, RecommendResponse

router = APIRouter()

def _fmt(n: float) -> str:
    # pretty number, keep at most 1 decimal for large values
    return f"{n:.0f}" if n >= 100 else f"{n:.1f}"

@router.post("/", response_model=RecommendResponse)
def personalized_recommendations(payload: RecommendRequest) -> RecommendResponse:
    """
    Generate simple rule-based, personalized actions based on the largest category.
    Each action includes an estimated annual saving.
    """
    b = payload.breakdown or {}
    if not b:
        return RecommendResponse(recommendations={"Add some data": "We need your estimate breakdown to tailor actions."})

    # Find dominant category
    top_cat = max(b.items(), key=lambda kv: kv[1])[0]

    recs = {}

    if top_cat == "transport":
        # assume shifting 30% of car km to metro
        delta = b["transport"] * 0.30 * 0.85   # rough saving % when shifting to low-carbon mode
        recs["Shift commutes to transit"] = f"Try moving ~30% of weekly trips to metro/bus. Estimated saving: ~{_fmt(delta)} kg CO2e/yr."
        recs["Carpool or ride-share"] = "Share rides 2–3 days/week to cut per-km emissions nearly in half on those days."
        recs["Maintain tire pressure"] = "Keeping tires properly inflated can improve fuel economy 3–5% on car trips."

    if top_cat == "energy":
        # LEDs + AC setpoint + efficient fan usage
        delta = min(b["energy"] * 0.15, 400.0)  # cap the claim
        recs["LED & AC tuning"] = f"Swap remaining bulbs to LED and raise AC setpoint by 1°C. Estimated saving: ~{_fmt(delta)} kg CO2e/yr."
        recs["Smart power strips"] = "Kill standby loads (TV/router/chargers) to save 5–10% electricity."
        recs["Bill audit"] = "Track kWh/month. Spot spikes and fix leaks (old fridge, inefficient water heater)."

    if top_cat == "diet":
        # 2 meat-free days/week
        delta = 2 * 52 * 1.2  # ~1.2 kg/day reduction guess
        recs["2 plant-based days/week"] = f"Adopt 2 meat-free days weekly. Estimated saving: ~{_fmt(delta)} kg CO2e/yr."
        recs["Protein swaps"] = "Try beans, lentils, tofu for some meals—high protein, lower footprint."
        recs["Smart shopping"] = "Prioritize seasonal, local produce to cut transport & refrigeration emissions."

    if top_cat == "waste":
        # 50% food waste reduction & recycling
        delta = b["waste"] * 0.40
        recs["Cut food waste ~40%"] = f"Plan meals, store food better, compost organics. Estimated saving: ~{_fmt(delta)} kg CO2e/yr."
        recs["Recycle metals/paper"] = "Recycling avoids high upstream emissions; set up home sorting."
        recs["Buy durable goods"] = "Choose quality items that last; reduce replacements."

    # Add a couple of general actions
    recs.setdefault("Green tariff / rooftop solar", "If available, switch part of your load to green electricity to decarbonize everything you do at home.")
    recs.setdefault("Efficient travel planning", "Batch errands, prefer direct flights if you must fly, and use public transport for city trips.")

    return RecommendResponse(recommendations=recs)


# Keep a simple GET that returns static suggestions (for old UI)
@router.get("/", response_model=RecommendResponse)
def static_recommendations() -> RecommendResponse:
    return RecommendResponse(
        recommendations={
            "Use public transport": "Shift short car trips to metro/bus when possible.",
            "Switch to LEDs": "LEDs use ~80% less electricity than halogens.",
            "Unplug chargers": "Standby loads add up—use power strips.",
            "Plant-forward meals": "Try one plant-based day per week to start.",
        }
    )
