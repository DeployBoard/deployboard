import { Box } from "@mui/material";

import Header from "../../structure/header";
import DashboardTable from "./dashboardTable";
import DashboardCards from "./dashboardCards";

const Dashboard = () => {
  return (
    <>
      <Header />
      <Box>
        <DashboardCards />
        {/* <DashboardTable /> */}
      </Box>
    </>
  );
};

export default Dashboard;
