import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md fixed w-full top-0 z-50">
        <h1 className="text-xl font-bold text-orange-500">🍲 RecipeAI</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <div className="h-screen flex items-center px-10 bg-gradient-to-r from-orange-100 to-yellow-50 pt-20">

        {/* LEFT TEXT */}
        <div className="w-1/2">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 animate-fadeIn">
            Transform Your Cooking with AI Powered Recipes🍲
          </h1>

          <p className="mb-6 text-lg text-gray-600">
            Get personalized recipes using ingredients you already have.
            AI will help you cook smarter & faster.
            Healthy Switcher chef handle all the prep work --
            like peeling, chopping and marinating 
            so you can easily cook fresh meals
          </p>

          <button
            onClick={() => navigate("/register")}
            className="bg-orange-500 text-white px-6 py-2 rounded text-lg hover:bg-orange-600 transition"
          >
            Get Started
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-1/2 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            alt="food"
            className="rounded-xl shadow-lg w-[400px] hover:scale-105 transition duration-300"
          />
        </div>
      </div>

      {/* 🔥 HOW IT WORKS */}
      <div className="py-20 px-6 bg-gradient-to-r from-yellow-100 to-orange-200 text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h3 className="font-bold text-lg mb-2">🥗 Pick Ingredients</h3>
            <p>Enter ingredients you have at home</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h3 className="font-bold text-lg mb-2">🤖 AI Generates</h3>
            <p>Get smart recipes instantly</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            <h3 className="font-bold text-lg mb-2">🍽 Cook & Enjoy</h3>
            <p>Follow steps and enjoy your meal</p>
          </div>
        </div>
      </div>

      {/* 🔥 FEATURES */}
      <div className="py-20 px-6 bg-gradient-to-r from-green-100 to-blue-200 text-center">
        <h2 className="text-3xl font-bold mb-10">
          Powerful Features for Every Cook
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            📸 Image OCR
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            📜 History Tracking
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
            🛒 Smart Shopping
          </div>
        </div>
      </div>

      {/* 🔥 RECIPES */}
      <div className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-10">
          AI Generated Recipes
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
              className="rounded mb-2"
            />
            <p className="font-semibold">Grilled Paneer Bowl</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              className="rounded mb-2"
            />
            <p className="font-semibold">Healthy Veg Mix</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow hover:scale-105 transition">
            <img
              src="https://images.unsplash.com/photo-1525755662778-989d0524087e"
              className="rounded mb-2"
            />
            <p className="font-semibold">Boiled Egg Salad</p>
          </div>
        </div>
      </div>

      {/* 🔥 CTA */}
      <div className="py-20 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Cooking?
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="bg-white text-orange-500 px-6 py-2 rounded hover:scale-105 transition"
        >
          Get Started Free
        </button>
      </div>

      {/* 🔥 FOOTER */}
      <div className="bg-gray-900 text-white text-center py-6">
        <p>© 2026 RecipeAI | All Rights Reserved</p>
      </div>
    </div>
  );
}