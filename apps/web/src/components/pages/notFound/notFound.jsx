import { Box, CssBaseline, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          404 - Not Found
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFound;
