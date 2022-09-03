import { Box, CssBaseline, Typography } from "@mui/material";

import MiniDrawer from "../../../structure/headerDrawer";

const ApiKeys = () => {
  return (
    <>
      <CssBaseline />
      <MiniDrawer />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography>Integrations coming soon</Typography>
      </Box>
    </>
  );
};

export default ApiKeys;
