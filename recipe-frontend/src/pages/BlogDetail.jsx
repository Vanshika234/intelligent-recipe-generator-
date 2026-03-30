import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BlogDetail() {
  const { id } = useParams();

  const [blog, setBlog] = useState({});
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch blog details
  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/blogs/detail/${id}`);
      setBlog(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching blog:", err);
      setLoading(false);
    }
  };

  // Handle comment submission
  const handleComment = async () => {
    if (!comment.trim()) return alert("Comment empty hai");

    try {
      const formData = new FormData();
      formData.append("blog_id", Number(id));
      formData.append("text", comment.trim());

      await axios.post("http://127.0.0.1:8000/blogs/comment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setComment("");
      fetchBlog(); // refresh comments
    } catch (err) {
      console.error("Comment Error:", err);
      alert(
        err.response?.data?.detail || "Something went wrong. Comment not added ❌"
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-semibold">
        Loading blog...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 flex justify-center items-center p-6">

      {/* Glass Card */}
      <div className="backdrop-blur-lg bg-white/70 shadow-2xl rounded-2xl p-6 max-w-3xl w-full">

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🍽 {blog.title}
        </h1>

        {/* BLOG IMAGE */}
        <img
          src={
            blog.image
              ? `http://127.0.0.1:8000${blog.image}`
              : "https://images.unsplash.com/photo-1492724441997-5dc865305da7"
          }
          className="w-full h-64 object-cover rounded-xl shadow-md hover:scale-105 transition duration-300"
          alt={blog.title}
        />

        {/* BLOG CONTENT */}
        <p className="mt-4 text-gray-700 leading-relaxed">
          {blog.content}
        </p>

        {/* COMMENTS SECTION */}
        <div className="mt-6">

          <h2 className="text-xl font-semibold text-gray-800">
            Comments 💬
          </h2>

          {/* COMMENT INPUT */}
          <div className="flex gap-2 mt-3">

            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write something..."
              className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleComment}
              className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg shadow"
            >
              Post
            </button>

          </div>

          {/* COMMENT LIST */}
          <div className="mt-4 space-y-2">

            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/80 p-2 rounded-lg shadow-sm"
                >
                  💬 {c}
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No comments yet
              </p>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}