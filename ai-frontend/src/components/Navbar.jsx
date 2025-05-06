import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-purple-600 p-4 text-white flex space-x-4">
  <Link to="/" className="font-semibold">Home</Link>
  <Link to="/chat">Chat</Link>
  <Link to="/audio">Voice Emotion</Link>
  <Link to="/face">Face Emotion</Link>
  <Link to="/history">History</Link>
  <Link to="/analytics">Analytics</Link>
  <Link to="/suggestions">Suggestions</Link>
</nav>
);

export default Navbar;
