import { Box, CssBaseline, Typography } from "@mui/material";

import MiniDrawer from "../../../structure/headerDrawer";
import UsersTable from "./usersTable";

const Users = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          Users
        </Typography>
        <UsersTable />
      </Box>
    </Box>
  );
};

export default Users;
