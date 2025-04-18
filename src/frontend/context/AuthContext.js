import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user_id");
    if (stored) setUserId(parseInt(stored));
  }, []);

  const login = (id) => {
    setUserId(id);
    localStorage.setItem("user_id", id);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("user_id");
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
