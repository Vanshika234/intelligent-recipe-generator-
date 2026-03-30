import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // ✅ Handle null, undefined, empty string
  if (!token || token === "null" || token === "undefined") {
    localStorage.removeItem("token"); // cleanup
    return <Navigate to="/login" replace />;
  }

  return children;
}