import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const { totalItems } = useCart();
  const [openMenu, setOpenMenu] = useState(false);

  const userName = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email");

  // ADMIN CHECK
  const isAdmin =
    email === "admin@gmail.com" || email === "vanshika@gmail.com";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-600 font-semibold border-b-2 border-green-600"
      : "text-gray-700";

  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-50">

      {/* Logo */}
      <h1
        className="text-2xl font-bold cursor-pointer text-green-700"
        onClick={() => navigate("/")}
      >
        🍲 RecipeAI
      </h1>

      <div className="flex gap-6 items-center">

        {!token ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            {/* Dashboard (USER ONLY) */}
            {!isAdmin && (
              <button
                onClick={() => navigate("/dashboard")}
                className={`${isActive("/dashboard")} hover:text-green-600`}
              >
                Dashboard
              </button>
            )}

            {/* Shopping */}
            <button
              onClick={() => navigate("/shopping")}
              className={`${isActive("/shopping")} hover:text-green-600`}
            >
              Shopping
            </button>

            {/* History (USER ONLY) */}
            {!isAdmin && (
              <button
                onClick={() => navigate("/history")}
                className={`${isActive("/history")} hover:text-green-600`}
              >
                History
              </button>
            )}

            {/* Analytics (USER ONLY) */}
            {!isAdmin && (
              <button
                onClick={() => navigate("/analytics")}
                className={`${isActive("/analytics")} hover:text-green-600`}
              >
                Analytics
              </button>
            )}

            {/* Blog */}
            <button
              onClick={() => navigate("/blogs")}
              className={`${isActive("/blogs")} hover:text-green-600`}
            >
              Blog
            </button>

            {/* ADMIN OVERVIEW */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/overview")}
                className={`${isActive("/admin/overview")} hover:text-green-600`}
              >
                Admin Overview
              </button>
            )}

            {/* ADMIN BLOG PANEL */}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin/blogs")}
                className={`${isActive("/admin/blogs")} hover:text-green-600`}
              >
                Admin Blogs
              </button>
            )}

            {/* Cart */}
            <div
              onClick={() => navigate("/checkout")}
              className="relative cursor-pointer hover:scale-105 transition"
            >
              <ShoppingCart size={22} />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">

              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                <User size={18} />
                {userName}
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-3 w-44 bg-white border rounded-xl shadow-lg">

                  <button
                    onClick={() => navigate("/my-orders")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    📦 My Orders
                  </button>

                  {/* ADMIN OVERVIEW */}
                  {isAdmin && (
                    <button
                      onClick={() => navigate("/admin/overview")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      📊 Admin Overview
                    </button>
                  )}

                  {/* ADMIN PRODUCTS */}
                  {isAdmin && (
                    <button
                      onClick={() => navigate("/admin/products")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      🛒 Admin Products
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}