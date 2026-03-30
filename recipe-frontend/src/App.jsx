import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import LandingPage from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Shopping from "./pages/Shopping";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

// BLOG
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import BlogDetail from "./pages/BlogDetail";

// ADMIN PANELS
import AdminBlogs from "./pages/AdminBlogs";
import AdminProducts from "./pages/AdminProducts";
import AdminOverview from "./pages/AdminOverview"; // ✅ NEW

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>

          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <History />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/shopping"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Shopping />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Checkout />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* MY ORDERS */}
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyOrders />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* BLOG */}
            <Route path="/blog" element={<Navigate to="/blogs" />} />

            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BlogList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/blog-post"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BlogPost />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/blog/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BlogDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* ADMIN OVERVIEW */}
            <Route
              path="/admin/overview"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdminOverview />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* ADMIN BLOG PANEL */}
            <Route
              path="/admin/blogs"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdminBlogs />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* ADMIN PRODUCT PANEL */}
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdminProducts />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center h-screen text-center">
                  <h1 className="text-5xl font-bold text-red-500">404</h1>
                  <p className="mt-4 text-gray-600">Page Not Found</p>

                  <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Go Home
                  </button>
                </div>
              }
            />

          </Routes>

        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;