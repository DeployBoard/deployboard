import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Divider, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { getToken } from "../../../utils/auth";
import BarChart from "../../analytics/barChart";

const Deployments = ({ service }) => {
  const [topEnvironment, setTopEnvironment] = useState("");

  const getEnvironments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URI}/environments`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      // console.log(response.data);
      // grab the last environment in the list
      setTopEnvironment(response.data[response.data.length - 1]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEnvironments();
  }, []);

  return (
    <Paper>
      <Box display="flex" sx={{ p: "1rem" }}>
        <Typography variant="h6">Deployments</Typography>
        <Typography variant="h6">&nbsp;</Typography>
        <Typography variant="body2">({topEnvironment})</Typography>
      </Box>

      <Divider />

      <Container>
        <BarChart
          daysAgo={14}
          filter={{ service: service, environment: topEnvironment }}
        />
      </Container>
    </Paper>
  );
};

export default Deployments;
