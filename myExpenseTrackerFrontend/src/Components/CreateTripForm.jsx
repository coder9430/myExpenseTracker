import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import UniqueIdPopup from "./UniqueIdPopup";
import { useState } from "react";

export default function CreateTripForm({ open, onClose }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [openUnique, setOpenUnique] = useState(false);
  const [uniqueId, setUniqueId] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("userId"); // Retrieve the user ID from storage or context
    if (!userId) {
      console.error("User not authenticated. Please log in.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Add the user ID, unique ID, and selected date to the form data
    formJson.createdBy = userId;
    formJson.date = selectedDate ? selectedDate.toISOString() : null; // Convert to ISO format for consistency

    try {
      const token = localStorage.getItem("token"); // Retrieve the JWT token from storage
      const response = await fetch(`${apiUrl}/trip/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(formJson),
      });

      if (response.ok) {
        const responseBody = await response.json();
        console.log("Trip created successfully with ID:", responseBody.uniqueId);

        // Set the unique ID and open the unique popup
        setUniqueId(responseBody.uniqueId);
        setTimeout(() => {
          setOpenUnique(true); // Open the Unique ID popup after setting the ID
        }, 500);

        onClose(); // Close the dialog
      } else {
        console.error("Failed to create trip.");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit, // Submit handler
        }}
      >
        <DialogTitle>Create a New Trip</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Effortlessly track and split trip expenses with friends, ensuring
            fair shares and stress-free memories.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="tripName"
            name="tripName"
            label="Trip Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            required
            margin="dense"
            id="desc"
            name="desc"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            sx={{ mb: 4 }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select a date"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="standard"
                  sx={{ mb: 2 }}
                />
              )}
            />
          </LocalizationProvider>
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
          <Button type="submit" variant="contained">
            Create Trip
          </Button>
        </DialogActions>
      </Dialog>
      <UniqueIdPopup
        open={openUnique}
        onClose={() => setOpenUnique(false)}
        uniqueId={uniqueId}
      />
    </>
  );
}
