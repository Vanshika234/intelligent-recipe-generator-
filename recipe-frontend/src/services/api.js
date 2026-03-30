import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// TOKEN AUTO ADD
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;


// CREATE BLOG
export const createBlog = (formData) =>
  API.post("/blogs/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


// GET BLOGS
export const getBlogs = () =>
  API.get("/blogs/");


// GET SINGLE BLOG
export const getBlogById = (id) =>
  API.get(`/blogs/detail/${id}`);


// DELETE BLOG
export const deleteBlog = (id) =>
  API.delete(`/blogs/${id}`);


// ADD COMMENT
export const addComment = (formData) =>
  API.post("/blogs/comment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });