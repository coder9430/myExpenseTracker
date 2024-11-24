import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PolylineIcon from "@mui/icons-material/Polyline";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import { useNavigate } from "react-router-dom";
import CreateForm from "../Components/CreateForm";
import TripCard from "../Components/TripCard"; // Ensure this is correctly imported
import SplitExpenseForm from "../Components/SplitExpenseForm";
import {useAuth} from "../Auth/AuthProvider"
import LogoutIcon from '@mui/icons-material/Logout';
import ChipsPopupForm2 from "../Components/ChipsPopupForm2"
import { Link } from "react-router-dom";
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  const [trips, setTrips] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/trip/user/${userId}`
        );
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

  return (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Your Trips
      </Typography>
      {trips.length === 0 ? (
        <Typography>No trips found. Create one to get started!</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
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
                <Link to={`/trip/${trip.uniqueId}`} style={{ textDecoration: "none" }}>
              <TripCard
                photo="https://www.shutterstock.com/shutterstock/photos/1247506609/display_1500/stock-vector-cabriolet-car-with-people-diverse-group-of-men-and-women-enjoy-ride-and-music-happy-young-friends-1247506609.jpg"
                tripName={trip.tripName}
                description={trip.desc}
                date={new Date(trip.date).toLocaleDateString()}
                codeToCopy={trip.uniqueId}
              />
              </Link>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function UserDashboard(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { window } = props;

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isChipFormOpen, setIsChipFormOpen] = useState(false);

  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };
  const handleCloseChipForm = () => {
    setIsChipFormOpen(false);
  };
  const handleOpenChipForm = () => {
    setIsChipFormOpen(true);
  };
  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };
  const handleLogout = () => {
    logout();
  };

  const router = useDemoRouter("/dashboard/:userId");
  const demoWindow = window !== undefined ? window() : undefined;

  const NAVIGATION = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: (
        <Typography onClick={() => navigate(`/dashboard/${userId}`)}>
          Dashboard
        </Typography>
      ),
      icon: (
        <DashboardIcon
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/dashboard/${userId}`)}
        />
      ),
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Actions",
    },
    {
      segment: "create",
      title: <Typography onClick={handleOpenCreateForm}>Create</Typography>,
      icon: (
        <AddBoxIcon
          onClick={handleOpenCreateForm}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      segment: "join",
      title: <Typography onClick={handleOpenChipForm}>Join</Typography>,
      icon: (
        <PolylineIcon
          onClick={handleOpenChipForm}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      kind: "divider",
    },
    {
      segment: "logout",
      title: <Typography onClick={handleLogout}>Logout</Typography>,
      icon: <LogoutIcon onClick={handleLogout} style={{ cursor: "pointer" }} />,
    },
  ];

  const BRANDING = {
    title: "myExpense",
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={BRANDING}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
        <CreateForm open={isCreateFormOpen} onClose={handleCloseCreateForm} />
        <ChipsPopupForm2 open={isChipFormOpen} onClose={handleCloseChipForm} />
      </DashboardLayout>
    </AppProvider>
  );
}

UserDashboard.propTypes = {
  window: PropTypes.func,
};

export default UserDashboard;
