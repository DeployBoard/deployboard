import { Box, CssBaseline, Typography } from "@mui/material";

import MiniDrawer from "../../structure/headerDrawer";

const Analytics2 = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          Analytics2
        </Typography>
      </Box>
    </Box>
  );
};

export default Analytics2;
