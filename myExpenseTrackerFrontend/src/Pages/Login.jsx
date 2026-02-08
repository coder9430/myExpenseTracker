import React, { useState } from "react";
import { Box, TextField, Button, Typography, Card, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";

const SignIn = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // ✅ Single handler (same pattern as SignUp)
  const handleSignIn = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // 🔍 Frontend validation
    if (!email || !password) {
      setMessage("All fields are required");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Login failed");
        setMessageType("error");
        return;
      }

      // 🔐 JWT login
      login(data.token, data.userId);

      setMessage("Login successful!");
      setMessageType("success");

      navigate(`/dashboard/${data.userId}`);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "auto", p: 3, mt: 10 }}>
      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h4" align="center">
          Sign In
        </Typography>

        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
        />

        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          required
        />

        <Button type="submit" variant="contained" fullWidth>
          Sign In
        </Button>

        {/* Message */}
        {message && (
          <Typography
            sx={{
              mt: 1,
              textAlign: "center",
              color: messageType === "success" ? "green" : "red",
            }}
          >
            {message}
          </Typography>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <Link href="/signup" underline="hover">
            Sign Up
          </Link>
        </Typography>

        <Typography variant="body2" align="center">
          <Link href="/forgot-password" underline="hover">
            Forgot Password?
          </Link>
        </Typography>
      </Box>
    </Card>
  );
};

export default SignIn;
