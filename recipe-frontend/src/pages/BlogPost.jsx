import React, { useState } from "react";
import { createBlog } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BlogPost() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("email", email);
      formData.append("title", title);
      formData.append("content", content);

      if (image) {
        formData.append("image", image);
      }

      await createBlog(formData);

      alert("Blog submitted successfully ✅");

      setTitle("");
      setContent("");
      setImage(null);

      navigate("/blog");

    } catch (err) {

      console.log(err);
      alert("Error creating blog ❌");

    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1498654896293-37aacf113fd9')] bg-cover bg-center flex items-center justify-center px-4">

      <div className="absolute inset-0 bg-black/50" />

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-lg text-white"
      >

        <h2 className="text-3xl font-bold text-center mb-6">
          ✍️ Create Blog
        </h2>

        <input
          value={title}
          placeholder="Enter blog title..."
          className="w-full p-3 mb-4 rounded-xl bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          value={content}
          placeholder="Write your content here..."
          rows={5}
          className="w-full p-3 mb-4 rounded-xl bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="mb-4">
          <label className="block mb-2 text-sm">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 transition font-semibold shadow-lg"
        >
          🚀 Post Blog
        </button>

      </motion.form>
    </div>
  );
}