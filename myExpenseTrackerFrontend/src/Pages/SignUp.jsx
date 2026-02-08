import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Link,
} from "@mui/material";
import { useAuth } from "../Auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [message, setMessage] = React.useState("");
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    // 🔍 Frontend validation
    if (!username || !email || !password) {
      setMessage("All fields are required");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Signup failed");
        return;
      }

      // ✅ CORRECT JWT STORAGE (NO COOKIES)
      login(data.token, data.userId);

      setMessage("Account created successfully!");
      setFormData({ username: "", email: "", password: "" });

      navigate(`/dashboard/${data.userId}`);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <AppProvider theme={theme}>
      <Card
        sx={{
          maxWidth: 400,
          margin: "auto",
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSignUp}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4">Sign Up</Typography>

          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <TextField
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <Button type="submit" variant="contained" fullWidth>
            Sign Up
          </Button>

          {message && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: message.includes("success") ? "green" : "red",
              }}
            >
              {message}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/login" underline="hover">
              Go to login
            </Link>
          </Typography>
        </Box>
      </Card>
    </AppProvider>
  );
};

export default SignUp;
