import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Typography,
  Alert,
} from "@mui/material";

const JoinTrip = ({ open, onClose }) => {
  const [tripCode, setTripCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Clear alert after a few seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 4000); // Set to disappear after 4 seconds
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [successMessage, error]);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleJoinTrip = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from storage 
      const response = await fetch(`${apiUrl}/trip/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tripCode, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Successfully joined the trip!"); // Set success message
        setError(""); // Clear any previous errors
        onClose();
      } else {
        setError(data.message || "Failed to join the trip");
        setSuccessMessage(""); // Clear success message if there is an error
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      setSuccessMessage(""); // Clear success message if there is an error
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Join Trip</DialogTitle>
      <DialogContent>
        <TextField
          label="Trip Code"
          value={tripCode}
          onChange={(e) => setTripCode(e.target.value)}
          fullWidth
          margin="dense"
        />
        {/* Display success message as an Alert */}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              position: "fixed",
              top: 70,
              width: "50%",
              zIndex: 100,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {successMessage}
          </Alert>
        )}
        {/* Display error message as an Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              position: "fixed",
              top: 70,
              width: "50%",
              zIndex: 100,
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          sx={{
            "&:hover": {
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              color: "error.main",
            },
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleJoinTrip} color="primary">
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinTrip;
