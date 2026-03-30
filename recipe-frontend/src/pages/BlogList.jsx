import React, { useEffect, useState } from "react";
import { getBlogs, deleteBlog } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function BlogList() {

  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {

    try {

      const res = await getBlogs();
      const data = res.data || [];
      setBlogs(data);

    } catch (err) {

      console.error("Fetch error:", err);

    }

  };

  const handleDelete = async (id) => {

    try {

      const confirmDelete = window.confirm("Delete this blog?");
      if (!confirmDelete) return;

      await deleteBlog(id);

      setBlogs((prev) => prev.filter((b) => b.id !== id));

    } catch (err) {

      console.error("Delete error:", err);

    }

  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1492724441997-5dc865305da7')",
      }}
    >

      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative z-10">

        <div className="flex justify-between items-center mb-10">

          <h1 className="text-4xl font-bold text-white tracking-wide drop-shadow-lg">
            ✍️ Community Blogs
          </h1>

          <button
            onClick={() => navigate("/blog-post")}
            className="bg-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-green-700 hover:scale-105 transition duration-300"
          >
            + Create Blog
          </button>

        </div>

        {blogs.length === 0 ? (

          <div className="flex flex-col items-center justify-center mt-32 text-center">

            <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-lg">

              <h2 className="text-2xl font-bold text-white mb-4">
                🚀 Your blogging journey starts here
              </h2>

              <p className="text-white/90 mb-6">
                Looks like you haven’t written any blogs yet.
                Share your ideas, recipes, or thoughts with the world 🌍
              </p>

              <button
                onClick={() => navigate("/blog-post")}
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 hover:scale-105 transition"
              >
                ✨ Create Your First Blog
              </button>

            </div>

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-8">

            {blogs.map((b) => (

              <div
                key={b.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:scale-105 hover:shadow-2xl transition duration-300"
              >

                <img
                  src={
                    b.image
                      ? `http://127.0.0.1:8000${b.image}`
                      : "https://images.unsplash.com/photo-1492724441997-5dc865305da7"
                  }
                  className="h-48 w-full object-cover"
                  alt="blog"
                />

                <div className="p-5">

                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {b.title}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {b.content}
                  </p>

                  <div className="flex justify-between items-center mt-4">

                    <button
                      onClick={() => navigate(`/blog/${b.id}`)}
                      className="text-green-600 font-medium hover:underline"
                    >
                      Read More →
                    </button>

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-500 font-medium hover:underline"
                    >
                      Delete 🗑️
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}