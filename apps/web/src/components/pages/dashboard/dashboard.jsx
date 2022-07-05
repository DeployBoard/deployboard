import { Box } from "@mui/material";

import Header from "../../structure/header";
import DashboardTable from "./dashboardTable";

const Dashboard = () => {
  return (
    <>
      <Header />
      <Box>
        <DashboardTable />
      </Box>
    </>
  );
};

export default Dashboard;
