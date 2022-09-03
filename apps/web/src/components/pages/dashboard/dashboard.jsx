import { Box, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import MiniDrawer from "../../structure/headerDrawer";
import DashboardCards from "./dashboardCards";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          Dashboard
        </Typography>
        <DashboardCards />
      </Box>
    </Box>
  );
};

export default Dashboard;
