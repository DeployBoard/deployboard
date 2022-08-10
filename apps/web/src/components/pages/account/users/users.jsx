import { Box } from "@mui/material";

import Header from "../../../structure/header";
import AccountNav from "../accountNav";
import UsersTable from "./usersTable";

const Users = () => {
  return (
    <>
      <Header />
      <AccountNav />
      <Box>
        <UsersTable />
      </Box>
    </>
  );
};

export default Users;
