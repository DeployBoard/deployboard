import { Box } from "@mui/material";

import Header from "../../../structure/header";
import AccountNav from "../accountNav";
import ApiKeysTable from "./apiKeysTable";

const ApiKeys = () => {
  return (
    <>
      <Header />
      <AccountNav />
      <Box>
        <ApiKeysTable />
      </Box>
    </>
  );
};

export default ApiKeys;
