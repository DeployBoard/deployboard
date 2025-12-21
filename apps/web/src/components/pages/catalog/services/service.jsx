import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Box, LinearProgress, Typography, Grid } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import MiniDrawer from "../../../structure/headerDrawer";
import CustomSnackbar from "../../../structure/customSnackbar";
import ExternalLinks from "./externalLinks";
import Deployments from "./deployments";
import Maturity from "./maturity";
import Metadata from "./metadata";
import { getToken } from "../../../utils/auth";

const Service = () => {
  let { serviceId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getService = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URI}/services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(res.data);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          {serviceId}
        </Typography>
        {loading && <LinearProgress />}
        {error && <CustomSnackbar severity="error" message={error} />}
        <Grid container spacing={2}>
          <Grid size={4}>
            <Maturity />
          </Grid>
          <Grid size={4}>
            <Metadata data={data} />
          </Grid>
          <Grid size={4}>
            <ExternalLinks data={data} />
          </Grid>
          <Grid size={12}>
            <Deployments service={serviceId} />
          </Grid>
          {/* <Grid size={8}>
            <Dependencies links={links} />
          </Grid> */}
        </Grid>
      </Box>
    </Box>
  );
};

export default Service;
