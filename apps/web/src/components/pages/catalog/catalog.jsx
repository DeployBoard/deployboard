import { Box, Paper } from "@mui/material";

import Header from "../../structure/header";
import ServicesTable from "./servicesTable";
import TeamsTable from "./teamsTable";
import AddService from "./addService";

const Catalog = () => {
  return (
    <>
      <Header />
      <Box>
        {/* <AddService /> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            marginTop: "1rem",
          }}
        >
          <Paper elevation={1} sx={{ flex: 1, mr: "1rem", ml: "2rem" }}>
            <ServicesTable />
          </Paper>
          <Paper elevation={1} sx={{ flex: 1, mr: "2rem", ml: "1rem" }}>
            <TeamsTable />
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Catalog;
