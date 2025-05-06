import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";

const Analytics = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/analytics/emotions-daily", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const chartData = res.data.map((entry) => ({
          date: entry.date,
          emotion: entry.top_emotion,
        }));
        setData(chartData);
      });
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Daily Top Emotions</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="emotion" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
