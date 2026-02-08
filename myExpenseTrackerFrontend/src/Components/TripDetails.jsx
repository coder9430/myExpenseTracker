import React from "react";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TripCard from "./TripCard";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const TripDetails = () => {
  const [trips, setTrips] = useState([]);
  const userId = localStorage.getItem("userId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the JWT token from storage
        const response = await fetch(`${apiUrl}/trip/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  const onCardClick = (tripId) => {
    navigate(`/dashboard/trip/${tripId}`);
  };

  return (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography
        variant="h4" // Defines the size and style of the heading
        component="h1" // Semantic HTML element
        gutterBottom // Adds spacing below the heading
        sx={{
          color: "primary.main", // Use theme's primary color
          textAlign: "center", // Center-align the text
          fontWeight: "bold", // Make the text bold
          marginTop: 2, // Add margin to the top
        }}
      >
        Your Trips
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: grey[700],
          mt: 1,
          textAlign: "center",
          fontStyle: "italic",
        }}
      >
        * Refresh if New Trips are not visible.
      </Typography>
      {trips.length === 0 ? (
        <Typography>No trips found. Create one to get started!</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          {trips.map((trip) => (
            <Box
              key={trip.uniqueId}
              sx={{
                width: { xs: "100%", sm: "45%", md: "30%" }, // Responsive widths
                boxSizing: "border-box",
                padding: "10px",
                marginBottom: "20px",
              }}
            >
              <TripCard
                photo="https://www.shutterstock.com/shutterstock/photos/1247506609/display_1500/stock-vector-cabriolet-car-with-people-diverse-group-of-men-and-women-enjoy-ride-and-music-happy-young-friends-1247506609.jpg"
                tripName={trip.tripName}
                description={trip.desc}
                date={new Date(trip.date).toLocaleDateString()}
                onCardClick={onCardClick}
                codeToCopy={trip.uniqueId}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TripDetails;
