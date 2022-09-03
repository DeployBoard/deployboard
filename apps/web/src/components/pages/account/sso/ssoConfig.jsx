import { Box, CssBaseline, Typography } from "@mui/material";

import MiniDrawer from "../../../structure/headerDrawer";
import SamlConfig from "./samlConfig";

const SSOConfig = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          SSO Config
        </Typography>
        <SamlConfig />
      </Box>
    </Box>
  );
};

export default SSOConfig;
