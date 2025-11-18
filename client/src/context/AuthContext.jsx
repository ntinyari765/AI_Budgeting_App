import React, { createContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // optional loading state

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log("Sending login request with:", credentials);
      const { user, token } = await loginUser(credentials);
      console.log("Login response:", { user, token });

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("AuthContext login error:", error);
      throw error; // re-throw for frontend to catch
    }
  };

  const register = async (data) => {
    try {
      console.log("Sending register request with:", data);
      const { user, token } = await registerUser(data);
      console.log("Register response:", { user, token });

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("AuthContext register error:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};




