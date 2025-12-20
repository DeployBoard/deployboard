import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { Box, Typography, LinearProgress, CssBaseline, Grid } from "@mui/material";

import MiniDrawer from "../../../structure/headerDrawer";
import Metadata from "./metadata";
import ExternalLinks from "../services/externalLinks";
import { getToken } from "../../../utils/auth";

const Team = () => {
  let { teamId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTeam = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URI}/teams/${teamId}`,
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
    getTeam();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" sx={{ pb: "1rem" }}>
          {teamId}
        </Typography>
        {loading && <LinearProgress />}
        {error && <CustomSnackbar severity="error" message={error} />}
        <Grid container spacing={2}>
          <Grid size={4}>
            <Metadata data={data} />
          </Grid>
          <Grid size={4}>
            <ExternalLinks data={data} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Team;
