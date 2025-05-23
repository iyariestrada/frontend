// Dashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const statCards = [
  { title: "Traffic", value: "350,897", change: "+3.48%", color: "green" },
  { title: "New Users", value: "2,356", change: "-3.48%", color: "red" },
  { title: "Sales", value: "924", change: "-1.10%", color: "orange" },
  { title: "Performance", value: "49.65%", change: "+12%", color: "green" },
];

const salesData = [
  { month: "Jan", 2022: 65, 2023: 40 },
  { month: "Feb", 2022: 75, 2023: 60 },
  { month: "Mar", 2022: 80, 2023: 85 },
  { month: "Apr", 2022: 55, 2023: 45 },
  { month: "May", 2022: 60, 2023: 50 },
  { month: "Jun", 2022: 70, 2023: 75 },
  { month: "Jul", 2022: 75, 2023: 90 },
];

const ordersData = [
  { month: "Jan", 2022: 40, 2023: 20 },
  { month: "Feb", 2022: 60, 2023: 50 },
  { month: "Mar", 2022: 80, 2023: 70 },
  { month: "Apr", 2022: 90, 2023: 40 },
  { month: "May", 2022: 40, 2023: 60 },
];

const StatCard = ({ title, value, change, color }) => (
  <div className="bg-white shadow rounded p-4">
    <h4 className="text-gray-500 text-sm">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
    <p
      className={`text-sm mt-1 ${
        color === "green"
          ? "text-green-500"
          : color === "red"
          ? "text-red-500"
          : "text-orange-500"
      }`}>
      {change} Since last period
    </p>
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Sales Value</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="2022" stroke="#8884d8" />
              <Line type="monotone" dataKey="2023" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="2022" fill="#8884d8" />
              <Bar dataKey="2023" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
