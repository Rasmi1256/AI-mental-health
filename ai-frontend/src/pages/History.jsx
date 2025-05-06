import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const History = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState(
    /** @type {{ id: string; timestamp: string; analysis_type: string; input_data: string; result: string; }[]} */ ([]));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8000/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
      }
    };
    fetchHistory();
  }, [token]);

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Your Emotion History</h2>
      <ul className="space-y-4">
        {logs.map((log) => (
          <li key={log.id} className="p-4 bg-gray-50 rounded shadow">
            <p><strong>Date:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            <p><strong>Type:</strong> {log.analysis_type}</p>
            <p><strong>Input:</strong> {log.input_data}</p>
            <p><strong>Result:</strong> {log.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
