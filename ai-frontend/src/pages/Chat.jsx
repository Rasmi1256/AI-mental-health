import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [companionReply, setCompanionReply] = useState(null);
  const [error, setError] = useState("");

  // Get token from localStorage or context
  const token = localStorage.getItem("token"); // Or use your AuthContext

  const sendMessage = async () => {
    if (!message.trim()) {
      console.warn("Message is empty. Not sending.");
      return;
    }

    console.log("Sending message:", message);

    try {
      const res = await axios.post(
        "http://localhost:8000/conversation",
        { message }, // ✅ Send message in request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Token must be prefixed with "Bearer"
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Response received:", res.data);
      setCompanionReply(res.data.companion_reply);
      setMessage(""); // Clear input
      setError("");
    } catch (err) {
      console.error("Error while sending message:", err);
      setError("Failed to get response from companion.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <textarea
        rows={4}
        className="w-full border p-2 rounded"
        placeholder="Tell me how you're feeling..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setError("");
        }}
      />

      <button
        onClick={sendMessage}
        className="mt-3 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
      >
        Send
      </button>

      {companionReply && (
        <div className="mt-6 p-4 bg-purple-100 rounded shadow">
          <strong>AI Companion:</strong> {companionReply}
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default Chat;

