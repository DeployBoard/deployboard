import { Box } from "@mui/material";

import Header from "../../structure/header";
import DashboardCards from "./dashboardCards";

const Dashboard = () => {
  return (
    <>
      <Header />
      <Box>
        <DashboardCards />
      </Box>
    </>
  );
};

export default Dashboard;
