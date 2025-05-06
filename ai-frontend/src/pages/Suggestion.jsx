import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

const Suggestion = () => {
    const { token } = useAuth();
    const [data, setData] = useState({ emotion: "", message: "", suggestion: "" });
  
    useEffect(() => {
      axios
        .get("http://localhost:8000/suggestions", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setData(res.data));
    }, [token]);
  
    if (!data) return <p className="p-6">Loading suggestions...</p>;
  
    return (
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Mood-Based Suggestion</h2>
        <div className="bg-blue-50 p-4 rounded shadow">
          <p><strong>Detected Emotion:</strong> {data.emotion}</p>
          <p className="mt-2">{data.message}</p>
          <p className="mt-1 italic">{data.suggestion}</p>
        </div>
      </div>
    );

}
 

export default Suggestion;
