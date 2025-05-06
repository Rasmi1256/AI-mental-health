import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AudioEmotion from "./pages/AudioEmotion";
import FaceEmotion from "./pages/FaceEmotion";
import { useAuth } from "./context/AuthContext";
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { AuthProvider } from "./context/AuthContext"; // Ensure this exists
import History from './pages/History';
import Analytics from './pages/Analytics';
import Suggestion from './pages/Suggestion';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider> {/* Wrap the entire app in AuthProvider */}
      
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audio"
            element={
              <ProtectedRoute>
                <AudioEmotion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/face"
            element={
              <ProtectedRoute>
                <FaceEmotion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
               path="/analytics"
               element={
               <ProtectedRoute>
                  <Analytics />
               </ProtectedRoute>
         }
       />
       <Route
          path="/suggestions"
          element={
                <ProtectedRoute>
                   <Suggestion />
                </ProtectedRoute>
        }
        />

        </Routes>
      
    </AuthProvider>
  );
};

export default App;

