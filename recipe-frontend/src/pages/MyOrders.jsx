import React, { useEffect, useState } from "react";
import API from "../services/api";

function MyOrders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const email = localStorage.getItem("email");

      if (!email) return;

      const res = await API.get(`/orders/${email}`);

      setOrders(res.data.orders);

    } catch (error) {
      console.error(error);
    }

  };


  const cancelOrder = (id) => {
    alert("Order Cancelled!");
  };


  const handleReorder = () => {
    alert("Reorder placed again!");
  };


  const getStepIndex = (status) => {

    if (status === "preparing") return 1;
    if (status === "out_for_delivery") return 2;
    if (status === "delivered") return 3;

    return 0;
  };


  const ProgressTracker = ({ status }) => {

    const step = getStepIndex(status);

    return (

      <div className="flex items-center justify-between mt-4">

        <div className={`flex flex-col items-center ${step >= 1 ? "text-orange-500" : "text-gray-400"}`}>
          <span className="text-xl">👨‍🍳</span>
          <p className="text-xs">Preparing</p>
        </div>

        <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-blue-500" : "bg-gray-300"}`} />

        <div className={`flex flex-col items-center ${step >= 2 ? "text-blue-500" : "text-gray-400"}`}>
          <span className="text-xl">🛵</span>
          <p className="text-xs">Out for Delivery</p>
        </div>

        <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-green-500" : "bg-gray-300"}`} />

        <div className={`flex flex-col items-center ${step >= 3 ? "text-green-600" : "text-gray-400"}`}>
          <span className="text-xl">✔</span>
          <p className="text-xs">Delivered</p>
        </div>

      </div>

    );

  };


  return (

    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-vector/food-delivery-concept-illustration_114360-1405.jpg')"
      }}
    >

      <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 shadow-2xl rounded-2xl p-10 w-[750px]">

        <h1 className="text-3xl font-bold text-center mb-2 text-green-700">
          My Orders
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Track your recent purchases
        </p>


        {orders.length === 0 ? (

          <div className="text-center py-10">
            <h3 className="text-gray-600 text-lg">
              You haven't placed any orders yet.
            </h3>
          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="border-l-4 border-green-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition bg-white"
              >

                <div className="flex justify-between items-center mb-3">

                  <h3 className="font-semibold text-lg text-gray-800">
                    Order #{order.id}
                  </h3>

                  <span className="text-green-600 font-semibold">
                    {order.status || "Delivered"}
                  </span>

                </div>


                <div className="text-gray-600 text-sm space-y-1 mb-3">

                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} × {item.qty} — ₹{item.price}
                    </p>
                  ))}

                </div>


                <ProgressTracker status={order.status || "delivered"} />


                <div className="flex justify-between items-center mt-4">

                  <div>

                    <h4 className="font-bold text-gray-800">
                      Total: ₹{order.total}
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "Today"}
                    </p>

                    <p className="text-xs text-blue-600 mt-1">
                      ⏱ Estimated Delivery: 30 - 40 mins
                    </p>

                  </div>


                  <div className="flex items-center gap-3">

                    {order.qr_code && (
                      <img
                        src={`http://127.0.0.1:8000/${order.qr_code}`}
                        alt="QR"
                        className="w-16 h-16 border rounded-lg"
                      />
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Reorder
                    </button>

                    {order.status !== "preparing" && order.status !== "delivered" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default MyOrders;