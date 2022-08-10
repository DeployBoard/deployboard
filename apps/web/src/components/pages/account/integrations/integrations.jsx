import { Box, Typography } from "@mui/material";

import Header from "../../../structure/header";
import AccountNav from "../accountNav";

const ApiKeys = () => {
  return (
    <>
      <Header />
      <AccountNav />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography>Integrations coming soon</Typography>
      </Box>
    </>
  );
};

export default ApiKeys;
