import { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  LinearProgress,
  TextField,
  Typography,
  Button,
} from "@mui/material";

import MiniDrawer from "../../../structure/headerDrawer";
import CustomSnackbar from "../../../structure/customSnackbar";
import { getToken } from "../../../utils/auth";

const Environments = () => {
  const [environments, setEnvironments] = useState("[]");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // get environments
  const getEnvironments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/environments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      const envs = await response.json();
      // console.log(envs);
      setEnvironments(JSON.stringify(envs));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // make the api call
    try {
      await fetch(`${process.env.REACT_APP_API_URI}/environments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: environments,
      });
      setSuccess("Environments updated successfully");
      setLoading(false);
      getEnvironments();
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnvironments();
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      {loading ? <LinearProgress /> : null}
      {success ? (
        <CustomSnackbar severity={"success"} message={success} />
      ) : null}
      {error ? <CustomSnackbar severity={"error"} message={error} /> : null}
      <CssBaseline />
      <MiniDrawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ pb: "1rem" }}>
            Environments
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="Environments"
          value={environments}
          onChange={(event) => setEnvironments(event.target.value)}
          sx={{ mt: 2 }}
        />
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button
            loading={loading}
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Environments;
