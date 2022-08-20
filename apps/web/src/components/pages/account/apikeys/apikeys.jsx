import { Box } from "@mui/material";

import Header from "../../../structure/header";
import AccountNav from "../accountNav";
import AddApiKey from "./addApiKey";
import ApiKeysTable from "./apiKeysTable";

const ApiKeys = () => {
  return (
    <>
      <Header />
      <AccountNav />
      <AddApiKey />
      <Box>
        <ApiKeysTable />
      </Box>
    </>
  );
};

export default ApiKeys;
