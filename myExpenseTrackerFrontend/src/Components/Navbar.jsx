import React from "react";
import { Box, Typography, Button, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
      flexDirection={isSmallScreen ? "column" : "row"}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          backgroundImage: "linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        myExpense
      </Typography>
      <Box mt={isSmallScreen ? 2 : 0}>
        <Button
          variant="contained"
          sx={{
            backgroundImage:
              "linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)",
            color: "#fff",
            marginRight: "1rem",
            "&:hover": {
              backgroundImage:
                "linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)",
            },
          }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          sx={{
            border: "2px solid #0a6a9b",
            color: "#0a6a9b",
            "&:hover": {
              backgroundColor: "#0a6a9b",
              color: "#fff",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Navbar;
