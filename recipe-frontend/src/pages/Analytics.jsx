import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TrendingUp, ChefHat, BarChart3 } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [history, setHistory] = useState([]);
  const [ingredientCount, setIngredientCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/recipes/history");

      const historyData = res.data.history || [];
      setHistory(historyData);

      const counts = {};
      historyData.forEach((item) => {
        if (item.ingredients) {
          item.ingredients.split(",").forEach((ing) => {
            const clean = ing.trim().toLowerCase();
            if (clean) counts[clean] = (counts[clean] || 0) + 1;
          });
        }
      });

      setIngredientCount(counts);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const topIngredient =
    Object.keys(ingredientCount).length > 0
      ? Object.keys(ingredientCount).reduce((a, b) =>
          ingredientCount[a] > ingredientCount[b] ? a : b
        )
      : "N/A";

  const data = {
    labels: history.map((_, index) => `Recipe ${index + 1}`),
    datasets: [
      {
        label: "Recipes Generated",
        data: history.map(() => 1),
        backgroundColor: "rgba(34,197,94,0.7)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Recipe Activity",
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6 font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2">
            📊 Analytics Dashboard
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full shadow hover:bg-white/30 transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-white text-center text-lg">Loading analytics...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-center font-semibold">{error}</p>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* 🔥 Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg text-center hover:scale-105 transition">
                <TrendingUp className="mx-auto text-green-300 mb-2" />
                <h2 className="text-white text-lg">Total Recipes</h2>
                <p className="text-3xl font-bold text-white mt-2">
                  {history.length}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg text-center hover:scale-105 transition">
                <BarChart3 className="mx-auto text-blue-300 mb-2" />
                <h2 className="text-white text-lg">Unique Ingredients</h2>
                <p className="text-3xl font-bold text-white mt-2">
                  {Object.keys(ingredientCount).length}
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg text-center hover:scale-105 transition">
                <ChefHat className="mx-auto text-purple-300 mb-2" />
                <h2 className="text-white text-lg">Top Ingredient</h2>
                <p className="text-xl font-bold text-white mt-2 capitalize">
                  {topIngredient}
                </p>
              </div>
            </div>

            {/* 📊 Chart */}
            {history.length === 0 ? (
              <p className="text-white text-center text-lg">
                No data available 📭
              </p>
            ) : (
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg">
                <Bar data={data} options={options} />
              </div>
            )}

            {/* 🧠 Insights */}
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl shadow-lg mt-8">
              <h2 className="text-white font-semibold text-lg mb-3">
                🧠 Insights
              </h2>

              <p className="text-white">
                Total recipes generated:{" "}
                <span className="font-bold">{history.length}</span>
              </p>

              <p className="text-white mt-1">
                Most used ingredient:{" "}
                <span className="font-bold capitalize">{topIngredient}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}