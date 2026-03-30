import React from "react";

export default function RecipeCard({ ingredients, recipe }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-lg mt-4">
      
      <h3 className="text-lg font-bold text-green-700 mb-2">
        🍽 Ingredients
      </h3>
      <p className="text-gray-700 mb-3">
        {ingredients}
      </p>

      <h3 className="text-lg font-bold text-green-700 mb-2">
        🍲 Recipe
      </h3>
      <p className="text-gray-800 whitespace-pre-line">
        {recipe}
      </p>

    </div>
  );
}