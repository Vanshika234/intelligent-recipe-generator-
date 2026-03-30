import React, { useState } from "react";
import API from "../services/api";

export default function Checkout() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const [qr, setQr] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    try {

      const email = localStorage.getItem("email");

      if (!email) {
        alert("Login first ❌");
        return;
      }

      if (cartItems.length === 0) {
        alert("Cart empty ❌");
        return;
      }

      const formattedCart = cartItems.map(item => ({
        name: item.name || "Item",
        qty: item.qty ? Number(item.qty) : 1,
        price: Number(item.price)
      }));

      const orderData = {
        email: email,
        items: formattedCart,
        total: total
      };

      const res = await API.post("/orders/", orderData);

      alert("Order placed successfully ✅");

      setQr(res.data.qr_code);

      // ✅ IMPORTANT FIX (cart clear)
      localStorage.removeItem("cart");

    } catch (err) {
      console.error("ERROR FULL:", err);
      alert("Order failed ❌");
    }
  };

  return (
    <div
      className="min-h-screen p-6 md:p-12 font-sans bg-cover bg-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 z-0"></div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white drop-shadow-lg">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT SIDE: Address */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">📍 Delivery Address</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <textarea
              placeholder="Address Line"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
              <input
                type="text"
                placeholder="State"
                className="border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Pincode"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">🛒 Order Summary</h2>

            <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-gray-400">Your cart is empty</p>
              ) : (
                cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-50 transition"
                  >
                    <span>{item.name}</span>
                    <span className="font-semibold text-gray-700">₹{item.price}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t pt-3 space-y-2">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold shadow-lg transition transform hover:scale-105"
            >
              Place Order
            </button>

            {/* QR Code */}
            {qr && (
              <div className="mt-6 text-center">
                <h2 className="text-lg font-bold mb-2 text-gray-700">Scan QR</h2>
                <img src={qr} alt="QR Code" className="mx-auto w-36 rounded-lg shadow-md" />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}