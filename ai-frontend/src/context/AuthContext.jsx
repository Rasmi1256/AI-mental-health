import React, { createContext, useContext, useState, useEffect } from "react";

const defaultAuthContext = {
  token: /** @type {string | null} */ (null),
  user: /** @type {string | null} */ (null),
  login: /** @type {(token: string, username: string) => void} */ (() => {}),
  logout: /** @type {() => void} */ (() => {}),
};


const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(/** @type {string | null} */ (null));
  const [user, setUser] = useState(/** @type {string | null} */ (null));
  const [loading, setLoading] = useState(true); // NEW: For initial rehydration

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", username);
    setToken(token);
    setUser(username);
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Delay rendering until localStorage is read
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
