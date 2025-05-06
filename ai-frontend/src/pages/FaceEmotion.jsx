import React, { useState } from "react";
import axios from "axios";

const FaceEmotion = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // Or use your AuthContext

      const res = await axios.post(
        "http://localhost:8000/face-emotion",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}` // ✅ Add this
          }
        }
      );
      
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Facial Emotion Detection</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block mb-4"
      />

      <button
        onClick={uploadAndAnalyze}
        disabled={!file || loading}
        className="bg-purple-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-purple-100 rounded shadow">
          <p>
            <strong>Dominant Emotion:</strong> {result.dominant_emotion}
          </p>
          <div className="mt-2">
            <strong>Emotion Scores:</strong>
            <ul className="list-disc list-inside">
              {Object.entries(result.emotion_scores).map(
                ([emotion, score]) => (
                  <li key={emotion}>
                    {emotion}: {score.toFixed(2)}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded shadow">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default FaceEmotion;
