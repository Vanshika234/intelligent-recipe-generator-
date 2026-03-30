import axios from "axios";

export const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ✅ Create Blog
export const createBlog = (formData) => {
  return API.post("/blogs/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Get All Blogs
export const getBlogs = () => {
  return API.get("/blogs");
};

// ✅ Get Single Blog
export const getBlogById = (id) => {
  return API.get(`/blogs/detail/${id}`);
};

// ✅ Delete Blog
export const deleteBlog = (id) => {
  return API.delete(`/blogs/${id}`);
};

// ✅ Add Comment
export const addComment = (data) => {
  return API.post("/blogs/comment", data);
};