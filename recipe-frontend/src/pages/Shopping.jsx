import React, { useState, useEffect } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Shop() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {

    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(existing.length);

    const adminProducts = JSON.parse(localStorage.getItem("adminProducts")) || [];
    setProducts(adminProducts);

  }, []);

  const changeQty = (name, value) => {

    setQuantities(prev => ({
      ...prev,
      [name]: Math.max(1, (prev[name] || 1) + value)
    }));

  };

  const handleAddToCart = (item) => {

    if (!item.stock) return;

    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const qty = quantities[item.name] || 1;

    const updated = [...existing, ...Array(qty).fill(item)];

    localStorage.setItem("cart", JSON.stringify(updated));

    setCartCount(updated.length);

    setToast(`${item.name} added to cart ✅`);
    setTimeout(() => setToast(null), 2000);

  };

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (

    <div className="min-h-screen bg-cover bg-center relative p-6 font-sans"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1200&q=80')" }}>

      <div className="absolute inset-0 bg-black/25 z-0"></div>

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6 sticky top-0 z-20 py-4">

          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            RecipeAI Shop
          </h1>

          <div className="flex items-center gap-6">

            <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>

              <ShoppingCart className="text-white" size={28} />

              {cartCount > 0 &&
                <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              }

            </div>

            <button className="bg-green-700 text-white px-5 py-2 rounded-full">
              Logout
            </button>

          </div>

        </div>

        {/* PRODUCTS */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map((item, i) => (

            <div key={i}
              className={`bg-white/30 backdrop-blur-md p-5 rounded-3xl shadow-lg flex flex-col items-center text-center
              ${!item.stock && "opacity-50"}`}>

              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover mb-4 rounded-2xl"
              />

              <h2 className="font-semibold text-lg">{item.name}</h2>

              <p className="text-gray-800 mb-3 font-medium">₹{item.price}</p>

              {!item.stock && (
                <p className="text-red-600 font-semibold mb-2">
                  Out of Stock
                </p>
              )}

              <div className="flex items-center gap-2 w-full">

                <button
                  onClick={() => changeQty(item.name, -1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                  disabled={!item.stock}
                >
                  -
                </button>

                <span className="font-semibold w-6 text-center">
                  {quantities[item.name] || 1}
                </span>

                <button
                  onClick={() => changeQty(item.name, 1)}
                  className="bg-gray-200 px-3 py-1 rounded"
                  disabled={!item.stock}
                >
                  +
                </button>

                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.stock}
                  className={`flex-1 py-2 rounded-full text-white
                  ${item.stock
                      ? "bg-green-700 hover:bg-green-800"
                      : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                  {item.stock ? "Add" : "Out"}
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* CHECKOUT BUTTON */}

        <div className="fixed bottom-6 right-6">

          <button
            onClick={handleCheckout}
            className="bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-800"
          >
            Proceed to Checkout
          </button>

        </div>

        {/* CART MODAL */}

        {cartOpen && (

          <div className="fixed inset-0 bg-black/40 flex justify-end">

            <div className="w-80 bg-white p-6 shadow-xl relative">

              <button
                onClick={() => setCartOpen(false)}
                className="absolute top-4 right-4"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-green-700 mb-4">
                Your Cart
              </h2>

              <div className="flex flex-col gap-3">

                {cartItems.length === 0 && <p>Cart is empty</p>}

                {cartItems.map((item, i) => (

                  <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">

                    <span>{item.name}</span>
                    <span>₹{item.price}</span>

                  </div>

                ))}

              </div>

              <div className="mt-4 border-t pt-3 flex justify-between font-bold text-green-700">

                <span>Total:</span>
                <span>₹{totalPrice}</span>

              </div>

              <button
                onClick={handleCheckout}
                className="mt-4 w-full bg-green-700 text-white py-2 rounded-full"
              >
                Checkout
              </button>

            </div>

          </div>

        )}

        {/* TOAST */}

        {toast && (

          <div className="fixed bottom-24 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">
            {toast}
          </div>

        )}

      </div>

    </div>

  );

}