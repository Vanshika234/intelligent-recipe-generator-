import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function AdminOverview() {

  const [stats, setStats] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [dark, setDark] = useState(true); // dark mode state

  useEffect(() => {

    fetch("http://127.0.0.1:8000/admin/stats")
      .then(res => res.json())
      .then(data => {

        setStats(data);

        setOrderData([
          { name: "Orders", orders: data.total_orders || 0 },
          { name: "Recipes", orders: data.total_recipes || 0 },
          { name: "Products", orders: data.total_products || 0 }
        ]);

        setRevenueData([
          { name: "Revenue", revenue: data.revenue || 0 }
        ]);
      });

    fetch("http://127.0.0.1:8000/admin/monthly-revenue")
      .then(res => res.json())
      .then(data => setMonthlyRevenue(data));

  }, []);

  const cards = [
    { title: "Orders", value: stats.total_orders || 0, color: "bg-blue-500" },
    { title: "Revenue", value: `₹${stats.revenue || 0}`, color: "bg-green-500" },
    { title: "Recipes", value: stats.total_recipes || 0, color: "bg-orange-500" },
    { title: "Products", value: stats.total_products || 15, color: "bg-emerald-500" }
  ];

  return (

    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/admin-food-bg.jpg')" }}
    >

      <div className={`min-h-screen backdrop-blur-sm p-6 ${dark ? "bg-black/60 text-white" : "bg-white/80 text-black"}`}>

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

        </div>

        {/* Stats Cards */}

        <div className="grid grid-cols-4 gap-5 mb-10">

          {cards.map((c, i) => (

            <div
              key={i}
              className={`${c.color} text-white p-5 rounded-xl shadow-lg
              transform hover:scale-105 hover:-translate-y-1
              transition duration-300`}
            >
              <p className="text-sm">{c.title}</p>
              <h2 className="text-2xl font-bold">{c.value}</h2>
            </div>

          ))}

        </div>

        {/* Charts */}

        <div className="grid grid-cols-2 gap-6 mb-10">

          <div className={`${dark ? "bg-white/90 text-black" : "bg-gray-100"} p-5 rounded-xl shadow`}>

            <h3 className="font-semibold mb-4">
              Platform Activity
            </h3>

            <ResponsiveContainer width="100%" height={250}>

              <BarChart data={orderData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="orders" fill="#3B82F6"/>
              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className={`${dark ? "bg-white/90 text-black" : "bg-gray-100"} p-5 rounded-xl shadow`}>

            <h3 className="font-semibold mb-4">
              Revenue Overview
            </h3>

            <ResponsiveContainer width="100%" height={250}>

              <BarChart data={revenueData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Bar dataKey="revenue" fill="#10B981"/>
              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Monthly Revenue */}

        <div className={`${dark ? "bg-white/90 text-black" : "bg-gray-100"} p-5 rounded-xl shadow mb-10`}>

          <h3 className="font-semibold mb-4">
            Monthly Revenue
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="revenue" stroke="#10B981"/>
            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}