import { Box, CssBaseline, Typography } from "@mui/material";

import MiniDrawer from "../../structure/headerDrawer";
import LogsTable from "./logsTable";

const Logs = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          Logs
        </Typography>
        <LogsTable />
      </Box>
    </Box>
  );
};

export default Logs;
