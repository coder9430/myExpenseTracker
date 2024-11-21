import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useDemoRouter } from "@toolpad/core/internal";
import CreateForm from "../Components/CreateForm";
import AddBoxIcon from '@mui/icons-material/AddBox';
import PolylineIcon from '@mui/icons-material/Polyline';
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function UserDashboard(props) {
  const navigate = useNavigate();
  const { window } = props;

  const [isCreateFormOpen, setIsCreateFormOpen] = React.useState(false);

  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const router = useDemoRouter("/dashboard");
  const demoWindow = window !== undefined ? window() : undefined;

  // Updated navigation to include the handler
  const NAVIGATION = [
    {
      kind: "header",
      title: "Main items",
    },
    {
      segment: "dashboard",
      title: <Typography onClick={()=> navigate("/dashboard")}>Dashboard</Typography>,
      icon: <DashboardIcon style={{ cursor: "pointer" }} onClick={()=> navigate("/dashboard")}/>,
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
      title: <Typography onClick={handleOpenCreateForm}>Join</Typography>,
      icon: (
        <PolylineIcon
          onClick={handleOpenCreateForm}
          style={{ cursor: "pointer" }}
        />
      ),
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
        {/* Include CreateForm */}
        <CreateForm open={isCreateFormOpen} onClose={handleCloseCreateForm} />
      </DashboardLayout>
    </AppProvider>
  );
}

UserDashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default UserDashboard;
