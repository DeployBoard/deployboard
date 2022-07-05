import { Box } from "@mui/material";

import Header from "../../structure/header";
import ServicesTable from "./servicesTable";
import AddService from "./addService";

const Services = () => {
  return (
    <>
      <Header />
      <Box>
        <AddService />
        <ServicesTable />
      </Box>
    </>
  );
};

export default Services;
