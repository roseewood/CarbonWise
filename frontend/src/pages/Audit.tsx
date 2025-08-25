import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type EstimateResp = {
  total_kgco2e_year: number;
  unit: string;
  breakdown: Record<string, number>;
};

export default function Audit() {
  const [formData, setFormData] = useState({
    transport_mode: "car",
    transport_km_per_week: "",
    electricity_kwh_per_month: "",
    diet: "average",
    waste_kg_per_week: "",
  });
  const [estimate, setEstimate] = useState<EstimateResp | null>(null);
  const [recs, setRecs] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          transport_km_per_week: parseFloat(
            formData.transport_km_per_week || "0"
          ),
          electricity_kwh_per_month: parseFloat(
            formData.electricity_kwh_per_month || "0"
          ),
          waste_kg_per_week: parseFloat(formData.waste_kg_per_week || "0"),
        }),
      });
      const data: EstimateResp = await res.json();
      setEstimate(data);

      const r = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ breakdown: data.breakdown }),
      });
      const rdata = await r.json();
      setRecs(rdata.recommendations || null);
    } finally {
      setLoading(false);
    }
  }

  const pie = estimate
    ? {
        labels: Object.keys(estimate.breakdown),
        datasets: [
          {
            data: Object.values(estimate.breakdown),
            label: "kg CO₂e/year",
            backgroundColor: [
              "#3c7250ff",
              "#455971ff",
              "#af8823ff",
              "#883636ff",
              "#4d3365ff",
            ],
          },
        ],
      }
    : undefined;

  const pieOptions: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        labels: {
          color: "white", // white text for dark bg
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="audit-page">
    <div className="container calculator">
      <div className="grid grid-2">
        {/* Quick Audit */}
        <form onSubmit={handleSubmit} className="card audit-card">
          <h2 className="h2">Quick Audit</h2>
          <div className="form-grid">
            <label>
              Transport Mode
              <select
                name="transport_mode"
                value={formData.transport_mode}
                onChange={handleChange}
                className="select"
              >
                <option value="car">Car</option>
                <option value="bus">Bus</option>
                <option value="metro">Metro</option>
                <option value="bike">Bike</option>
                <option value="walk">Walk</option>
              </select>
            </label>

            <label>
              Transport Distance (km/week)
              <input
                name="transport_km_per_week"
                type="number"
                value={formData.transport_km_per_week}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label>
              Electricity (kWh/month)
              <input
                name="electricity_kwh_per_month"
                type="number"
                value={formData.electricity_kwh_per_month}
                onChange={handleChange}
                className="input"
              />
            </label>

            <label>
              Diet
              <select
                name="diet"
                value={formData.diet}
                onChange={handleChange}
                className="select"
              >
                <option value="meat_heavy">Meat Heavy</option>
                <option value="average">Average</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </label>

            <label>
              Waste (kg/week)
              <input
                name="waste_kg_per_week"
                type="number"
                value={formData.waste_kg_per_week}
                onChange={handleChange}
                className="input"
              />
            </label>
          </div>
          <button className="btn mt-24" disabled={loading}>
            {loading ? "Calculating…" : "Estimate"}
          </button>
        </form>

        {/* Breakdown */}
        <div className="card breakdown-card">
          <h2 className="h2">Breakdown</h2>
          {pie ? <Pie data={pie} options={pieOptions} /> : <p>No data yet.</p>}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-2-even mt-24">
        <div className="card">
          <h2 className="h2">Your Annual Footprint</h2>
          {estimate ? (
            <p className="h3">
              {estimate.total_kgco2e_year} {estimate.unit}
            </p>
          ) : (
            <p>Run an estimate to see results.</p>
          )}
        </div>

        <div className="card">
          <h2 className="h2">Recommendations</h2>
          {recs ? (
            <ul>
              {Object.entries(recs).map(([k, v]) => (
                <li key={k}>
                  <strong>{k}:</strong> {String(v)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Your top actions will appear here after estimation.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

