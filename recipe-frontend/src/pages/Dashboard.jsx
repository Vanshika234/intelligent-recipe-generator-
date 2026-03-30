import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [mode, setMode] = useState("text");
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [recipeText, setRecipeText] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const generateRecipe = async () => {
    try {
      let res;
      setLoading(true);

      if (mode === "text") {
        if (!input.trim()) {
          alert("Enter ingredients");
          setLoading(false);
          return;
        }

        res = await API.post("/recipes/generate", {
          ingredients: input,
        });

      } else {

        if (!image) {
          alert("Upload image first");
          setLoading(false);
          return;
        }

        const formData = new FormData();

        formData.append("file", image);

        res = await API.post(
          "/vision/generate-from-images",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setRecipeText(
        res.data.generated_recipe ||
        res.data.recipe ||
        res.data.text ||
        "No recipe found"
      );

    } catch (err) {

      console.error(err);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } 
      
      // ✅ FIX: backend error message output box me show
      else if (err.response?.data?.detail) {
        setRecipeText(err.response.data.detail);
      } 
      
      else {
        setRecipeText("Error generating recipe ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352')",
      }}
    >

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          🍳 Smart Recipe AI
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Turn ingredients into delicious recipes instantly
        </p>

        <div className="flex justify-center mb-6">

          <div className="flex bg-gray-200 p-1 rounded-xl">

            <button
              onClick={() => setMode("text")}
              className={`px-6 py-2 rounded-lg transition ${
                mode === "text"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              📝 Text
            </button>

            <button
              onClick={() => setMode("image")}
              className={`px-6 py-2 rounded-lg transition ${
                mode === "image"
                  ? "bg-green-600 text-white shadow"
                  : "text-gray-600"
              }`}
            >
              🖼 Image
            </button>

          </div>

        </div>

        {mode === "text" ? (

          <textarea
            rows="3"
            placeholder="e.g. tomato, onion, cheese..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 border rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

        ) : (

          <div className="mb-6 text-center">

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-4"
            />

            {image && (

              <div className="inline-block bg-gray-100 p-3 rounded-xl shadow">

                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />

              </div>

            )}

          </div>

        )}

        <button
          onClick={generateRecipe}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
        >

          {loading ? (
            <>
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Cooking...
            </>
          ) : (
            "🔥 Generate Recipe"
          )}

        </button>

        {recipeText && (

          <div className="mt-8 bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-inner">

            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              🍽 Your Recipe
            </h2>

            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {recipeText}
            </div>

          </div>

        )}

      </div>
    </div>
  );
}