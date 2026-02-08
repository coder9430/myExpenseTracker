import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// Create the Auth Context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔐 PART 4 — AUTO LOGIN ON REFRESH
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN — stores token + userId
  const login = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
  };

  // 🔐 PART 5 — LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  // Loader while checking auth
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #2196f3, #21cbf3)",
          color: "#fff",
        }}
      >
        <CircularProgress size={80} thickness={5} sx={{ color: "#fff", mb: 2 }} />
        <Box
          component="h1"
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
          }}
        >
          Loading, please wait...
        </Box>
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
