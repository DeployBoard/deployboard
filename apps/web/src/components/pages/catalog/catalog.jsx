import { Box, Paper, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import MiniDrawer from "../../structure/headerDrawer";
import ServicesTable from "./servicesTable";
import TeamsTable from "./teamsTable";
import AddService from "./addService";

const Catalog = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          Catalog
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            marginTop: "1rem",
          }}
        >
          <Paper elevation={1} sx={{ flex: 1, mr: "2rem" }}>
            <ServicesTable />
          </Paper>
          <Paper elevation={1} sx={{ flex: 1 }}>
            <TeamsTable />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Catalog;
