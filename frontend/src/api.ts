const API_BASE_URL = "http://localhost:8000"; // FastAPI backend

//  Generic POST helper
export async function postJSON<T>(endpoint: string, data: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Specific endpoint
export async function getEstimate(data: unknown) {
  return postJSON("/estimate", data);
}

export async function getRecommendation(data: unknown) {
  return postJSON("/recommend", data);
}

export async function getCoach(data: unknown) {
  return postJSON("/coach", data);
}

export async function getFactors() {
  const res = await fetch(`${API_BASE_URL}/factors`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
