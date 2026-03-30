import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProducts() {

  const API = "http://127.0.0.1:8000";

  const defaultProducts = [
    { id: 1, name: "Potato", price: 35, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 2, name: "Onion", price: 50, image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 3, name: "Milk", price: 55, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 4, name: "Cheese", price: 200, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 5, name: "Rice", price: 80, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 6, name: "Tomato", price: 40, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 7, name: "Bread", price: 30, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 8, name: "Strawberry", price: 180, image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 9, name: "Apple", price: 30, image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 10, name: "Broccoli", price: 90, image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 11, name: "Spinach", price: 35, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 12, name: "Corn", price: 50, image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 13, name: "Cucumber", price: 35, image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 14, name: "Green Chilli", price: 40, image: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 15, name: "Lettuce", price: 70, image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=300&q=80", stock: true },
    { id: 16, name: "Coffee", price: 150, image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=300&q=80", stock: true }
  ];

  const [products, setProducts] = useState(defaultProducts);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("adminProducts");
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      localStorage.setItem("adminProducts", JSON.stringify(defaultProducts));
    }
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const res = await axios.post(`${API}/products/`, formData);
      const newProduct = { ...res.data.product, stock: true };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem("adminProducts", JSON.stringify(updated));
      setName("");
      setPrice("");
      setImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = (id) => {
    const confirmDelete = window.confirm("Delete this product?");
    if (!confirmDelete) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("adminProducts", JSON.stringify(updated));
  };

  const toggleStock = (id) => {
    const updated = products.map(p => p.id === id ? { ...p, stock: !p.stock } : p);
    setProducts(updated);
    localStorage.setItem("adminProducts", JSON.stringify(updated));
  };

  const totalProducts = products.length;
  const inStock = products.filter(p => p.stock).length;
  const outStock = products.filter(p => !p.stock).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10">

      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-10">

        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          🛒 Admin Product Management
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-10">

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center
                          transform transition duration-300 hover:scale-105">
            <div>
              <p className="text-sm">Total Products</p>
              <h2 className="text-4xl font-bold">{totalProducts}</h2>
            </div>
            <span className="text-3xl">📦</span>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center
                          transform transition duration-300 hover:scale-105">
            <div>
              <p className="text-sm">In Stock</p>
              <h2 className="text-4xl font-bold">{inStock}</h2>
            </div>
            <span className="text-3xl">🟢</span>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center
                          transform transition duration-300 hover:scale-105">
            <div>
              <p className="text-sm">Out of Stock</p>
              <h2 className="text-4xl font-bold">{outStock}</h2>
            </div>
            <span className="text-3xl">🔴</span>
          </div>

        </div>

        {/* Add Product Form */}
        <form onSubmit={addProduct} className="bg-gray-100 p-6 rounded-xl shadow flex flex-wrap gap-4 mb-8">
          <input type="text" placeholder="Product Name"
                 className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
                 value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Price"
                 className="border p-3 rounded-lg w-40 focus:ring-2 focus:ring-blue-400 outline-none"
                 value={price} onChange={(e) => setPrice(e.target.value)} required />
          <input type="file" className="border p-3 rounded-lg" onChange={(e) => setImage(e.target.files[0])} required />
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow">
            + Add Product
          </button>
        </form>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img src={p.image.startsWith("http") ? p.image : `${API}${p.image}`}
                         className="h-16 w-16 rounded-lg object-cover shadow-md"
                         alt={p.name} />
                  </td>
                  <td className="p-4 font-semibold text-gray-700">{p.name}</td>
                  <td className="p-4 text-gray-600">₹ {p.price}</td>
                  <td className="p-4">
                    <button onClick={() => toggleStock(p.id)}
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${
                              p.stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                      {p.stock ? "In Stock" : "Out of Stock"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteProduct(p.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow">
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