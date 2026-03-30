import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminBlogs() {

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const API = "http://127.0.0.1:8000";

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API}/blogs/admin/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const approveBlog = async (id) => {
    try {
      await axios.put(`${API}/blogs/admin/approve/${id}`);
      fetchBlogs();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectBlog = async (id) => {
    try {
      await axios.put(`${API}/blogs/admin/reject/${id}`);
      fetchBlogs();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${API}/blogs/admin/delete/${id}`);
      fetchBlogs();
    } catch (err) {
      console.log(err);
    }
  };

  // Pending Count
  const pendingCount = blogs.filter((blog) => blog.status === "pending").length;

  // Filtering + Search
  const filteredBlogs = blogs
    .filter((blog) => {
      if (filter === "all") return true;
      return blog.status === filter;
    })
    .filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center p-10"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1492724441997-5dc865305da7)"
      }}
    >

      <div className="min-h-screen bg-black/60 p-10 rounded-xl backdrop-blur">

        <h1 className="text-4xl font-bold mb-4 text-white text-center">
          📝 Admin Blog Panel
        </h1>

        {/* ⭐ Pending Count UI */}
        <div className="flex justify-center mb-8">

          <button
            onClick={() => setFilter("pending")}
            className="flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300"
          >

            ⏳ Pending Blogs

            <span className="bg-white text-yellow-600 font-bold px-3 py-1 rounded-full">
              {pendingCount}
            </span>

          </button>

        </div>

        {/* SEARCH */}
        <div className="mb-6 flex justify-between flex-wrap gap-4">

          <input
            type="text"
            placeholder="Search blog title..."
            className="p-2 rounded-lg w-60"
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* FILTER BUTTONS */}
          <div className="flex gap-3">

            <button
              onClick={() => setFilter("all")}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
            >
              All
            </button>

            <button
              onClick={() => setFilter("pending")}
              className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg"
            >
              Pending
            </button>

            <button
              onClick={() => setFilter("approved")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("rejected")}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Rejected
            </button>

          </div>

        </div>

        {/* BLOG TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full bg-white rounded-xl overflow-hidden">

            <thead className="bg-gray-200">

              <tr className="text-left">

                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Email</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredBlogs.map((blog) => (

                <tr key={blog.id} className="border-b">

                  <td className="p-3">
                    <img
                      src={
                        blog.image
                          ? `${API}${blog.image}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={blog.title}
                      className="h-16 w-20 object-cover rounded"
                    />
                  </td>

                  <td className="p-3 font-semibold">
                    {blog.title}
                  </td>

                  <td className="p-3 text-gray-600">
                    {blog.email}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 text-xs rounded-full
                      ${
                        blog.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : blog.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.status}
                    </span>

                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() => approveBlog(blog.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => rejectBlog(blog.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => deleteBlog(blog.id)}
                      className="bg-gray-800 hover:bg-black text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}