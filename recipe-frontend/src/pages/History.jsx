import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Trash2, Star } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();

    // Load favorites from localStorage
    const fav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(fav);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/recipes/history");
      setHistory(res.data.history || []);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ⭐ Toggle Favorite
  const toggleFavorite = (item) => {
    let updated;
    if (favorites.some(f => f.recipe === item.recipe)) {
      updated = favorites.filter(f => f.recipe !== item.recipe);
    } else {
      updated = [...favorites, item];
    }
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // 🗑 Delete History Item
  const deleteItem = (index) => {
    const updated = [...history];
    updated.splice(index, 1);
    setHistory(updated);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6 font-sans"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* 🔥 Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full shadow hover:bg-white/30 transition"
          >
            ⬅ Back
          </button>

          <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
            📜 Recipe History
          </h1>

          <button
            onClick={() => navigate("/favorites")}
            className="bg-yellow-400 text-black px-5 py-2 rounded-full shadow hover:bg-yellow-500 transition font-semibold"
          >
            ⭐ Favorites
          </button>
        </div>

        {/* Empty State */}
        {history.length === 0 ? (
          <p className="text-white text-lg text-center mt-20">
            No history found 😔
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {history.map((item, index) => {
              const isFav = favorites.some(f => f.recipe === item.recipe);

              return (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md p-5 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 flex flex-col justify-between"
                >
                  {/* Top Actions */}
                  <div className="flex justify-between mb-3">
                    <button
                      onClick={() => toggleFavorite(item)}
                      className={`p-2 rounded-full ${
                        isFav ? "bg-yellow-400 text-black" : "bg-white/30 text-white"
                      }`}
                    >
                      <Star size={18} />
                    </button>

                    <button
                      onClick={() => deleteItem(index)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div>
                    <p className="font-semibold text-lg text-white mb-2">
                      🥗 Ingredients:
                    </p>
                    <p className="text-white/90 mb-3 text-sm">
                      {item.ingredients}
                    </p>

                    <p className="font-semibold text-lg text-white mb-2">
                      🍲 Recipe:
                    </p>
                    <pre className="whitespace-pre-wrap text-white/90 text-sm max-h-40 overflow-y-auto">
                      {item.recipe}
                    </pre>
                  </div>

                  {/* Footer */}
                  <p className="text-xs text-white/70 mt-4">
                    Saved Recipe #{index + 1}
                  </p>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}