import { Box } from "@mui/material";

import Header from "../../structure/header";
import LogsTable from "./logsTable";

const Logs = () => {
  return (
    <>
      <Header />
      <Box>
        <LogsTable />
      </Box>
    </>
  );
};

export default Logs;
