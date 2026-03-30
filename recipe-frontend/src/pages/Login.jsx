import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required ❌");
      return;
    }

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await API.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // ✅ Save token
      localStorage.setItem("token", res.data.access_token);

      // ✅ Save email
      localStorage.setItem("email", email);

      // ✅ Generate username
      const nameFromEmail = email.split("@")[0];
      const formattedName =
        nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

      localStorage.setItem("username", formattedName);

      alert("Login Successful ✅");

      // ✅ ADMIN LOGIN CHECK
      if (email === "admin@gmail.com" || email === "vanshika@gmail.com") {
        navigate("/admin/overview");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      alert(err.response?.data?.detail || "Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061')",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          🥗 Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}