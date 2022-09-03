import { Box, CssBaseline, Typography } from "@mui/material";

import MiniDrawer from "../../../structure/headerDrawer";
import AddApiKey from "./addApiKey";
import ApiKeysTable from "./apiKeysTable";

const ApiKeys = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Put the Typography on the left and the AddApiKey Button on the right */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ pb: "1rem" }}>
            API Keys
          </Typography>
          <AddApiKey />
        </Box>
        <ApiKeysTable />
      </Box>
    </Box>
  );
};

export default ApiKeys;
