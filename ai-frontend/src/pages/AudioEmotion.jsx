import React, { useState } from "react";
import axios from "axios";

const AudioEmotion = () => {
  const [file, setFile] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setEmotion(null);
    setError(null);
  };

  const uploadAndAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/audio_emotion",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setEmotion(res.data.predicted_emotion);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Voice Emotion Detection</h2>

      <input
        type="file"
        accept="audio/*"
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

      {emotion && (
        <div className="mt-6 p-4 bg-purple-100 rounded shadow">
          <strong>Detected Emotion:</strong> {emotion}
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

export default AudioEmotion;

