import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box, Modal, Typography, TextField, Button } from "@mui/material";

const UpiForm = ({ open, onClose }) => {
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL 

  useEffect(() => {
    // Fetch existing UPI ID from the backend (if any)
    const fetchUpiId = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Retrieve the JWT token from storage
        const response = await fetch(`${apiUrl}/api/auth/user/upi/${userId}`, {
          method: "GET",  // Use GET method to fetch UPI ID
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUpiId(data.upiId || "");
          setError("")
        } else {
          throw new Error("Failed to fetch UPI ID");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching UPI ID");
      }
    };

    if (open) {
      fetchUpiId();
    }
  }, [open]);

  const handleSave = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${apiUrl}/api/auth/user/upi/${userId}`, {
        method: "POST",  // Use POST method to update UPI ID
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upiId }),
      });

      if (response.ok) {
        onClose(); // Close form after successful save
        setError("")
      } else {
        throw new Error("Failed to update UPI ID");
      }
    } catch (err) {
      console.error(err);
      setError("Error saving UPI ID");
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upi-form-modal">
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2
      }}>
        <Typography variant="h6" component="h2" mb={2}>
          Manage Your UPI ID
        </Typography>
        <TextField
          fullWidth
          label="UPI ID"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          error={Boolean(error)}
          helperText={error}
          placeholder="example@upi"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
          fullWidth
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

UpiForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpiForm;
